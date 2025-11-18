const driver = require('../../config/neo4j');

const getNextLocationsID = async (id)=>{
    const session =  driver.session();
    cipherQuery = `
<<<<<<< HEAD
        MATCH (n:Location{ id='$id'})-[r:CONNECTS_TO]-(m:Location)
=======
        MATCH (n:Location{ id:'${id}'})-[r:CONNECTS_TO]-(m:Location)
>>>>>>> virtual_tour
        RETUTN m.id
    `;
    try{
        const result = await session.run(cipherQuery , {id});

        const nextLocationsID = result.records.map(a => {
            return {
                id : record.get('id')
            };
        });
<<<<<<< HEAD
        return nextLocationsID;

=======
        return nextLocationsID
>>>>>>> virtual_tour
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
<<<<<<< HEAD
        MATCH (n:Location {id = $id})
=======
    MATCH (n:Location {id : '${id}'})
>>>>>>> virtual_tour
        RETURN n.pano_url AS pano_image ,
               n.name AS name ,
               n.floor AS floor ,
               n.id AS id
    `;

    try {
<<<<<<< HEAD
        const result = await session.run(cipherQuery , { id });
=======
        const result = await session.run(cipherQuery);
        console.log(result)
>>>>>>> virtual_tour
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