const express = require('express');
const server = express.Router();
const diner = require('./diner-model.js')

// this route will only work if the logged in user's type is Diner

// will retreive a list of trucks for the diner
server.get('/', (req, res) => {
    diner.getTrucks()
    .then( trucks => {
        res.status(200).json({trucks})
    })
})

// will retreive a list of items sold by the truck who's id is given
server.get('/:id/menu', (req, res) => {
    let truck_id = req.params.id
    diner.getMenu(truck_id)
    .then( menu => {
        res.status(200).json({menu})
    })
})



// retreives a list of trucks the diner has checked into
server.get('/visited', (req,res) => {
    let dinerId = req.decodedToken.userId
    diner.getVisited(dinerId)
    .then(visited => {
        visited.map(e => {
            console.log(e)
            if(!e.rating){
                e.rating = 'No Diner Rating'
            }
        })
      
        res.status(200).json({visited})
    })
})

// submits a checkin that registers the truck to the users visited list
server.post('/:id/checkin', (req,res) => {
    let truck = {}
    truck.truck_id = req.params.id
    truck.diner_id = req.decodedToken.userId
    diner.truckCheckIn(truck)
    .then( success => {
        res.status(201).json({message: "user successfully checked in"})
    })
})

// an update to checked in trucks that allows user to submit a rating or mark as a favorite
server.put('/:id/updateVisit', (req,res) => {
    let update = {}
    update.truck_id = req.params.id
    update.diner_id = req.decodedToken.userId
    if(req.body.favorite){
        update.favorite = req.body.favorite
    }
    if(req.body.rating){
        if(req.body.rating > 5 || req.body.rating < 0) {
            res.status(401).json({message: "user rating must be within 0-5"})
        } else {
            update.rating = req.body.rating
        }
    }
    if(!req.body.favorite && !req.body.rating){
        res.status(401).json({message: "user must update something."})
    }

    diner.visitUpdate(update)
    .then( success => {
        res.status(201).json({message: "user successfully updated visit"})
    })
})


// allows user to post ratings for items at food trucks
server.post('/:id/menu/:itemId', (req,res) => {
    let item = {}
    item.item_id = req.params.itemId
    item.diner_id = req.decodedToken.userId
    item.rating = req.body.rating
    diner.itemRating(item)
    .then( success => {
        res.status(201).json({message: "user successfully updated favorites"})
    })
})

module.exports = server