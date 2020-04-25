const express = require('express');
const server = express.Router();
const diner = require('./diner-model.js')




server.get('/', (req, res) => {
    diner.getTrucks()
    .then( trucks => {
        res.status(200).json({trucks})
    })
})

server.get('/:id/menu', (req, res) => {
    let truckId = req.params.id
    diner.getMenu(truckId)
    .then( menu => {
        res.status(200).json({menu})
    })
})


module.exports = server