//ALL Neo4j queries for the map.

const driver = require('../../config/neo4j');

/**
 * @function getAllBuildings
 * Fetches all 2D map informations of nodes for the 'BUILDING' label from Neo4j.
 * Returns only the properties needed for the 2D map.
 */

const getAllBuildings = async ()=>{
    //1. create a session
    const session = driver.session();

    //2. define the cipher query 
    const cipherQuery = `
        MATCH (n:Building)
        RETURN n.id AS id,
            n.name AS name ,
            n.description AS description ,
            n.map_coords[0] AS x_coords ,
            n.map_coords[1] AS y_coords ,
            n.pano_url AS pano_image ,
            n.flat_url AS flat_image ,
            labels(n) AS labels ;
    `;

    try {
        //3. run the query 
        const result = await session.run(cipherQuery);
        console.log(result)
        // 4. Format the result
        // The driver returns a complex 'result' object.
        // We need to map over 'result.records' to get clean JSON.
        const locations = result.records.map(record => {
            return {
                id : record.get('id') ,
                name : record.get('name'),
                description : record.get('description'),
                x_coords : record.get('x_coords'),
                y_coords : record.get('y_coords'),
                pano_image : record.get('pano_image'),
                flat_image : record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations;  //array of json objects
    }catch(error) {
        //handle error
        console.log("error fetching all locations", error);
        throw error ;
    }finally{
        // 5. Always close the session when done
        await session.close();
    }
}

//const getLocationByLabel
const getLocationByLabel = async (label)=>{
    const session = driver.session();


    const cipherQuery = `
        MATCH (n:$label)
        RETURN n.id AS id,
            n.name AS name ,
            n.description AS description ,
            n.map_coords[0] AS x_coords ,
            n.map_coords[1] AS y_coords ,
            n.pano_url AS pano_image ,
            n.flat_url AS flat_image ,
            labels(n) AS labels ;
    `;

    try {
        //3. run the query 
        const result = await session.run(cipherQuery , {label});
        
        // 4. Format the result
        // The driver returns a complex 'result' object.
        // We need to map over 'result.records' to get clean JSON.
        const locations = result.records.map(record => {
            return {
                id : record.get('id'),
                label : record.get('label'),
                name : record.get('name'),
                description : record.get('description'),
                x_coords : record.get('x_coords'),
                y_coords : record.get('y_coords'),
                pano_image : record.get('pano_image'),
                flat_image : record.get('flat_image'),
                labels: record.get('labels'),
                floor : record.get('floor'),
                objects : record.get('objects')
            };
        });
        return locations;  //array of json objects
    }catch(error) {
        console.log("error fetching all locations", error);
        throw error ;
    }finally{
        await session.close();
    }
}

//const getLocationByID
const getLocationByID = async(id)=>{
    const session = driver.session();
    const cipherQuery = `
        MATCH (n:Location {id: $id})
        RETURN n
    `;    

    try{
        const nodeLocation = await session.run(cipherQuery , {id});

        if (result.records.length === 0) {
            return null;
        }

        return result.records[0].toObject("n"); 
    }catch(error) {
        console.log("error fetching location by ID", error);
        throw error ;
    }finally{
        await session.close();
    }
}


const createLocation = async(
        id,
        label,
        name ,
        description ,
        map_coords ,
        pano_url ,
        flat_url ,
        floor ,
        objects , 
        nexLocationsID) =>{

    const session = driver.session();
    const labelsString = ":" + label.join(":");

    const createNodeQuery = `
        MERGE (l:${labelsString}: {id: $id})
        SET l.name = $name ,
            l.label = $labelsString ,
            l.description = $description ,
            l.map_coords = $map_coords ,
            l.pano_url = $pano_url ,
            l.flat_url = $flat_url , 
            l.floor = $floor ,
            l.objects = $objects
        RETURN l;
    `;
    
    try{
        const result = await session.run(createNodeQuery, {
            id,
            name,
            labelsString,
            description,
            map_coords,
            pano_url,
            flat_url,
            floor,
            objects
        });
        
        const newLocation = result.records[0].get("l");

        for (const location in nexLocationsID){
            const linkQuery = `
                MATCH (a:Location {id: $id})
                MATCH (b:Location {id: $nextId})
                MERGE (a)-[:CONNECTED_TO]->(b)
            `;
            await session.run(linkQuery, { id, nextId });
        }

        return newLocation;

    }catch(err){
        console.error("Error creating location:", error);
        throw error;
    }finally {
        await session.close();
    }

;}

//fetch all nodes except waypoints (used in the search panel and navigation panel map)
const getPrincipalLocations = async ()=>{
    const session = driver.session();
    try{
        cipherQuery=`
            MATCH (n)
            WHERE NOT n:Waypoint AND NOT n:User AND NOT n:Classe
            RETURN  n.id AS id ,
                    n.name AS name,
                    n.description AS description ,
                    n.map_coords[0] AS x_coords ,
                    n.map_coords[1] AS y_coords ,
                    n.pano_url AS pano_image ,
                    n.flat_url AS flat_image ,
                    labels(n) AS labels ;
        `;

        const result = await session.run(cipherQuery);
        
        const locations = result.records.map(record => {
            return {
                id : record.get('id') ,
                name : record.get('name'),
                description : record.get('description'),
                x_coords : record.get('x_coords'),
                y_coords : record.get('y_coords'),
                pano_image : record.get('pano_image'),
                flat_image : record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations; 

    }catch(error){
        console.error("Error fetching for all locations:", error);
        throw error;
    }finally{
        session.close();
    }
}



 
module.exports = {
    getAllBuildings,

    createLocation , 
    getLocationByID ,


    getPrincipalLocations
}