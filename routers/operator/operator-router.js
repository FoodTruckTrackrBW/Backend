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
server.get('/:id', validateTruckId, (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then(truck => {
        res.status(200).json({truck})
    })
})

// Operators can register trucks under their user id
// User Id is taken from operators JWT
server.post('/', (req,res) => {
    req.body.owner_id = req.decodedToken.userId

    if(req.body.truck_lat && req.body.truck_long) {
        req.body.truck_location = operator.generateLocation(req.body.truck_lat, req.body.truck_long)
    }

    if(!req.body.truck_name || !req.body.cuisine_type || !req.body.departure_time) {
        res.status(400).json({error: 'Please provide truck_name, cuisine_type and departure_time'});
        return;
    }

    operator.registerTruck(req.body)
    .then( truck => {
        res.status(201).json({message: "truck has been added"});
    })
    .catch(err => res.status(400).json( { error: err.detail } ) );
})

// Operators can update their trucks information 
// id of truck being updated is taken from req.params.id
server.put('/:id', validateTruckId, (req,res) => {
    let truck = {}
    truck.owner_id = req.decodedToken.userId
    truck.id = req.params.id

    if(!req.body.truck_name && !req.body.truck_img_url && !req.body.cuisine_type && !req.body.departure_time) {
        res.status(400).json({error: 'Please provide some information to update'});
        return;
    }

    truck.body = req.body
    operator.getSpecificTruck(truck.owner_id, truck.id)
    .then( specificTruck => {
        const truckToUpdate = {}
        truckToUpdate.truck_name = specificTruck.truck_name
        truckToUpdate.truck_img_url = specificTruck.truck_img_url
        truckToUpdate.cuisine_type = specificTruck.cuisine_type
        truckToUpdate.departure_time = specificTruck.departure_time

        operator.updateTruck(truck, truckToUpdate)
            .then( update => {
            res.status(201).json({ message: "truck has been updated"})
            })
            .catch(err => res.status(401).json({error: err.detail}))
    })
})


server.delete('/:id', validateTruckId, (req,res) => {
    let truck = {}
    truck.owner_id = req.decodedToken.userId
    truck.id = req.params.id
    operator.deleteTruck(truck.owner_id, truck.id)
    .then(result => res.status(201).json({message: "truck successfully deleted"}))
})


// Operators can retreive a list of ratings for a truck they own
// truck id is pulled from req.params.id
server.get('/:id/ratings', validateTruckId, (req,res) => {
    operator.truckRatings(req.params.id)
    .then(ratings => {
        res.status(200).json({ratings})
    })
})

//  Operators can create items for their truck. 
// items are tied to the truck via req.params.id
server.post('/:id/items', validateTruckId, (req,res) => {
    if(!req.body.item_name || !req.body.item_description || !req.body.item_price) {
        res.status(400).json({ error: 'Please provide item_name, item_description, item_price'});
        return;
    }
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            req.body.truck_id = req.params.id
            operator.createItem(req.body)
            .then(item => {res.status(201).json({message: "item created"})})
        } else {
            res.status(401).json({error: "This aint yo truck"})
        }
    }) 
})

// operators can get a list of items from one of their trucks. 
server.get('/:id/items', validateTruckId, (req,res) => {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.truckItems(req.params.id)
            .then(items => res.status(200).json({items}))
        }   
    })
})



// operators can get a list of items from one of their trucks. 
server.get('/:id/items/:itemId', validateTruckId, validateItemID, (req,res) => {

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
server.get('/:id/items/:itemId/ratings', validateTruckId, validateItemID, (req,res) => {
    operator.itemRatings(req.params.itemId)
    .then(ratings => {
        res.status(200).json({ratings})
    })
})

// operators can update an item from one of their trucks
server.put('/:id/items/:itemId', validateTruckId, validateItemID, (req, res)=> {
    operator.getSpecificTruck(req.decodedToken.userId, req.params.id)
    .then( truck => {
        if(truck.owner_id === req.decodedToken.userId){
            operator.truckSpecificItem(req.params.id, req.params.itemId)
            .then(item => {
            const itemToUpdate = item
            let update = {}
            update.id = req.params.itemId
            if(!req.body.item_name && !req.body.item_photo_url && !req.body.item_description && !req.body.item_price) {
                res.status(400).json({ error: 'Please provide something to update'});
                return;
            }
            update.body = req.body
            operator.updateItem(update, itemToUpdate)
            .then(item => {res.status(201).json({message: "item updated"})})
            })
        } else {
            res.status(201).json({error: "This aint yo truck"})
        }
    })
})

server.delete('/:id/items/:itemId', validateTruckId, validateItemID, (req,res) => {
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

async function validateTruckId(req, res, next) {
    const truck = await operator.getSpecificTruck(req.decodedToken.userId, req.params.id);
    if(truck){
        next();
    } else {
        res.status(404).json({error: 'Invalid Truck ID'});
    }
}

async function validateItemID(req, res, next) {
    const item = await operator.truckSpecificItem(req.params.id, req.params.itemId); 
    if(item) {
        next();
    } else {
        res.status(404).json({error: 'Invalid Item ID'});
    } 
}
module.exports = server 