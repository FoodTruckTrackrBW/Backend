const db = require('../../data/dbConfig')

module.exports = {
    getTrucks,
    getTruckByID,
    getMenu,
    truckCheckIn,
    visitUpdate,
    itemRating,
    getVisited,
    getTruckRatings,
    getTrucksNearMe,
    getTrucksByCuisine
}

// Truck info 

//get a list of trucks
function getTrucks(){
    return db('trucks_table')
    .select('truck_name','truck_img_url', 'cuisine_type', 'departure_time')
}

function getTruckByID(id){
    return db('trucks_table')
    .where({id})
    .first();   
}

//get a list of truck ratings by passing in the trucks id
// truckId should be obtained from req.params.id
function getTruckRatings(truckId){
    return db('visited_trucks')
    .select('rating')
    .where({truck_id: truckId})
    .then(ratings => ({ratings}))
}


//get a list of items on the menu for a specific truck by passing in its ID
// truckId should be obtained from req.params.id
function getMenu(truckId){
    return db('items')
    .where({ truck_id: truckId})
}

// allows users to get a list of visited trucks
function getVisited(dinerId){
    return db('visited_trucks')
        .select('truck_name', 'truck_img_url', 'cuisine_type', 'rating', 'truck_id', 'favorite')
        .join('trucks_table','truck_id','id')
        .where('diner_id', dinerId)
}


// User functionality

// allows users to check into a truck they have visited, then allowing them to rate and favorite said truck.
// info for this is obtained from users decoded JWT for their ID and req.params.id for the truck ID 
function truckCheckIn(dinerCheckin){
    return db('visited_trucks')
    .insert(dinerCheckin)
}


// allows users to toggle if a truck is their favorite or not, and submit a rating. 
// truckId should be obtained from req.params.id, and dinerId should be obtained from their decoded JWT
// include opposite favorite boolean if changing favorite, or a rating if changing rating
function visitUpdate(truck){
    return db('visited_trucks')
    .where('diner_id', truck.diner_id)
    .andWhere('truck_id', truck.truck_id)
    .update(truck)
}



// allows users to insert a rating for an item they've had at a truck
// rating should be passed in with an object including the diners id from their decoded JWT, and the item id 
function itemRating(item){
    return db('diner_item_ratings')
    .insert(item)
}

async function getTrucksNearMe(diner_id, radius){
    const rad = 1609.34 * radius
    const diner = await db('users').where({id: diner_id}).first();
    
    const knexPostgis = require('knex-postgis');
    const st = knexPostgis(db);

    return db('trucks_table')
        .select('truck_name','truck_img_url', 'cuisine_type', 'departure_time', st.distance('truck_location', st.geography(st.makePoint(diner.user_lat, diner.user_long))).as('distanceAway'))
        .where(st.dwithin('truck_location', st.geography(st.makePoint(diner.user_lat, diner.user_long)), rad));
}

async function getTrucksByCuisine(diner_id, cuisine){
    const diner = await db('users').where({id: diner_id}).first();
    if (!cuisine) {
        cuisine = diner.favorite_cuisine_type;
    }

    return db('trucks_table')
        .select('truck_name','truck_img_url', 'cuisine_type', 'departure_time')
        .where({cuisine_type: cuisine});
}
