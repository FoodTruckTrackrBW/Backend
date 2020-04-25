const db = require('../../data/dbConfig')

module.exports = {
    getTrucks,
    getMenu
  
}

function getTrucks(){
    return db('trucks_table')
    .select('truck_name','truck_img_url', 'cuisine_type', 'departure_time')

}


function getMenu(truckId){
    return db('items')
    .where({ truck_id: truckId})
}