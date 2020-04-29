const express = require('express');
const server = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('./auth-model.js')
const { generateToken, dinerRegister, authenticator } = require('../../middleware/middleware.js')

const knexPostgis = require("knex-postgis");
const db = require('../../data/dbConfig.js');
// install postgis functions in knex.postgis;
const st = knexPostgis(db);

function generateLocation(lat,long) {
  return st.setSRID(st.makePoint(lat, long), 4326)
}
//read env variables
require('dotenv').config();


// Post must include username, email, password, and user_type
// if the user_type = diner then the user must specify a favorite_cuisine_type
// this check should be enforced on the front end as well
// user password will be hashed and stored that way. 
server.post('/register', dinerRegister,  (req, res) => {
    req.body.user_location = req.body.user_lat && req.body.user_long ? generateLocation(req.body.user_lat, req.body.user_long) : null;
    let newUser = req.body
    const hash = bcrypt.hashSync( newUser.password, 12)
    newUser.password = hash
    auth.registerUser(newUser)
    .then(({user}) => {
        res.status(201).json({message: 'Registration successful', userId: user[0]})
    })
    .catch(err => res.status(400).json({error: err.detail}));
})


// Post must include username, and password
// if the user exists it will return a token that includes their userId, username, and userType
server.post('/login', (req, res) => {
    let {username, password} = req.body
    if(!username || !password) {
        res.status(400).json({error: 'Please provide username and password to login'});
        return;
    }
    auth.findBy({username: username})
    .then( (found) => {
        // 
        if(found && bcrypt.compareSync(password, found.password) ) {
            // console.log(found)
            const token =  generateToken(found)
            // console.log("token error", token)
            res.status(201).json({ message: "Successful Login", token: token})
        } else {
            res.status(401).json({ message: "User info does not exist or password is wrong"})
        }
    }) 
    .catch(err => {
        res.status(500).json({error: "somethings wrong", err, username, password})
    })
})


// Will retreive the account info of the logged in user
server.get('/account', authenticator, (req,res) => {
    let accountId = req.decodedToken.userId
    auth.findBy({id: accountId})
    .then( user => {
        if(user){
            user.password = "******";
            res.status(200).json({...user})
        } else {
            res.status(401).json({ message: "No user found" })
        }
    })
    .catch( err => {  res.status(500).json({error: err}) })
})


// Allows users to submit an object with updated info for their account
// User ID provided from their JWT token
// User can submit an update to their favorite cuisine, email, and password. 
// requests to change username or password will be denied
// password changes will be rehashed before being stored
server.put('/account', authenticator, (req,res) => {
    let accountUpdate = {}
    if(!req.body) {
        res.status(401).json({error: 'Please provide some information to update'});
        return;
    }
    if(req.body.user_type){
        res.status(401).json({error: "User cannot change Account Type"});
        return;
    }
    if(req.body.password){
        req.body.password = bcrypt.hashSync( req.body.password, 12)
    }
   
    accountUpdate.id = req.decodedToken.userId
    accountUpdate.update = req.body
    auth.updateAccount(accountUpdate)
    .then( async success => {
        const user = await auth.findBy({id: accountUpdate.id});
        user.password = '******';
        res.status(200).json(user)
    })
    .catch( err => {  res.status(500).json({error: err}) })
})



// User can delete their account. Information for ID pulled from user's JWT
server.delete('/account', authenticator, (req,res) => {
   
    accountToDelete = req.decodedToken.userId
    auth.deleteAccount(accountToDelete)
    .then( user => {
        res.status(200).json({user})
    })
    .catch( err => { res.status(500).json({error: err}) })
})






module.exports = server
