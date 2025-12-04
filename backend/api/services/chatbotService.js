const driver = require('../../config/neo4j');
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { ChatGroq } = require("@langchain/groq");
// for chatbot memory
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { RunnableWithMessageHistory, RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");
// to limit the context window
const { trimMessages } = require("@langchain/core/messages");
require('dotenv').config();

// every user have his own message history with the chatbot
const userHistories = {};

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
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

        // Vector Search (RAG) 
        // Find general knowledge relevant to the question
        const messageVector = await embedder.embedQuery(userMessage);

        const searchResult = await session.run(`
            CALL db.index.vector.queryNodes('ensam_knowledge', $k, $messageVector)
            YIELD node, score
            RETURN node.content AS info, score
        `, { k, messageVector });

        let knowledgeBaseInfo = "";

        searchResult.records.forEach(rec => {
            // Only use info if it's actually similar (score > 0.75 is usually a good threshold)
            if (rec.get('score') > 0.75) {
                knowledgeBaseInfo += "- " + rec.get('info') + "\n";
            }
        });

        // Combine Context 
        const finalContext = `
        CURRENT USER LOCATION: ${locationInfo}
        
        RELEVANT KNOWLEDGE BASE INFO:
        ${knowledgeBaseInfo}
        `;

        // Run LLM Chain 
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful guide at ENSAM Meknes. Use the context and history.", `IMPORTANT:
            - If the user asks to "Go to", "Take me to", or "Navigate to" a specific place, reply ONLY with this JSON format (no other text):
                {{ "action": "NAVIGATE", "target": "Name of the place" }}
            - Otherwise, reply with a helpful, friendly text answer based on the context.`],
            new MessagesPlaceholder("chat_history"), // History is injected here
            ["system", `Context: ${finalContext}`],
            ["human", "{question}"],
        ]);

        // We configure it to keep approx the last 10 messages (assuming ~50 tokens/msg)
        const historyTrimmer = trimMessages({
            maxTokens: 500,
            strategy: "last",
            tokenCounter: model,
            includeSystem: false, // We handle system prompt in the template, so just trim the history
            startOn: "human",
        });

        //const coreChain = promptTemplate.pipe(model);
        const coreChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                chat_history: async (input) => {
                    // Input.chat_history contains ALL messages from memory.
                    // We invoke the trimmer to cut it down.
                    if (!input.chat_history || input.chat_history.length === 0) return [];
                    return await historyTrimmer.invoke(input.chat_history);
                }
            }),
            promptTemplate,
            model
        ]);

        const chainWithHistory = new RunnableWithMessageHistory({
            runnable: coreChain,
            // LangChain calls this function and passes the 'sessionId' from config
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

        // --- STEP 5: Parse JSON (Navigation Logic) ---
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
            // If JSON parse fails, it's just a normal text message
        }

        return { type: "message", text: text };

    } catch (e) {
        console.error("Chat Error:", e);
        return { type: "error", text: "I'm having trouble connecting to my brain right now." };
    } finally {
        await session.close(); // FIX: Close session, not 'graph'
    }
};

module.exports = { chatWithLLM };