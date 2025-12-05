class Location {
    constructor(type,id,name,map_x,map_y,pano_img,flat_img,description,floor,objects){
        this.type = type
        this.id = id
        this.name = name
        this.map_x = map_x
        this.map_y = map_y
        this.pano_img =pano_img
        this.flat_img =flat_img
        this.description =description
        this.floor = floor
        this.objects = objects
    }
}

class Relation{
    constructor(origin,destination,distance,yaw,pitch,travel_text){
        this.origin = origin
        this.destination = destination
        this.description = description
        this.distance = distance
        this.yaw = yaw
        this.pitch = pitch
        this.travel_text = travel_text
    }
}

const types = Object.freeze({
    BUILDING:"BUILDING",
    PATHWAY:"PATHWAY",
    PARKING:"PARKING",
});

module.exports = {Location,Relation,types};