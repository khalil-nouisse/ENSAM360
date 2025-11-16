//ALL Neo4j queries for the map.

const driver = require('../../config/neo4j');

/**
 * @function getAllLocations
 * Fetches all 2D map informations of nodes for the 'BUILDING' label from Neo4j.
 * Returns only the properties needed for the 2D map.
 */

const getAllLocations = async ()=>{
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
            labels(n) AS labels 
    `;

    try {
        //3. run the query 
        const result = await session.run(cipherQuery);
        
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


module.exports = {
    getAllLocations,
}