const driver = require('../../config/neo4j');
const { PromptTemplate } = require("@langchain/core/prompts");
//import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
const {HuggingFaceInferenceEmbeddings} = require('@langchain/community/embeddings/hf');
const { ChatGroq } = require("@langchain/groq");
require('dotenv').config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", 
  temperature: 0.5,
});

const embedder = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY, 
  model: "sentence-transformers/all-MiniLM-L6-v2", 
});

const chatWithLLM = async (userMessage, currentLocationId, k = 3) => {
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
        const promptTemplate = PromptTemplate.fromTemplate(`
            System: You are a helpful guide at ENSAM Meknes.
            Use the following context to answer the user's question.
            
            Context: 
            {context}
            
            User Question: {question}
            
            IMPORTANT:
            - If the user asks to "Go to", "Take me to", or "Navigate to" a specific place, reply ONLY with this JSON format (no other text):
              {{ "action": "NAVIGATE", "target": "Name of the place" }}
            - Otherwise, reply with a helpful, friendly text answer based on the context.
        `);

        const chain = promptTemplate.pipe(model);

        const response = await chain.invoke({
            context: finalContext, 
            question: userMessage
        });

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