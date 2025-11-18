const driver = require('../../config/neo4j');

const getNextLocationsID = async (id)=>{
    const session =  driver.session();
    cipherQuery = `
        MATCH (n:Location{ id:'${id}'})-[r:CONNECTS_TO]-(m:Location)
        RETUTN m.id
    `;
    try{
        const result = await session.run(cipherQuery);

        const nextLocationsID = result.records.map(record => {
            return {
                id : record.get('id') ,
            };
        });
        return nextLocationsID
    }catch(err){
        console.log("error fetching next nodes ID", err);
        throw err ;
    }finally{
        await session.close();
    }

};


const getLocationInfoByID = async (id)=>{
    const session = driver.session();
    cipherQuery = `
    MATCH (n:Location {id : '${id}'})
        RETURN n.pano_url AS pano_image ,
               n.name AS name ,
               n.floor AS floor ,
               n.id AS id
    `;

    try {
        const result = await session.run(cipherQuery);
        console.log(result)
        const locations = result.records.map(record => {
            return {
                id : record.get('id') ,
                name : record.get('name'),
                floor : record.get('floor'),
                // objects : record.get('objects'),
                // label : record.get('label'),
                pano_image : record.get('pano_image')
            };
        });
        
        return locations; 
    }catch(error) {
        console.log("error fetching all locations", error);
        throw error ;
    }finally{
        await session.close();
    }
};


module.exports = {
    getNextLocationsID , 
    getLocationInfoByID
}