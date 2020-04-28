const knex = require("knex");
const knexPostgis = require("knex-postgis");
const db = require('../dbConfig.js');
// install postgis functions in knex.postgis;
const st = knexPostgis(db);

function generateLocation(lat,long) {
  return st.setSRID(st.makePoint(lat, long), 4326)
}

exports.seed = function(knex) {
 
  return knex('users').del()
    .then(function () {
       return knex('users').insert([
        { username: 'admin1', email: 'admin@admin.com', password: 'password', user_type: 'operator'},
        { username: 'admin2', email: 'admin@admin.com', password: 'password', user_type: 'diner', favorite_cuisine_type: 'spaghetti', user_lat: 43, user_long: 45, user_location: generateLocation(43, 45)},
        { username: 'admin3', email: 'admin@admin.com', password: 'password', user_type: 'diner', favorite_cuisine_type: 'spaghetti', user_lat: 43, user_long: 45.1, user_location: generateLocation(43, 45.1)}
      ]);
    
    })
  
};
