// scripts/seedDb.js
//const driver = require('../config/neo4j');
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
//const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
import dotenv from 'dotenv';
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

    // TODO : new DATA FORM
    const topics = [
      {
        name: "AUF",
        content: "The AUF Building (Agence Universitaire de la Francophonie) is primarily dedicated to language learning, workshops, and soft skills training."
      },
      {
        name: "Buvette",
        content: "The Student Cafeteria (Buvette) is a social space where students can buy snacks, coffee, and light meals during breaks. It is located centrally near the parking area."
      },
      {
        name: "Centre de Recherche",
        content: "The Research Center is a hub for scientific innovation at ENSAM. It houses specialized laboratories for PhD students and researchers, as well as industrial drawing and design halls."
      },
      {
        name: "Civil",
        content: "The Civil Engineering Department building. This location hosts classrooms, faculty offices, and laboratories dedicated to construction materials, structural engineering, and topography."
      },
      {
        name: "Parking",
        content: "The main parking area of ENSAM Meknes, located centrally within the campus for faculty, staff, and visitors."
      },
      {
        name: "Salle Info 7",
        content: "Computer Lab 7 (Salle Info 7). This room is equipped with computers and is primarily used by the Computer Engineering, Software Engineering, and Intelligent Systems streams for practical programming work."
      },
      {
        name: "TD1",
        content: "TD1 is a dedicated building for Tutorial Classes (Travaux Dirigés). It consists of smaller classrooms designed for problem-solving sessions and small group work."
      },
      {
        name: "TD2",
        content: "TD2 is a building for Tutorial Classes (Travaux Dirigés), located adjacent to TD1. It hosts various engineering seminars and exercise sessions."
      },
      {
        name: "Administration",
        content: "The General Administration building. This is the headquarters of the school, housing the Director's office, the Secretary General, and financial services."
      },
      {
        name: "Administration Etud",
        content: "The Student Affairs Administration (Service de la Scolarité). Students go here for administrative matters such as enrollment, retrieving transcripts, internship agreements, and student ID cards."
      },
      {
        name: "Bibliotheque et Centre de Langue",
        content: "The Main Library and Language Center. It provides a quiet environment for study, a collection of engineering textbooks and thesis reports, as well as resources for foreign language improvement."
      },
      {
        name: "AEEE",
        content: "The AEEE Department (Department of Automatic Control, Electronics, Energy, and Environment). This building contains specialized electronics labs, automation benches, and energy systems workshops."
      },
      {
        name: "MathInfo",
        content: "The Mathematics and Computer Science Department. This building is the center for theoretical math courses and practical IT training, housing several computer labs and the university's server rooms."
      },
      {
        name: "Salle Conference",
        content: "The Main Conference Hall. This is a large venue used for official ceremonies, guest lectures, seminars, and important school gatherings."
      },
      {
        name: "Amphi 3",
        content: "Amphitheater 3 is a large lecture hall designed for mass instruction, conferences, and joint courses between different engineering years."
      }, {
        name: "ENSAM Meknes",
        content: "ENSAM Meknès is one of Morocco’s leading engineering schools, known for its strong scientific and technical training. It offers programs in industrial, mechanical, electrical, Software and AI engineering with a focus on innovation, practical learning, and collaboration with industry. Located in Meknès, the school provides a dynamic campus environment that encourages creativity, leadership, and hands-on project experience."
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