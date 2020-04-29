const knex = require("knex");
const knexPostgis = require("knex-postgis");
const db = require('../dbConfig.js');
// install postgis functions in knex.postgis;
const st = knexPostgis(db);

function generateLocation(lat,long) {
  return st.setSRID(st.makePoint(lat, long), 4326)
}
exports.seed = function(knex) {
  const truckImg = 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1726&q=80'
  const truckImg2 = 'https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1845&q=80'
  const beeftaco =  'https://s3-media0.fl.yelpcdn.com/bphoto/TkNdQIwQ4-RMfyGGatth3w/o.jpg'
  const porktamale = 'https://s3-media0.fl.yelpcdn.com/bphoto/7pI9iV8MSs96-KyxM9fuoA/o.jpg'
  const fishtaco = 'https://s3-media0.fl.yelpcdn.com/bphoto/MarLOi0UOfMPf9KFSUWLPw/o.jpg'
  const chocolate = 'https://s3-media0.fl.yelpcdn.com/bphoto/idnt_vzbg3KEPg-6RADbjg/o.jpg'
  const chorizo = 'https://s3-media0.fl.yelpcdn.com/bphoto/28KM_R24a1QKs5rV-rtzzA/o.jpg'
  const phoTai = 'https://s3-media0.fl.yelpcdn.com/bphoto/9DO2-iys6IJsmrQKzEL8tw/o.jpg'
  const crab  = 'https://s3-media0.fl.yelpcdn.com/bphoto/evz8Ce5MDYBH_oVM4-mpUw/o.jpg'
  const butter = 'https://s3-media0.fl.yelpcdn.com/bphoto/DiqdfWeB_9d-GU9RNi2vFQ/o.jpg'
  const bun ='https://s3-media0.fl.yelpcdn.com/bphoto/4awjRKYE1Zvx3xHDJ_84ow/o.jpg'
  
  // Deletes ALL existing entries
  return knex('trucks_table').del()
  .then( function () {
    return knex('visited_trucks').del()
  })
  .then( function () {
    return knex('items').del()
  })
  .then( function () {
    return knex('diner_item_ratings').del()
  })
  .then( function() {
    return knex('trucks_table').insert([
      {owner_id: 1, truck_name: 'joes taco truck', truck_img_url: truckImg, cuisine_type: 'mexican', departure_time: '09:30:00'},
      {owner_id: 1, truck_name: 'jims life-changing street food', truck_img_url: truckImg2, cuisine_type: 'vietnamese', departure_time: '09:30:00'}
    ])
  })
  
  
  .then( function () {
    return knex('visited_trucks').insert([
      { diner_id: 2, rating: 4, favorite: true, truck_id: 1},
      { diner_id: 2, rating: 4, favorite: true, truck_id: 2},
      { diner_id: 3, rating: 4, favorite: true, truck_id: 2},
      { diner_id: 3, rating: 4, favorite: true, truck_id: 1}
    ])
  })
 
  .then( function () {
    return knex('items').insert([
      { truck_id: 1, item_name: 'Beef Barbacoa Taco', item_description: 'Slow braised short ribs with avocado leaf.', item_photo_url: beeftaco, item_price: 3.75},
      { truck_id: 1, item_name: 'Pork Tamale', item_description: 'Roasted pork and cornmeal baked in a corn husk.', item_photo_url: porktamale, item_price: 5.00},
      { truck_id: 1, item_name: 'Baja Fish Taco', item_description: 'Catch of the day in negra modelo. Batter with chipotle slaw.', item_photo_url: fishtaco, item_price: 3.75},
      { truck_id: 1, item_name: 'Chicken Tamale ', item_description: 'Smoky chicken and cornmeal baked in a corn husk.', item_photo_url: porktamale, item_price: 5.00},
      { truck_id: 1, item_name: 'Chocolate Tamale', item_description: 'With vanilla ice cream.', item_photo_url: chocolate, item_price: 5.50},
      { truck_id: 1, item_name: 'Spicy Chorizo Taco', item_description: 'Homemade Spanish sausage with paprika and ancho chile. Gluten free.', item_photo_url: chorizo, item_price: 4.00},
      { truck_id: 2, item_name: 'Pho Tai', item_description: 'Rice noodle with medium rare beef.', item_photo_url: phoTai, item_price: 12.00},
      { truck_id: 2, item_name: 'Crab Rangoon', item_description: '4 deep fry of cream cheese and crab meat wrapped in wanton skin.', item_photo_url: crab, item_price: 7.00},
      { truck_id: 2, item_name: 'Butter Garlic Noodles', item_description: 'Soft egg noodles wok fried with butter and garlic.', item_photo_url: butter, item_price: 8.00},
      { truck_id: 2, item_name: 'Bun Rieu', item_description: 'Minced crab meat in tomato soup base with vermicelli noodles.', item_photo_url: bun, item_price: 14.00}

    ])
  })
 
  .then( function () {
    return knex('diner_item_ratings').insert([
      { diner_id: 2, item_id: 1, rating: 2},
      { diner_id: 2, item_id: 2, rating: 5},
      { diner_id: 3, item_id: 1, rating: 2},
      { diner_id: 3, item_id: 2, rating: 5},
      { diner_id: 2, item_id: 3, rating: 2},
      { diner_id: 2, item_id: 4, rating: 5}
    ])
  })
    
}
