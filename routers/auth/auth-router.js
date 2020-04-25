const express = require('express');
const server = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('./auth-model.js')
const { generateToken, dinerRegister } = require('../../middleware/middleware.js')



server.post('/register', dinerRegister,  (req, res) => {
    let newUser = req.body
    const hash = bcrypt.hashSync( newUser.password, 12)
    newUser.password = hash
    auth.registerUser(newUser)
    .then(user => {
        res.status(201).json({user})
    })
})

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
