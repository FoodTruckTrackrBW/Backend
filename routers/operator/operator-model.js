const db = require('../../data/dbConfig')

module.exports = {
    getTrucks, 
    registerTruck,
    updateTruck,
    truckRatings,
    createItem,
    updateItem,
    truckItems,
    getSpecificTruck,
    truckSpecificItem

}



// Operators can add a truck
// Requires a truck_name, truck_img_url, cuisine_type, and departure_time be given
// owner id will be added via the users JWT
function registerTruck(truck){
    const {owner_id
        , truck_name
        , truck_img_url
        , cuisine_type
        , departure_time
        } = truck
    return db('trucks_table')
        .insert({owner_id
            , truck_name
            , truck_img_url
            , cuisine_type
            , departure_time
        })
}

//  Operators can view a list of trucks registered under their id
function getTrucks(id){
    return db('trucks_table')
        .where('owner_id', id)
        
}

//  Operators can view a list of trucks registered under their id
function getSpecificTruck(id, truckId){
    return db('trucks_table')
        .where('owner_id', id)
        .andWhere('id', truckId)
        .first()
}
// Operators can update their truck image, cuise_type, and departure_time
function updateTruck(truck, truckToUpdate){
    
    const { 
        truck_name = truckToUpdate.truck_name, 
        truck_img_url = truckToUpdate.truck_img_url, 
        cuisine_type = truckToUpdate.cuisine_type, 
        departure_time = truckToUpdate.departure_time
        } = truck.body
    const updatedTruck = { 
     truck_name
    , truck_img_url
    , cuisine_type
    , departure_time
    } 
    return db('trucks_table')
        .where('id', truck.id)
        .andWhere('owner_id', truck.owner_id)
        .update(updatedTruck)
        .then( ids => ({message:"update"}))
   
}

// Allows Operators to view a list of truck ratings for specific trucks they own 
function truckRatings(truckId){
    return db('visited_trucks')
        .select('rating')
        .where('truck_id', truckId)
        .then(ratings => ({ratings}))
}




// operators can create items for their trucks to sell. 
// the truck id should be pulled from req.params.id
// items require item_name, item_description, and a price
// photo url's are optional for the items
function createItem(item){
    const {truck_id, item_name, item_description, item_photo_url, item_price} = item
    return db('items')
        .insert({truck_id, item_name, item_description, item_photo_url, item_price})
}

// operators can update their menu item names/descriptions/photos/and prices
// item id should be pulled from req.params.itemId
function updateItem(item, itemToUpdate){
    const { 
        truck_id = itemToUpdate.truck_id,
        item_name = itemToUpdate.item_name,
        item_description = itemToUpdate.item_description,
        item_photo_url = itemToUpdate.item_photo_url,
        item_price = itemToUpdate.item_price
        } = item.body

    const updatedItem = {
        truck_id,
        item_name,
        item_description,
        item_photo_url,
        item_price
    }
    return db('items')
        .where('id', item.id)
        .update(updatedItem)
}

// operators can view a list of items listed for a truck
// item is pulled from req.params.id
function truckItems(id){
    return db('items')
    .where('truck_id', id)
}

// operators can view specific menu items listed to trucks 
function truckSpecificItem(truck_id, item_id){
    return db('items')
    .where('truck_id', truck_id)
    .andWhere('id', item_id)
}



// view item ratings
// function itemRatings(item){
//     return db('')
// }