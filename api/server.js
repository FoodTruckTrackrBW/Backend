require('dotenv').config()
const express = require('express');
const cors = require("cors");
const authRouter = require('../routers/auth/auth-router.js')
const dinerRouter = require('../routers/diner/diner-router.js')
const operatorRouter = require('../routers/operator/operator-router.js')
const { authenticator, operator, diner} = require('../middleware/middleware.js')

const server = express();




app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin",  '*');

    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Credentials", true);

    next(); 
});

server.use(express.json());
server.use(cors());
server.use('/api/diner', authenticator, diner,  dinerRouter);
server.use('/api/operator', authenticator, operator, operatorRouter);
server.use('/api/auth', authRouter);

server.get('/', (req,res) => {
    res.status(200).json({message: 'server up'})
})
module.exports = server;