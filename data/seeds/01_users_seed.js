
exports.seed = function(knex) {
 
  return knex('users').del()
    .then(function () {
       return knex('users').insert([
        { username: 'admin1', email: 'admin@admin.com', password: 'password', user_type: 'operator'},
        { username: 'admin2', email: 'admin@admin.com', password: 'password', user_type: 'diner', favorite_cuisine_type: 'spaghetti'}
      ]);
    
    })
  
};
