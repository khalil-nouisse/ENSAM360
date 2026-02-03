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
  console.log(" Starting Database Seeding...");

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
        content: "This area is the central parking lot, reserved exclusively for ENSAM Meknès professors and administrative staff."
      },
      {
        name: "Salle Info 7",
        content: "Located within the TD1 building, Room 7 is exclusively reserved for the GI-ILSI program. Inaugurated in 2025, it is equipped with high-speed fiber optic Wi-Fi, a server, and an EPSON projector."
      },
      {
        name: "TD1",
        content: "TD1 is a complex comprising multiple rooms. It houses Room 7 (reserved for the GI-ILSI program), classrooms dedicated to the Artificial Intelligence specialization, and other rooms for the Integrated Preparatory Cycle."
      },
      {
        name: "TD2",
        content: "TD2 is a space containing several classrooms, the majority of which are designated for the Integrated Preparatory Cycle , it doesnt contain presence device ! , the presence logging devices exist outside the building near the entrance. "
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
        content: "This facility houses the language classrooms as well as the main library area. It features additional rooms on the upper level, including a designated reserved room."
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
      },
      {
        name: "ENSAM Meknes",
        content: "ENSAM Meknès is one of Morocco’s leading engineering schools, known for its strong scientific and technical training. It offers programs in industrial, mechanical, electrical, Software and AI engineering with a focus on innovation, practical learning, and collaboration with industry. Located in Meknès, the school provides a dynamic campus environment that encourages creativity, leadership, and hands-on project experience."
      },
      {
        name: "Espace de pointeuses",
        content: "Situated next to the entrance of the TD2 building, this area contains devices for students to log their presence."
      },
      {
        name: "La Laboratoire Industriel",
        content: "The Industrial Laboratory is a hub for hands-on training in industrial engineering. It features specialized laboratories for mechanical, electrical, and software engineering, as well as a workshop for practical projects. The lab is equipped with computers for industrial simulation and supervision, a conveyor system controlled by an industrial programmable logic controller (PLC), and a storage area containing metallic plates manipulated by a robotic arm. The laboratory also includes multiple robotic arms used for automation and control experiments. "
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