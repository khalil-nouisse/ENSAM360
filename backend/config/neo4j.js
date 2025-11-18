// 1. Charger les variables de .env dans process.env
require('dotenv').config();

const neo4j = require('neo4j-driver');
const {seedDatabase} = require('../scripts/seed');
// 2. Lire les variables depuis process.env
const { 
    NEO4J_URI, 
    NEO4J_USERNAME, 
    NEO4J_PASSWORD 
} = process.env;

// 3. Vérifier que les variables sont bien chargées
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
    console.error("Erreur fatale : Les variables d'environnement sont manquantes.");
    console.error("Vérifiez votre fichier .env. Il semble vide ou mal configuré.");
    console.log("NEO4J_URI:", NEO4J_URI); // (sera undefined)
    process.exit(1); // Quitter le script
}

// 4. Initialiser le driver
let driver;
try {
    driver = neo4j.driver(
        NEO4J_URI, 
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
} catch (error) {
    console.error("Erreur lors de la création du driver Neo4j :", error);
    process.exit(1);
}

// 5. Fonction pour tester la connexion
<<<<<<< HEAD
// const testConnection = async () => {
//     try {
//         await driver.verifyConnectivity();
        
//         // 6. Utiliser console.log() !
//         console.log("Connexion à Neo4j AuraDB établie avec succès !");
=======
const testConnection = async () => {
    try {
        await driver.verifyConnectivity();
        await seedDatabase(driver);
        // 6. Utiliser console.log() !
        console.log("Connexion à Neo4j AuraDB établie avec succès !");
>>>>>>> a9b4c1c478928ba036d531be1483c2fa78bf1b9a

//     } catch (error) {
//         console.error("❌ Impossible de se connecter à AuraDB :", error);
//         if (error.code === 'Neo.ClientError.Security.Unauthorized') {
//              console.error("Vérifiez votre nom d'utilisateur ou mot de passe dans .env.");
//         }
//     } finally {
//         // Toujours fermer le driver quand le script est terminé
//         await driver.close();
//     }
// };

// Lancer le test
//testConnection();

<<<<<<< HEAD
module.exports = driver
=======





>>>>>>> auradb
