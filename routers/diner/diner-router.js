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
    .catch(err => res.status(500).json(err));
})

// will retreive a list of items sold by the truck who's id is given
server.get('/:id/menu', validateTruckID, (req, res) => {
    let truck_id = req.params.id
    diner.getMenu(truck_id)
    .then( menu => {
        res.status(200).json({menu})
    })
    .catch(err => res.status(500).json(err));
})


// retreives a list of trucks the diner has checked into
server.get('/visited', (req,res) => {
    let dinerId = req.decodedToken.userId
    diner.getVisited(dinerId)
    .then(visited => {
        visited.map(e => {
            if(!e.rating){
                e.rating = 'No Diner Rating'
            }
        })
        res.status(200).json({visited})
    })
    .catch(err => res.status(500).json(err));
})

// submits a checkin that registers the truck to the users visited list
server.post('/:id/checkin', validateTruckID, async (req,res) => {
    let truck = {}
    truck.truck_id = req.params.id
    truck.diner_id = req.decodedToken.userId

    // check if truck is already marked checkedIn
    const visitedTrucks = await diner.getVisited(truck.diner_id);
    let found = false;

    visitedTrucks.map(t => {
        if(t.truck_id == truck.truck_id){
            found = true;
        }
    });
    if(found){
        res.status(400).json({error: 'Truck already checked in'});
        return;
    }

    diner.truckCheckIn(truck)
    .then( success => {
        res.status(201).json({message: "user successfully checked in"})
    })
    .catch(err => res.status(500).json(err));
})

// an update to checked in trucks that allows user to submit a rating or mark as a favorite
server.put('/:id/updateVisit', validateTruckID, (req,res) => {
    let update = {}
    update.truck_id = req.params.id
    update.diner_id = req.decodedToken.userId
    if(req.body.favorite != undefined){
        if(req.body.favorite == true || req.body.favorite == false) {
            update.favorite = req.body.favorite;
        } else {
            res.status(401).json({error: 'Please provide a boolean as favorite value'});
            return;
        }
    }
    if(req.body.rating){
        if(req.body.rating > 5 || req.body.rating < 0) {
            res.status(401).json({error: "user rating must be within 0-5"});
            return;
        } else {
            update.rating = req.body.rating;
        }
    }
    if(req.body.favorite == undefined && !req.body.rating){
        res.status(401).json({message: "user must update something."});
        return;
    }

    diner.visitUpdate(update)
    .then( success => {
        res.status(201).json({message: "user successfully updated visit"})
    })
    .catch(err => res.status(500).json(err));
})


// allows user to post ratings for items at food trucks
server.post('/:id/menu/:itemId', validateTruckID, validateItemID, (req,res) => {
    let item = {}
    item.item_id = req.params.itemId
    item.diner_id = req.decodedToken.userId
    item.rating = req.body.rating
    if(req.body.rating > 5 || req.body.rating < 0) {
        res.status(401).json({message: "user rating must be within 0-5"});
        return;
    } 
    diner.itemRating(item)
    .then( success => {
        res.status(201).json({message: "user successfully updated favorites"})
    })
    .catch(err => res.status(500).json(err));
})

// allows user to filter trucks in a given radius(miles) - default 10 miles
server.get('/trucksNearMe', (req, res) => {
    const radius = req.body.radius ? req.body.radius : 10
    diner.getTrucksNearMe(req.decodedToken.userId, radius)
        .then(trucks => {
            res.status(201).json(trucks)
        })
        .catch(err => res.status(500).json(err));
})

// allows user to filter trucks by cuisine(optional - default to diner's favorite cuisine)
server.get('/trucksByCuisine', (req, res) => {
    diner.getTrucksByCuisine(req.decodedToken.userId, req.body.cuisine)
        .then(trucks => {
            res.status(201).json({trucks: trucks})
        })
        .catch(err => res.status(500).json(err));
})

async function validateTruckID(req, res, next) {
    let truck_id = req.params.id;
    const truck = await diner.getTruckByID(truck_id); 
    if(truck) {
        next();
    } else {
        res.status(404).json({error: 'Invalid Truck ID'});
    }
}

async function validateItemID(req, res, next) {
    let item_id = req.params.itemId;
    const item = await diner.getItemByID(item_id); 
    if(item) {
        next();
    } else {
        res.status(404).json({error: 'Invalid Item ID'});
    }
}

module.exports = server