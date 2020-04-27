const db = require('../../data/dbConfig')

module.exports = {
    registerUser,
    getUsers,
    findBy,
    updateAccount,
    deleteAccount
}


// gets a list of users 
function getUsers(){
    return db('users')
}


// allows users to register an account to the db
function registerUser(user) {
    return db('users')
    .insert(user, 'id')
    .then(user => ({user}));
}


//returns the first user based on the filter
async function findBy(filter) {
    const res = await db("users").where(filter).first()
    return res
  }


// update users account
function updateAccount(user){
    return db('users')
        .where({id: user.id})
        .update(user.update)
}

//deletes user account
function deleteAccount(user) {
    return db('users')
    .where({id: user})
    .del()
}


