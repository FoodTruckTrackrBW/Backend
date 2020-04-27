const express = require('express');
const server = express.Router();
const operator = require('./operator-model.js')

// this route will only work if the logged in user's type is Operator

// Operators can see a list of trucks they own based on their user_id
// User_id is retrieved from the users JWT
server.get('/', (req,res) => {
    operator.getTrucks(req.decodedToken.userId)
    .then( trucks => {
        res.status(200).json({trucks})
    })
})

// Operators can view a specific truck
server.get('/:id', (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then(truck => {
        res.status(200).json({truck})
    })
})

// Operators can register trucks under their user id
// User Id is taken from operators JWT
server.post('/', (req,res) => {
    req.body.owner_id = req.decodedToken.userId
    operator.registerTruck(req.body)
    .then( truck => {
        res.status(201).json({message: "truck has been added"})
    })
})

// Operators can update their trucks information 
// id of truck being updated is taken from req.params.id
server.put('/:id', (req,res) => {
    let truck = {}
    truck.owner_id = req.decodedToken.userId
    truck.id = req.params.id
    truck.body = req.body
    operator.getSpecificTruck(truck.owner_id, truck.id)
    .then( specificTruck => {
        const truckToUpdate = {}
        truckToUpdate.truck_name = specificTruck.truck_name
        truckToUpdate.truck_img_url = specificTruck.truck_img_url
        truckToUpdate.cuisine_type = specificTruck.cuisine_type
        truckToUpdate.departure_time = specificTruck.departure_time
        operator.updateTruck(truck, truckToUpdate).then( update => {
            res.status(201).json({ message: "truck has been updated"})
        }).catch(err => {console.log(err)})
    })
})


server.delete('/:id', (req,res) => {
    let truck = {}
    truck.owner_id = req.decodedToken.userId
    truck.id = req.params.id
    operator.deleteTruck(truck.owner_id, truck.id)
    .then(result => res.status(201).json({message: "truck successfully deleted"}))
})


// Operators can retreive a list of ratings for a truck they own
// truck id is pulled from req.params.id
server.get('/:id/ratings', (req,res) => {
    operator.truckRatings(req.params.id)
    .then(ratings => {
        res.status(200).json({ratings})
    })
})

//  Operators can create items for their truck. 
// items are tied to the truck via req.params.id
server.post('/:id/items', (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            req.body.truck_id = req.params.id
            operator.createItem(req.body)
            .then(item => {res.status(201).json({message: "item created"})})
        } else {
            res.status(201).json({error: "This aint yo truck"})
        }
    }) 
})

// operators can get a list of items from one of their trucks. 
server.get('/:id/items', (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.truckItems(req.params.id)
            .then(items => res.status(200).json({items}))
        }   
    })
})



// operators can get a list of items from one of their trucks. 
server.get('/:id/items/:itemId', (req,res) => {

    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.truckSpecificItem(req.params.id, req.params.itemId)
            .then(items => res.status(200).json({items}))
        } else {
             res.status(201).json({error: "This aint yo truck"})
        }
    }) 
})
// returns a list of ratings for item
server.get('/:id/items/:itemId/ratings', (req,res) => {
    operator.itemRatings(req.params.itemId)
    .then(ratings => {
        res.status(200).json({ratings})
    })
})

// operators can update an item from one of their trucks
server.put('/:id/items/:itemId', (req, res)=> {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.truckSpecificItem(req.params.id, req.params.itemId)
            .then(item => {
            const itemToUpdate = item
            let update = {}
            update.id = req.params.itemId
            update.body = req.body
            operator.updateItem(update, itemToUpdate)
            .then(item => {res.status(201).json({message: "item updated"})})
            })
        } else {
            res.status(201).json({error: "This aint yo truck"})
        }
    })
})

server.delete('/:id/items/:itemId', (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.deleteItem(req.params.id, req.params.itemId)
            .then(item => {
                res.status(201).json({message: "item successfully deleted"})
            })
        } else {
            res.status(201).json({error: "This aint yo truck"})
        }
    })
})


module.exports = server 