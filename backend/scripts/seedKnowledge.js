// scripts/seedDb.js
//const driver = require('../config/neo4j');

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import dotenv from "dotenv";
dotenv.config();
//require('dotenv').config();

const embedder = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY, 
  model: "sentence-transformers/all-MiniLM-L6-v2", 
});

const seed = async (driver) => {
  const session = driver.session();
  console.log("🌱 Starting Database Seeding...");

  try {
    // 1. Create the Vector Index (if it doesn't exist)
    // 384 is the dimension size for huggingface text-embedding-3-small or ada-002
    console.log("Creating Vector Index...");
    await session.run(`
      CREATE VECTOR INDEX ensam_knowledge IF NOT EXISTS
      FOR (n:Topic) ON (n.embedding)
      OPTIONS {indexConfig: {
       \`vector.dimensions\`: 384,
       \`vector.similarity_function\`: 'cosine'
      }}
    `);

    // Wait a moment for index to come online
    await new Promise(r => setTimeout(r, 5000)); 

    // Add some "General Knowledge" Data
    const topics = [
      { 
        name: "Cafeteria", 
        content: "The cafeteria is located near Building B. It offers sandwiches, coffee, and lunch from 8 AM to 4 PM." 
      },
      { 
        name: "Library", 
        content: "The library (Bibliothèque) is a quiet zone for studying. It contains engineering textbooks and computers." 
      },
      { 
        name: "Director", 
        content: "The current director of ENSAM Meknes is dedicated to engineering excellence." 
      },
      {
        name: "Mechanics Workshop",
        content: "The mechanics workshop contains CNC machines, lathes, and milling machines for student practicals."
      }
    ];

    console.log("Embedding and inserting topics...");
    
    for (const topic of topics) {
      // Create embedding vector
      const vector = await embedder.embedQuery(topic.content);

      // Save to Neo4j
      await session.run(`
        MERGE (t:Topic {name: $name})
        SET t.content = $content,
            t.embedding = $vector
      `, {
        name: topic.name,
        content: topic.content,
        vector: vector
      });
      console.log(` -> Added: ${topic.name}`);
    }

    console.log("✅ Seeding Complete!");

  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    await session.close();
    //await driver.close();
  }
};

//seed();

export { seed };