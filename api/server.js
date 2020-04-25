require('dotenv').config()
const express = require('express');
const cors = require("cors");
const authRouter = require('../routers/auth/auth-router.js')
const dinerRouter = require('../routers/diner/diner-router.js')
const { authenticator, operator, diner} = require('../middleware/middleware.js')

const server = express();


server.use(express.json());
server.use(cors());
server.use('/api/diner', authenticator, diner,  dinerRouter);
// server.use('/api/operator', authenticator, operator, operatorRouter);
server.use('/api/auth', authRouter);

server.get('/', (req,res) => {
    res.status(200).json({message: 'server up'})
})
module.exports = server;