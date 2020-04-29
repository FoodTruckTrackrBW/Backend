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
        { username: 'operator', email: 'operator@test.com', password: '$2a$12$oIEYQRurNpH24AdQYFe1bO0vXpiyfwq3qQYeXMgdk4a26gBYbzvl2', user_type: 'operator'}, //password operator
        { username: 'diner1', email: 'diner1@test.com', password: '$2a$12$vhn/xo7xostBZs.c6YuYgOyOrXpx9ubmDyu8Ea159LAlrQVwbPsBS', user_type: 'diner', user_lat: 43, user_long: 45, user_location: generateLocation(43, 45)}, //password diner
        { username: 'diner2', email: 'diner2@test.com', password: '$2a$12$XAU3HP4KLBxyWHPQWSuq.ehzs8WhllRFquNzTcPZpd2zYTZXaN8Ju', user_type: 'diner', favorite_cuisine_type: 'spaghetti', user_lat: 43, user_long: 45.1, user_location: generateLocation(43, 45.1)} //password test
      ]);
    
    })
  
};
