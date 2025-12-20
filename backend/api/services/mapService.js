//ALL Neo4j queries for the map.

const driver = require('../../config/neo4j');
const { get } = require('../routes/map');

/**
 * @function getAllBuildings
 * Fetches all 2D map informations of nodes for the 'BUILDING' label from Neo4j.
 * Returns only the properties needed for the 2D map.
 */
const getShortestPath = async (startID, endID) => {
    const session = driver.session();

    //2. define the cipher query - return formatted node and edge arrays
    const cipherQuery = `
        MATCH (src:Location {id: $startID}), (end:Location {id: $endID})
        CALL apoc.algo.dijkstra(src, end, 'CONNECTS_TO>', 'distance') YIELD path, weight
                RETURN
                    [n IN nodes(path) | {
                        id: n.id,
                        name: n.name,
                        description: n.description,
                        pano_image: n.pano_url,
                        floor: n.floor,
                        x_coords: n.map_coords[0],
                        y_coords: n.map_coords[1]
                    }] AS nodes,
          [r IN relationships(path) | { from: startNode(r).id, to: endNode(r).id, distance: r.distance, yaw: r.yaw, pitch: r.pitch }] AS edges,
          weight
    `;

    try {
        //3. run the query 
        const result = await session.run(cipherQuery, { startID, endID });
        // If no path found return null
        if (!result.records || result.records.length === 0) {
            return null;
        }

        const rec = result.records[0];
        const nodes = rec.get('nodes') || [];
        const edges = rec.get('edges') || [];
        const weight = rec.get('weight');

        // convert neo4j Integer to number if applicable
        const totalDistance = (weight && typeof weight.toNumber === 'function') ? weight.toNumber() : weight;

        // ensure edge distances are numbers
        const normalizedEdges = edges.map(e => ({
            ...e,
            distance: (e.distance && typeof e.distance.toNumber === 'function') ? e.distance.toNumber() : e.distance
        }));

        return { nodes, edges: normalizedEdges, totalDistance };
    } catch (error) {
        //handle error
        console.log("error calculating shortestPath", error);
        throw error;
    } finally {
        // 5. Always close the session when done
        await session.close();
    }
}
const getAllLocations = async () => {
    //1. create a session
    const session = driver.session();

    //2. define the cipher query 
    const cipherQuery = `
        MATCH (n:Location)
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

            const x = record.get('x_coords');
            const y = record.get('y_coords');

            return {
                id: record.get('id'),
                name: record.get('name'),
                description: record.get('description'),
                x_coords: x !== null ? x : 0,
                y_coords: y !== null ? y : 0,
                pano_image: record.get('pano_image'),
                flat_image: record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations;  //array of json objects
    } catch (error) {
        //handle error
        console.log("error fetching all locations", error);
        throw error;
    } finally {
        // 5. Always close the session when done
        await session.close();
    }
}

const getAllBuildings = async () => {
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
                id: record.get('id'),
                name: record.get('name'),
                description: record.get('description'),
                x_coords: record.get('x_coords'),
                y_coords: record.get('y_coords'),
                pano_image: record.get('pano_image'),
                flat_image: record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations;  //array of json objects
    } catch (error) {
        //handle error
        console.log("error fetching all locations", error);
        throw error;
    } finally {
        // 5. Always close the session when done
        await session.close();
    }
}

//const getLocationByLabel
const getLocationByLabel = async (label) => {
    const session = driver.session();

    // FIX: You cannot use $label for Labels. You must inject it carefully.
    // Note: In production, validate 'label' against an allowlist to prevent injection.
    const cipherQuery = `
        MATCH (n:${label}) 
        RETURN n.id AS id,
            n.name AS name,
            n.description AS description,
            n.map_coords[0] AS x_coords,
            n.map_coords[1] AS y_coords,
            n.pano_url AS pano_image,
            n.flat_url AS flat_image,
            labels(n) AS labels
    `;

    try {
        // FIX: Removed {label} parameter as it's now in the string
        const result = await session.run(cipherQuery);

        const locations = result.records.map(record => {
            const x = record.get('x_coords');
            const y = record.get('y_coords');
            return {
                id: record.get('id'),
                name: record.get('name'),
                description: record.get('description'),
                x_coords: x !== null ? x : 0,
                y_coords: y !== null ? y : 0,
                pano_image: record.get('pano_image'),
                flat_image: record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations;
    } catch (error) {
        console.error("error fetching locations by label", error);
        throw error;
    } finally {
        await session.close();
    }
}

//const getLocationByID
const getLocationByID = async (id) => {
    const session = driver.session();
    const cipherQuery = `
        MATCH (n:Location {id: $id})
        RETURN n
    `;

    try {
        const nodeLocation = await session.run(cipherQuery, { id });

        if (result.records.length === 0) {
            return null;
        }

        return result.records[0].toObject("n");
    } catch (error) {
        console.log("error fetching location by ID", error);
        throw error;
    } finally {
        await session.close();
    }
}


const createLocation = async (
    id,
    label, // Expecting an array like ['Building', 'Location']
    name,
    description,
    map_coords,
    pano_url,
    flat_url,
    floor,
    objects,
    nexLocationsID) => { // Expecting an array of IDs

    const session = driver.session();
    const labelsString = label.join(":"); // e.g. "Building:Location"

    // FIX: Removed extra colon after ${labelsString}
    const createNodeQuery = `
        MERGE (l:${labelsString} {id: $id})
        SET l.name = $name,
            l.description = $description,
            l.map_coords = $map_coords,
            l.pano_url = $pano_url,
            l.flat_url = $flat_url, 
            l.floor = $floor,
            l.objects = $objects
        RETURN l;
    `;

    try {
        const result = await session.run(createNodeQuery, {
            id,
            name,
            description,
            map_coords,
            pano_url,
            flat_url,
            floor,
            objects
        });

        const newLocation = result.records[0].get("l").properties;

        // FIX: Use 'for...of' to iterate values, not keys
        // FIX: variable name 'nextId' was undefined before
        if (nexLocationsID && Array.isArray(nexLocationsID)) {
            for (const nextId of nexLocationsID) {
                const linkQuery = `
                    MATCH (a:Location {id: $id})
                    MATCH (b:Location {id: $nextId})
                    MERGE (a)-[:CONNECTS_TO]->(b)
                `;
                await session.run(linkQuery, { id, nextId });
            }
        }

        return newLocation;

    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    } finally {
        await session.close();
    }
}

//fetch all nodes except waypoints (used in the search panel and navigation panel map)
const getPrincipalLocations = async () => {
    const session = driver.session();
    try {
        const cipherQuery = `
            MATCH (n)
            WHERE NOT n:Waypoint AND NOT n:User AND NOT n:Classe AND NOT n:Topic
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

            const x = record.get('x_coords');
            const y = record.get('y_coords');

            return {
                id: record.get('id'),
                name: record.get('name'),
                description: record.get('description'),
                x_coords: x != null ? x : 0,
                y_coords: y != null ? y : 0,
                pano_image: record.get('pano_image'),
                flat_image: record.get('flat_image'),
                labels: record.get('labels')
            };
        });
        return locations;

    } catch (error) {
        console.error("Error fetching for all locations:", error);
        throw error;
    } finally {
        session.close();
    }
}




module.exports = {
    getAllLocations,
    getAllBuildings,

    createLocation,
    getLocationByID,


    getPrincipalLocations,
    getShortestPath
}