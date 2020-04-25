
exports.seed = function(knex) {
  const truckImg = ' https://images.unsplash.com/photo-1574280363402-2f672940b871?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
  const spaghetti =  'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80'
  
  // Deletes ALL existing entries
  return knex('trucks_table').del()

  .then( function() {
    return knex('trucks_table').insert([
      {owner_id: 1, truck_name: 'joes truck', truck_img_url: truckImg, cuisine_type: 'food', departure_time: '09:30:00'}
    ])
  })
  
  .then( function () {
    return knex('visited_trucks').del()
  })
  .then( function () {
    return knex('visited_trucks').insert([
      { diner_id: 2, rating: 4, favorite: true, truck_id: 1}
    ])
  })
  .then( function () {
    return knex('items').del()
  })
  .then( function () {
    return knex('items').insert([
      { truck_id: 1, item_name: 'spaghetti', item_description: 'its spaghetti', item_photo_url: spaghetti, item_price: 1.99},
      { truck_id: 1, item_name: ' more spaghetti', item_description: 'its still spaghetti', item_photo_url: spaghetti, item_price: 1.99}

    ])
  })
  .then( function () {
    return knex('diner_item_ratings').del()
  })
  .then( function () {
    return knex('diner_item_ratings').insert([
      { diner_id: 2, item_id: 1, rating: 2},
      { diner_id: 2, item_id: 2, rating: 5}
    ])
  })
    
}
