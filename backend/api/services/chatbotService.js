const driver = require('../../config/neo4j');
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { ChatGroq } = require("@langchain/groq");
// for chatbot memory
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { RunnableWithMessageHistory, RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");
// to limit the context window
const { trimMessages } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
require('dotenv').config();

// every user have his own message history with the chatbot
const userHistories = {};

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    maxOutputTokens: 800,
    top_p: 0.9,                // Balanced creativity
    frequency_penalty: 0.2,    // Stops repetition
    presence_penalty: 0.1,     // Slight boost for idea diversity
});

const embedder = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
});

// function to get the message history
const getHistoryForUser = (userId) => {
    if (!userHistories[userId]) {
        console.log(`[Server] Creating new memory for user: ${userId}`);
        userHistories[userId] = new InMemoryChatMessageHistory();
    }
    return userHistories[userId];
};


const chatWithLLM = async (userMessage, currentLocationId, userId, k = 3) => {

    if (!userId) {
        return { type: "error", text: "User ID is missing. I don't know whose memory to access." };
    }
    const session = driver.session();

    try {
        // Get Current Location Details 
        const locationResult = await session.run(`
            MATCH (l:Location {id: $id})
            RETURN l.name AS name, l.description AS description
        `, { id: currentLocationId });

        let locationInfo = "Unknown Location";
        if (locationResult.records.length > 0) {
            const rec = locationResult.records[0];
            locationInfo = `${rec.get('name')} (${rec.get('description')})`;
        }

        // --- STEP 1: History-Aware Retrieval 
        // We need to rephrase the user's question if it depends on history.
        const history = await getHistoryForUser(userId).getMessages();

        // Helper to trim history for the standalone question generation
        // using the same trimMessages utility
        const historyTrimmer = trimMessages({
            maxTokens: 1200,
            strategy: "last",
            tokenCounter: model,
            includeSystem: false,
            startOn: "human",
        });

        const trimmedHistory = await historyTrimmer.invoke(history);

        let standaloneQuestion = userMessage;

        if (trimmedHistory.length > 0) {
            const standaloneQuestionPrompt = ChatPromptTemplate.fromTemplate(`
                Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
                If the follow up question is already standalone, return it as is.
                Include any relevant context from the chat history (like the location being discussed) in the standalone question.

                Chat History:
                {chat_history}

                Follow Up Input: {question}
                Standalone question:`);

            const standaloneChain = standaloneQuestionPrompt.pipe(model).pipe(new StringOutputParser());
            // We use a StringOutputParser so we get just the text string back
            const historyString = trimmedHistory.map(m => `${m._getType()}: ${m.content}`).join("\n");

            standaloneQuestion = await standaloneChain.invoke({
                chat_history: historyString,
                question: userMessage
            });

            console.log(`[Chatbot] original: "${userMessage}" -> standalone: "${standaloneQuestion}"`);
        }

        // --- STEP 2: Vector Search (RAG) using Standalone Question ---
        const messageVector = await embedder.embedQuery(standaloneQuestion);

        const searchResult = await session.run(`
            CALL db.index.vector.queryNodes('ensam_knowledge', $k, $messageVector)
            YIELD node, score
            RETURN node.content AS info, score
        `, { k, messageVector });

        let knowledgeBaseInfo = "";

        searchResult.records.forEach(rec => {
            // Only use info if it's actually similar (score > 0.75 is usually a good threshold)
            if (rec.get('score') > 0.70) {
                knowledgeBaseInfo += "- " + rec.get('info') + "\n";
            }
        });

        // --- STEP 3: Final Answer Generation ---

        const finalContext = `
        CURRENT USER LOCATION: ${locationInfo}
        
        RELEVANT KNOWLEDGE BASE INFO:
        ${knowledgeBaseInfo}
        `;

        // Run LLM Chain 
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", `
            You are a helpful and knowledgeable guide at ENSAM Meknes.
            
            CONTEXT INFORMATION:
            {context}

            INSTRUCTIONS:
            1.  **Be Accurate:** Answer the user's question based ONLY on the provided context and the conversation history. If the answer is not in the context, politely say you don't have that information. Do not makeup facts.
            2.  **Be Concise & Clear:** Keep answers direct. Avoid unnecessary fluff.
            3.  **Formatting:** Use bullet points for lists. Use bold text for key terms or location names.
            4.  **Tone:** Professional, friendly, and helpful.
            
            CRITICAL NAVIGATION RULE:
            - If the user explicitly asks to "Go to", "Take me to", or "Navigate to" a specific place, reply with a JSON object ONLY: {{"action": "NAVIGATE", "target": "Exact Location Name from Context"}}. Do not add any extra text.
            - If they just ask "Where is..." or "How do I get to...", explain it verbally using the context, unless they specifically ask for navigation/guidance.
            `],
            new MessagesPlaceholder("chat_history"),
            ["human", "{question}"],
        ]);

        const chain = RunnableSequence.from([
            RunnablePassthrough.assign({
                chat_history: async () => {
                    return trimmedHistory;
                },
                context: () => finalContext, // Pass our prepared context
            }),
            promptTemplate,
            model
        ]);

        const chainWithHistory = new RunnableWithMessageHistory({
            runnable: chain,
            getMessageHistory: (sessionId) => getHistoryForUser(sessionId),
            inputMessagesKey: "question",
            historyMessagesKey: "chat_history",
        });

        const response = await chainWithHistory.invoke(
            { question: userMessage },
            // CRITICAL: We pass the userId here as the 'sessionId' configuration
            { configurable: { sessionId: userId } }
        );

        const text = response.content;

        // --- STEP 4: Parse JSON (Navigation Logic) ---
        try {
            // Check if the response looks like JSON
            if (text.trim().startsWith('{') && text.includes("NAVIGATE")) {
                const parsed = JSON.parse(text);
                if (parsed.action === "NAVIGATE") {
                    return {
                        type: "action",
                        text: `Sure! Taking you to ${parsed.target}...`,
                        destinationName: parsed.target
                    };
                }
            }
        } catch (jsonError) {
            // Not JSON, normal text
        }

        return { type: "message", text: text };

    } catch (e) {
        console.error("Chat Error:", e);
        return { type: "error", text: "I'm having trouble connecting to my brain right now." };
    } finally {
        await session.close();
    }
};

module.exports = { chatWithLLM };