// Import the driver from your config file
// const { driver } = require('../config/neo4j');

// --- Your Campus Data ---
// Define your data here to keep the Cypher queries clean
// 2eme liste de locations
/*const locations = [
  {
    id: "amphi_parking",
    label: ["Location", "Waypoint"],
    name: "Amphi Parking",
    description: "Intersection entre l'amphi et parking",
    map_coords: [380, 317],
    pano_url: "src/assets/image/amphi_parking.jpg",
    flat_url: "src/assets/image/amphi_parking_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "amphis_door",
    label: ["Location", "Waypoint"],
    name: "Porte Amphi",
    description: "La porte d'entree de l'amphi",
    map_coords: [350, 317],
    pano_url: "src/assets/image/amphis_door.jpg",
    flat_url: "src/assets/image/amphis_door_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "AUF",
    label: ["Location", "Building"],
    name: "Batiment AUF",
    description: "Le batiment AUF des lagnues",
    map_coords: [270, 401],
    pano_url: "src/assets/image/AUF.jpg",
    flat_url: "src/assets/image/AUF_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "buvette",
    label: ["Location", "Restaurant"],
    name: "Buvette",
    description: "La buvette des etudiants",
    map_coords: [639, 317],
    pano_url: "src/assets/image/buvette.jpg",
    flat_url: "src/assets/image/buvette_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "centre_de_recherche",
    label: ["Location", "Building", "Dept"],
    name: "Centre de Recherche",
    description: "Centre de recherche avec salles de dessin",
    map_coords: [440, 400],
    pano_url: "src/assets/image/centre_de_recherche.jpg",
    flat_url: "src/assets/image/centre_de_recherche_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "centre_de_recherche_door",
    label: ["Location", "Waypoint"],
    name: "La porte de Centre de Recherche",
    description: "La porte du Centre de recherche",
    map_coords: [441, 350],
    pano_url: "src/assets/image/centre_de_recherche_door.jpg",
    flat_url: "src/assets/image/centre_de_recherche_door_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "centre_de_recherche_entry",
    label: ["Location", "Waypoint"],
    name: "Entree de Centre de Recherche",
    description: "L'entree de Centre de recherche",
    map_coords: [441, 316],
    pano_url: "src/assets/image/centre_de_recherche_entry.jpg",
    flat_url: "src/assets/image/centre_de_recherche_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "civil",
    label: ["Location", "Building", "Dept"],
    name: "Departement civil",
    description: "Le department genie civil",
    map_coords: [542, 400],
    pano_url: "src/assets/image/civil.jpg",
    flat_url: "src/assets/image/civil_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "civil_entry",
    label: ["Location", "Waypoint"],
    name: "Entree civil",
    description: "Entree du Departement Genie Civil",
    map_coords: [542, 350],
    pano_url: "src/assets/image/civil_entry.jpg",
    flat_url: "src/assets/image/civil_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "civil_gms_entry",
    label: ["Location", "Waypoint"],
    name: "Intersection GMS Civil",
    description: "Intersection entre le Atelier Tp GMS et le Dept Civil",
    map_coords: [542, 316],
    pano_url: "src/assets/image/civil_gms_entry.jpg",
    flat_url: "src/assets/image/civil_gms_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "couloir_intersection",
    label: ["Location", "Waypoint"],
    name: "Couloir Intersection",
    description: "Couloir de l'intersection entre chemin vers Buvette et chemin vers Bibliothèque",
    map_coords: [379, 399],
    pano_url: "src/assets/image/couloir_intersection.jpg",
    flat_url: "src/assets/image/couloir_intersection_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "couloir_right_td1",
    label: ["Location", "Waypoint"],
    name: "Couloir droit de TD1",
    description: "Couloir droit du Td1",
    map_coords: [320, 482],
    pano_url: "src/assets/image/couloir_right_td1.jpg",
    flat_url: "src/assets/image/couloir_right_td1_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "energitique_door",
    label: ["Location", "Waypoint"],
    name: "Porte Energitique",
    description: "La prote du Departement Energitique",
    map_coords: [670, 405],
    pano_url: "src/assets/image/energitique_door.jpg",
    flat_url: "src/assets/image/energitique_door_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "energitique_entry",
    label: ["Location", "Waypoint"],
    name: "Entree Energitique",
    description: "Entree du Departement Energitique",
    map_coords: [670, 317],
    pano_url: "src/assets/image/energitique_entry.jpg",
    flat_url: "src/assets/image/energitique_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "ensam_entry",
    label: ["Location"],
    name: "Entree Ensam",
    description: "Entree de L'Ecole Nationale Superieure d'Arts et Metiers de Meknes",
    map_coords: [82, 330],
    pano_url: "src/assets/image/ensam_entry.jpg",
    flat_url: "src/assets/image/ensam_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "fabrication_mecanique_entry",
    label: ["Location", "Waypoint"],
    name: "Entree Tp Fabrication mecanique",
    description: "Entree du TP en fabrication mecanique",
    map_coords: [493, 316],
    pano_url: "src/assets/image/fabrication_mecanique_entry.jpg",
    flat_url: "src/assets/image/fabrication_mecanique_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "parking",
    label: ["Location", "Parking"],
    name: "Parking",
    description: "Parking de l'ENSAM",
    map_coords: [378, 240],
    pano_url: "src/assets/image/parking.jpg",
    flat_url: "src/assets/image/parking_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "pointeuse_entry",
    label: ["Location", "Waypoint"],
    name: "Espace de pointeuses",
    description: "Espace de pointeuses a cote du TD2",
    map_coords: [187, 401],
    pano_url: "src/assets/image/pointeuse_entry.jpg",
    flat_url: "src/assets/image/pointeuse_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "salle_info_7",
    label: ["Location", "Classe"],
    name: "Salle 7 Info",
    description: "Salle 7 de la filiere Genie Informatique,Ingenierie Logicielle et Systemes Intelligents",
    map_coords: [324, 435],
    pano_url: "src/assets/image/salle_info_7.jpg",
    flat_url: "src/assets/image/salle_info_7_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "stairs_right_td1",
    label: ["Location", "Waypoint"],
    name: "Escaliers Droit de TD1",
    description: "Escaliers droit du TD1",
    map_coords: [348, 482],
    pano_url: "src/assets/image/stairs_right_td1.jpg",
    flat_url: "src/assets/image/stairs_right_td1_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "td1",
    label: ["Location", "Building", "Td"],
    name: "TD1",
    description: "le Td TD1",
    map_coords: [320, 452],
    pano_url: "src/assets/image/td1.jpg",
    flat_url: "src/assets/image/td1_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "td1_door",
    label: ["Location", "Waypoint"],  
    name: "Porte de TD1",
    description: "La porte du TD1",
    map_coords: [348, 452],
    pano_url: "src/assets/image/td1_door.jpg",
    flat_url: "src/assets/image/td1_door_flat.jpg",
    floor: 0,
    objects: []
  },
  
  {
    id: "td1_entry",
    label: ["Location", "Waypoint"],
    name: "Entrée de TD1",
    description: "Entrée du Td TD1",
    map_coords: [379, 452],
    pano_url: "src/assets/image/td1_entry.jpg",
    flat_url: "src/assets/image/td1_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "td2",
    label: ["Location", "Building", "Td"],
    name: "TD2",
    description: "Le td TD2",
    map_coords: [215, 470],
    pano_url: "src/assets/image/td2.jpg",
    flat_url: "src/assets/image/td2_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "td2_entry",
    label: ["Location", "Waypoint"],
    name: "Entree TD2",
    description: "Entree du TD2",
    map_coords: [211, 401],
    pano_url: "src/assets/image/td2_entry.jpg",
    flat_url: "src/assets/image/td2_entry_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "terrain_fonderie",
    label: ["Location", "Waypoint"],
    name: "Intersection Terrain Fonderie",
    description: "Intersection entre le chemin menant au Terrain de Foot et La buvette des Profs avec le chemin menant au TP (labaux) de Fonderie",
    map_coords: [720, 317],
    pano_url: "src/assets/image/terrain_fonderie.jpg",
    flat_url: "src/assets/image/terrain_fonderie_flat.jpg",
    floor: 0,
    objects: []
  }
];*/

