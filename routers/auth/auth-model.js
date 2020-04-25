const db = require('../../data/dbConfig')

module.exports = {
    registerUser,
    getUsers,
    findBy
}

function getUsers(){
    return db('users')
}

function registerUser(user) {
    return db('users')
    .insert(user, 'id')
    .then(user => ({user}));
}

function findBy(filter) {
    return db("users").where(filter).first();
  }
