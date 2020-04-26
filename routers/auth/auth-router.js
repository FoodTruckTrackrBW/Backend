const express = require('express');
const server = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('./auth-model.js')
const { generateToken, dinerRegister } = require('../../middleware/middleware.js')


// Post must include username, email, password, and user_type
// if the user_type = diner then the user must specify a favorite_cuisine_type
// this check should be enforced on the front end as well
// user password will be hashed and stored that way. 
server.post('/register', dinerRegister,  (req, res) => {
    let newUser = req.body
    const hash = bcrypt.hashSync( newUser.password, 12)
    newUser.password = hash
    auth.registerUser(newUser)
    .then(user => {
        res.status(201).json({user})
    })
})


// Post must include username, and password
// if the user exists it will return a token that includes their userId, username, and userType
server.post('/login', (req, res) => {
    let {username, password} = req.body
    auth.findBy({ username })
    .then(found => {
        if(found && bcrypt.compareSync(password, found.password)) {
            const token = generateToken(found)
            res.status(201).json({ message: "Successful Login", token: token})
        } else {
            res.status(401).json({ message: "User info does not exist"})
        }
    }) 
    .catch(err => { console.log(err)
        res.status(500).json({error: err})})
})






module.exports = server