// 1ere liste de locations
/*const locations = [
  
  {
    id: "administration",
    label: ["Location","Building","Admin"],
    name: "Administration",
    description: "Bâtiment de l'administration.",
    map_coords: [80, 540],
    pano_url: "src/assets/image/administration.jpg",
    flat_url: "src/assets/image/administration_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "Admnetud",
    label: ["Location","Waypoint"],
    name: "Route vers l'Administration des Étudiants et la Bibliothèque",
    description: "Jonction vers l'administration des étudiants et la bibliothèque.",
    map_coords: [95, 610],
    pano_url: "src/assets/image/routebib.jpg",
    flat_url: "src/assets/image/routebib_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "Administration_etud",
    label: ["Location","Building","Administration"],
    name: "Administration des Étudiants",
    description: "Bureau de l'administration des étudiants.",
    map_coords: [180, 623],
    pano_url: "src/assets/image/adminetud.jpg",
    flat_url: "src/assets/image/adminetud_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "couloirForum",
    label: ["Location","Waypoint"],
    name: "Couloir Administration des etudiants",
    description: "Couloir menant au forum.",
    map_coords: [180, 647],
    pano_url: "src/assets/image/couloirforum.jpg",
    flat_url: "src/assets/image/couloirforum_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "couloir1",
    label: ["Location","Waypoint"],
    name: "Couloir Bibliothèque",
    description: "Premier couloir principal.",
    map_coords: [215, 647],
    pano_url: "src/assets/image/image5.jpg",
    flat_url: "src/assets/image/image5_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "Bibliotheque_et_centre_de_langue",
    label: ["Location","Building","BIB"],
    name: "Bibliothèque et Centre de Langue",
    description: "Bibliothèque principale et centre de langue.",
    map_coords: [220, 730],
    pano_url: "src/assets/image/bib.jpg",
    flat_url: "src/assets/image/bib_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "escalier1",
    label: ["Location","Waypoint"],
    name: "Escalier Bibliothèque",
    description: "Premier escalier d'accès a la bibliotheque.",
    map_coords: [200, 700],
    pano_url: "src/assets/image/escalier1.jpg",
    flat_url: "src/assets/image/escalier1_flat.jpg",
    floor: 0,
    objects: []
  },
  {
    id: "escalier2",
    label: ["Location","Waypoint"],
    name: "Entrée Bibliothèque",
    description: "Deuxième escalier d'accès.",
    map_coords: [200, 715],
    pano_url: "src/assets/image/image2.jpg",
    flat_url: "src/assets/image/image2_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "couloir2",
    label: ["Location","Waypoint"],
    name: "Deuxième couloir principal",
    description: "Deuxième couloir principal.",
    map_coords: [377, 647],
    pano_url: "src/assets/image/image6.jpg",
    flat_url: "src/assets/image/image6_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "couloircctd1",
    label: ["Location","Waypoint"],
    name: "Couloir Centre de Calcul",
    description: "Couloir du centre de calcul.",
    map_coords: [377, 610],
    pano_url: "src/assets/image/couloircctd1.jpg",
    flat_url: "src/assets/image/couloircctd1_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "CouloirAEEE",
    label: ["Location","Waypoint"],
    name: "Couloir de l'Entrée de AEEE",
    description: "Couloir d'entrée du département AEEE.",
    map_coords: [379, 476],
    pano_url: "src/assets/image/couloira3e.jpg",
    flat_url: "src/assets/image/couloira3e_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "couloirtd1",
    label: ["Location","Waypoint"],
    name: "Couloir TD1",
    description: "Couloir des travaux dirigés 1.",
    map_coords: [379, 452],
    pano_url: "src/assets/image/ctd1v1.jpeg",
    flat_url: "src/assets/image/ctd1v1_flat.jpeg",
    floor: 1,
    objects: []
  },
  // {
  //   id: "CouloirTD1TD2",
  //   label: ["Location","Waypoint"],
  //   name: "Couloir entre TD1, TD2 et Amphi 250",
  //   description: "Jonction entre les salles de travaux dirigés et l'amphithéâtre.",
  //   map_coords: [65, 50],
  //   pano_url: "src/assets/image/Ctd1td2.jpg",
  //   flat_url: "src/assets/image/Ctd1td2_flat.jpg",
  //   floor: 1,
  //   objects: []
  // },
  {
    id: "EntreeA3e",
    label: ["Location","Waypoint"],
    name: "Entrée de AEEE",
    description: "Entrée du département AEEE.",
    map_coords: [415, 476],
    pano_url: "src/assets/image/EntreeA3E.jpg",
    flat_url: "src/assets/image/EntreeA3E_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "AEEE",
    label: ["Location","Building","Dept"],
    name: "Département AEEE",
    description: "Département d'Automatique, Électronique, Énergie et Environnement.",
    map_coords: [415, 487],
    pano_url: "src/assets/image/a3e.jpg",
    flat_url: "src/assets/image/a3e_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "a3einside",
    label: ["Location","Waypoint"],
    name: "Département AEEE (Intérieur)",
    description: "Intérieur du département AEEE.",
    map_coords: [460, 520],
    pano_url: "src/assets/image/a3e2.jpg",
    flat_url: "src/assets/image/a3e2_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "mathinfo",
    label: ["Location","Waypoint"],
    name: "Entrée Département Mathématiques-Informatique ",
    description: "Département de Mathématiques et Informatique.",
    map_coords: [420, 610],
    pano_url: "src/assets/image/cc_outside.jpg",
    flat_url: "src/assets/image/cc_outside_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "mathinfo_inside",
    label: ["Location","Building", "Dept"],
    name: "Département Mathématiques-Informatique (Intérieur)",
    description: "Intérieur du département Mathématiques-Informatique.",
    map_coords: [475, 653],
    pano_url: "src/assets/image/mathinfo.jpg",
    flat_url: "src/assets/image/mathinfo_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "amphie_et_salle_de_conference",
    label: ["Location","Building"],
    name: "Amphithéâtre 3 et Salle de Conférence",
    description: "Jonction entre l'amphithéâtre 3 et la salle de conférence.",
    map_coords: [377, 755],
    pano_url: "src/assets/image/image7.jpg",
    flat_url: "src/assets/image/image7_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "entree_salle_conference",
    label: ["Location","Waypoint"],
    name: "Entrée de la Salle de Conférence",
    description: "Entrée de la salle de conférence.",
    map_coords: [355, 755],
    pano_url: "src/assets/image/image8.jpg",
    flat_url: "src/assets/image/image8_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "salle_conference",
    label: ["Location","Amphi"],
    name: "Salle de Conférence",
    description: "Salle de conférence principale.",
    map_coords: [355, 800],
    pano_url: "src/assets/image/image9.jpg",
    flat_url: "src/assets/image/image9_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "entree_emphi3",
    label: ["Location","Waypoint"],
    name: "Entrée de l'Amphithéâtre 3",
    description: "Entrée de l'amphithéâtre 3.",
    map_coords: [410, 755],
    pano_url: "src/assets/image/amphi3.jpg",
    flat_url: "src/assets/image/amphi3_flat.jpg",
    floor: 1,
    objects: []
  },
  {
    id: "Amphi3",
    label: ["Location","Building","Amphi"],
    name: "Amphithéâtre 3",
    description: "Amphithéâtre 3 pour les conférences et cours.",
    map_coords: [300, 300],
    pano_url: "src/assets/image/image11.jpg",
    flat_url: "src/assets/image/image11_flat.jpg",
    floor: 1,
    objects: []
  }
];*/

// --- Main Seeding Function ---
const seedDatabase = async (driver) => {
  // Open a session
  const session = driver.session();

  try {
    // console.log('🌱 Nettoyage de la base de données...');
    // // 1. Delete all existing nodes and relationships
    // // await session.run('MATCH (n) DETACH DELETE n');

    // console.log('Création des lieux (Nœuds)...');
    // 2. Create all locations using MERGE
    for (const loc of locations) {
      // We add the 'Location' label to all nodes for easy searching
      let labelsString = "";
      for (label of loc.label) {

        loc.label.indexOf(label) == loc.label.length - 1 ? labelsString += label : labelsString += label + ":";
      }
      await session.run(
        `MERGE (n:${labelsString} {id: $id})
                 SET n.name = $name,
                     n.description = $description,
                     n.map_coords = $map_coords,
                     n.pano_url = $pano_url,
                     n.flat_url = $flat_url,
                     n.floor = $floor,
                     n.objects = $objects
                `,
        {
          id: loc.id,
          name: loc.name,
          description: loc.description,
          map_coords: loc.map_coords,
          pano_url: loc.pano_url,
          flat_url: loc.flat_url,
          floor: loc.floor,
          objects:loc.objects
        }
      );
    }

    console.log('Création des chemins (Relations)...');

    // 3. Create semantic relationships (e.g., what's inside a Building)
    // CONTAINS relationship for rooms inside Buildings


    // await session.run(`
    //     MATCH (b:Building {id: 'mathinfo'})
    //     MATCH (r:Room {id: 'mathinfo_inside'})
    //     MERGE (b)-[:CONTAINS]->(r)
    // `);

    // await session.run(`
    //     MATCH (b:Building {id: 'Bibliotheque_et_centre_de_langue'})
    //     MATCH (r:Room {id: 'salle_conference'})
    //     MERGE (b)-[:CONTAINS]->(r)
    // `);

    // 4. Create navigation relationships (paths with distances)
    // Entrance to corridor connections

    // ********************* 1st set of locations: ************************************

    // await session.run(`
    //         MATCH (a:Location {id: 'ensam_entry'})
    //         MATCH (b:Location {id: 'administration'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:220,pitch:-5}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:85}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'administration'})
    //         MATCH (b:Location {id: 'Admnetud'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:280,pitch:-7}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:100}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'Admnetud'})
    //         MATCH (b:Location {id: 'Administration_etud'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:320}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:80}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'Administration_etud'})
    //         MATCH (b:Location {id: 'couloirForum'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:184}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:0}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloirForum'})
    //         MATCH (b:Location {id: 'couloir1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:275}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:270}]->(a)
    //     `);

    // // Library connections
    // await session.run(`
    //         MATCH (a:Location {id: 'couloir1'})
    //         MATCH (b:Location {id: 'Bibliotheque_et_centre_de_langue'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:160,pitch:-5}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'Bibliotheque_et_centre_de_langue'})
    //         MATCH (b:Location {id: 'escalier1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:180,pitch:-5}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:12,pitch:-20}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'escalier1'})
    //         MATCH (b:Location {id: 'escalier2'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // // Second floor corridor connections
    // await session.run(`
    //         MATCH (a:Location {id: 'couloir1'})
    //         MATCH (b:Location {id: 'couloir2'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:90}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloir2'})
    //         MATCH (b:Location {id: 'couloircctd1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:270}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloircctd1'})
    //         MATCH (b:Location {id: 'mathinfo'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'mathinfo'})
    //         MATCH (b:Location {id: 'mathinfo_inside'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloircctd1'})
    //         MATCH (b:Location {id: 'CouloirAEEE'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'CouloirAEEE'})
    //         MATCH (b:Location {id: 'EntreeA3e'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'EntreeA3e'})
    //         MATCH (b:Location {id: 'AEEE'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'AEEE'})
    //         MATCH (b:Location {id: 'a3einside'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'CouloirAEEE'})
    //         MATCH (b:Location {id: 'couloirtd1'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloirtd1'})
    //         MATCH (b:Location {id: 'CouloirTD1TD2'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // // Amphitheater and conference room connections
    // await session.run(`
    //         MATCH (a:Location {id: 'couloir2'})
    //         MATCH (b:Location {id: 'amphie_et_salle_de_conference'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'amphie_et_salle_de_conference'})
    //         MATCH (b:Location {id: 'entree_salle_conference'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'entree_salle_conference'})
    //         MATCH (b:Location {id: 'salle_conference'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'amphie_et_salle_de_conference'})
    //         MATCH (b:Location {id: 'entree_emphi3'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'entree_emphi3'})
    //         MATCH (b:Location {id: 'Amphi3'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // ********************* 2nd set of locations: ************************************

    // await session.run(`
    //         MATCH (a:Location {id: 'ensam_entry'})
    //         MATCH (b:Location {id: 'pointeuse_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:310}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:180}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'pointeuse_entry'})
    //         MATCH (b:Location {id: 'td2_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:220}]->(a)
    //     `);

    // // 2 possible locations starting from td2_entry :
    // await session.run(`
    //         MATCH (a:Location {id: 'td2_entry'})
    //         MATCH (b:Location {id: 'td2'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:340}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'td2_entry'})
    //         MATCH (b:Location {id: 'AUF'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:75}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:180}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'AUF'})
    //         MATCH (b:Location {id: 'couloir_intersection'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:90}]->(a)
    //     `);

    // // 2 possible locations starting from couloir_intersection :

    // await session.run(`
    //         MATCH (a:Location {id: 'couloir_intersection'})
    //         MATCH (b:Location {id: 'amphi_parking'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloir_intersection'})
    //         MATCH (b:Location {id: 'td1_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:180}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:270}]->(a)
    //     `);

    // // 2 locations starting from td1_entry :

    // await session.run(`
    //         MATCH (a:Location {id: 'td1_entry'})
    //         MATCH (b:Location {id: 'td1_door'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:180}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'td1_door'})
    //         MATCH (b:Location {id: 'td1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:230}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'td1_door'})
    //         MATCH (b:Location {id: 'stairs_right_td1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:90}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:0,pitch:-30}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'td1'})
    //         MATCH (b:Location {id: 'stairs_right_td1'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'stairs_right_td1'})
    //         MATCH (b:Location {id: 'couloir_right_td1'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:45}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'couloir_right_td1'})
    //         MATCH (b:Location {id: 'salle_info_7'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // // 3 locations starting from amphiparking :

    // await session.run(`
    //         MATCH (a:Location {id: 'amphi_parking'})
    //         MATCH (b:Location {id: 'amphis_door'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);


    // await session.run(`
    //         MATCH (a:Location {id: 'amphi_parking'})
    //         MATCH (b:Location {id: 'parking'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:260}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:150}]->(a)
    //     `);


    // await session.run(`
    //         MATCH (a:Location {id: 'amphi_parking'})
    //         MATCH (b:Location {id: 'centre_de_recherche_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:180}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:80}]->(a)
    //     `);

    // // 2 locations starting from centre_de_recherche_entry :

    // await session.run(`
    //         MATCH (a:Location {id: 'centre_de_recherche_entry'})
    //         MATCH (b:Location {id: 'centre_de_recherche_door'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:180}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'centre_de_recherche_entry'})
    //         MATCH (b:Location {id: 'fabrication_mecanique_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:280}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:80}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'centre_de_recherche_door'})
    //         MATCH (b:Location {id: 'centre_de_recherche'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:250}]->(a)
    //     `);


    // await session.run(`
    //         MATCH (a:Location {id: 'fabrication_mecanique_entry'})
    //         MATCH (b:Location {id: 'civil_gms_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:270}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:270}]->(a)
    //     `);


    // // 2 locations starting from civil_gms_entry :

    // await session.run(`
    //         MATCH (a:Location {id: 'civil_gms_entry'})
    //         MATCH (b:Location {id: 'civil_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'civil_gms_entry'})
    //         MATCH (b:Location {id: 'buvette'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:90}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:0}]->(a)
    //     `);




    // await session.run(`
    //         MATCH (a:Location {id: 'civil_entry'})
    //         MATCH (b:Location {id: 'civil'})
    //         MERGE (a)-[r1:CONNECTS_TO {}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {}]->(a)
    //     `);



    // await session.run(`
    //         MATCH (a:Location {id: 'buvette'})
    //         MATCH (b:Location {id: 'energitique_entry'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:180}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:270}]->(a)
    //     `);


    // // 2 locations starting from energitique_entry :


    // await session.run(`
    //         MATCH (a:Location {id: 'energitique_entry'})
    //         MATCH (b:Location {id: 'energitique_door'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:0}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:260}]->(a)
    //     `);

    // await session.run(`
    //         MATCH (a:Location {id: 'energitique_entry'})
    //         MATCH (b:Location {id: 'terrain_fonderie'})
    //         MERGE (a)-[r1:CONNECTS_TO {yaw:90}]->(b)
    //         MERGE (b)-[r2:CONNECTS_TO {yaw:270}]->(a)
    //     `);

    // calculate the ditance between 2 locations :
      //     MATCH (a:Location)-[r:CONNECTS_TO]->(b:Location)
      // // We removed the WHERE clause so this applies to EVERYTHING now

      // WITH a, b, r,
      //     point({x: toFloat(a.map_coords[0]), y: toFloat(a.map_coords[1])}) AS p1,
      //     point({x: toFloat(b.map_coords[0]), y: toFloat(b.map_coords[1])}) AS p2

      // // This will overwrite your default mock value with the real math
      // SET r.distance = toInteger(round(point.distance(p1, p2)))

      // RETURN count(r) AS RelationshipsUpdated
    







    console.log('✅ Base de données initialisée avec succès !');

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  } finally {
    // 5. Always close the session and the driver
    await session.close();
    // await driver.close();
    console.log('Connexion fermée.');
  }
};
// --- Run the script ---
// seedDatabase();

module.exports = { seedDatabase }
