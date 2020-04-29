const request = require('supertest');

const server = require('../../api/server.js');

const dinerData = {
    username: 'testDiner', 
    password: '123'
}
let token = "";

describe('GET /', function() {
    it('successfully get all trucks when token is valid', async function () {
        const res = await request(server).post('/api/auth/login').send(dinerData);
        token = res.body.token;
        return request(server)
            .get('/api/diner')
            .set('authorization', token)
            .then(res => {
                //should return the status code 200
                expect(res.status).toBe(200);

                //should contain trucks value
                expect(res.body.trucks).toBeDefined();
            })
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .get('/api/diner/')
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Truck Menu', function() {
    it('successfully shows the item list with prices for selected truck', function() {
        return request(server)
            .get('/api/diner/1/menu')
            .set('authorization', token)
            .then(res => {
                // should return the status 200
                expect(res.status).toBe(200);

                // should return the list of items
                expect(res.body.menu).toBeDefined();
            });
    });
    it('should not show item list for other trucks', function() {
        return request(server)
            .get('/api/diner/1/menu')
            .set('authorization', token)
            .then(async res => {
                // should return the status 200
                expect(res.status).toBe(200);

                // should return the list of items only from truck_id = 1
                const truckIdMatch = true;
                await res.body.menu.map(i => {
                    if(i.truck_id != 1) {
                        truckIdMatch = false;
                    }
                })
                expect(truckIdMatch).toBeTruthy();
            })
    });
    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .get('/api/diner/102/menu')
            .set('authorization', token)
            .then(res => {
                // should return the status 404
                expect(res.status).toBe(404);

                // should return the error
                expect(res.body.error).toBe('Invalid Truck ID');
            })
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .get('/api/diner/1/menu')
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Visited Trucks', function() {
    it('should return the list of visited trucks when token is valid', function() {
        return request(server)
            .get('/api/diner/visited')
            .set('authorization', token)
            .then(res => {
                // should have a status 200
                expect(res.status).toBe(200);

                // should return a visited array
                expect(res.body.visited).toBeDefined();
            });
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .get('/api/diner/visited')
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Checkin', function() {
    it('should successfully check in the truck under visited list for user', function() {
        return request(server)
            .post('/api/diner/1/checkin')
            .set('authorization', token)
            .then(res => {
                // should have a status 201
                // expect(res.status).toBe(201);

                // should return a success message
                // expect(res.body.message).toBe('user successfully checked in');
            });
    });
    it('should throw an error when truck already checked in', function() {
        return request(server)
            .post('/api/diner/1/checkin')
            .set('authorization', token)
            .then(res => {
                // should have a status 400
                expect(res.status).toBe(400);

                // should return an error message
                expect(res.body.error).toBe('Truck already checked in');
            });
    });

    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .post('/api/diner/102/checkin')
            .set('authorization', token)
            .then(res => {
                // should return the status 404
                expect(res.status).toBe(404);

                // should return the error
                expect(res.body.error).toBe('Invalid Truck ID');
            })
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .post('/api/diner/1/checkin')
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Update Visit', function() {
    it('should throw an error when update is not given', function() {
        return request(server)
            .put('/api/diner/1/updateVisit')
            .set('authorization', token)
            .then(res => {
                // should return the status 401
                expect(res.status).toBe(401);

                // should return the error
                expect(res.body.message).toBe('user must update something.');
            })
    });

    describe('Mark favorite', function() {
        it('should mark the truck as favorite', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite: true})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 201
                    expect(res.status).toBe(201);

                    // should return the success message
                    expect(res.body.message).toBe('user successfully updated visit');
                });
        });
        it('should unmark the truck as favorite', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite: false})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 201
                    expect(res.status).toBe(201);

                    // should return the success message
                    expect(res.body.message).toBe('user successfully updated visit');
                });
        });
        it('should throw an error when favorite value is invalid', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite: 'XYZ'})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 401
                    expect(res.status).toBe(401);

                    // should return the error message
                    expect(res.body.error).toBe('Please provide a boolean as favorite value');
                });
        });
        it('should throw an error when truck id is invalid', function() {
            return request(server)
                .put('/api/diner/102/updateVisit')
                .send({favorite: true})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 404
                    expect(res.status).toBe(404);

                    // should return the error message
                    expect(res.body.error).toBe('Invalid Truck ID');
                });
        });
        it('throws an error when token is invalid', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite: true})
                .set('authorization', 'XYZ')
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);
    
                    // should return a error message
                    expect(res.body.message).toBe('Something is wrong with your token');
                });
        });
    });

    describe('Update Rating', function() {
        it('should update the rating for the truck', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({rating: 5})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 201
                    expect(res.status).toBe(201);

                    // should return the success message
                    expect(res.body.message).toBe('user successfully updated visit');
                });
        });
        it('should throw an error when rating is invalid', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({rating: 10})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 401
                    expect(res.status).toBe(401);

                    // should return the error message
                    expect(res.body.error).toBe('user rating must be within 0-5');
                });
        });
        it('should throw an error when truck id is invalid', function() {
            return request(server)
                .put('/api/diner/102/updateVisit')
                .send({rating: 4})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 401
                    expect(res.status).toBe(404);

                    // should return the error message
                    expect(res.body.error).toBe('Invalid Truck ID');
                });
        });
        it('throws an error when token is invalid', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite:true, rating: 4})
                .set('authorization', 'XYZ')
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);
    
                    // should return a error message
                    expect(res.body.message).toBe('Something is wrong with your token');
                });
        });
    });

    describe('Update Both Rating and Favorite', function() {
        it('should update the rating and favorite', function() {
            return request(server)
                .put('/api/diner/1/updateVisit')
                .send({favorite: true, rating: 4})
                .set('authorization', token)
                .then(res => {
                    // should return the status code 201
                    expect(res.status).toBe(201);

                    // should return the success message
                    expect(res.body.message).toBe('user successfully updated visit');
                });
        });
    })
});

describe('Rate Items', function() {
    it('should successfully update the item rating', function() {
        return request(server)
            .post('/api/diner/1/menu/2')
            .send({ rating: 5 })
            .set('authorization', token)
            .then(res => {
                // should have the status code 201
                expect(res.status).toBe(201);

                // should show the success message
                expect(res.body.message).toBe('user successfully updated favorites');
            });
    });
    it('should throw an error when rating is invalid', function() {
        return request(server)
            .post('/api/diner/1/menu/2')
            .send({ rating: 14 })
            .set('authorization', token)
            .then(res => {
                // should have the status code 401
                expect(res.status).toBe(401);

                // should show the error message
                expect(res.body.message).toBe('user rating must be within 0-5');
            });
    });
    it('should throw an error when truck Id is invalid', function() {
        return request(server)
            .post('/api/diner/102/menu/2')
            .send({ rating: 4 })
            .set('authorization', token)
            .then(res => {
                // should have the status code 404
                expect(res.status).toBe(404);

                // should show the error message
                expect(res.body.error).toBe('Invalid Truck ID');
            });
    });
    it('should throw an error when item id is invalid', function() {
        return request(server)
            .post('/api/diner/1/menu/203')
            .send({ rating: 4 })
            .set('authorization', token)
            .then(res => {
                // should have the status code 404
                expect(res.status).toBe(404);

                // should show the error message
                expect(res.body.error).toBe('Invalid Item ID');
            });
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .post('/api/diner/1/menu/2')
            .send({ rating: 4 })
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);
    
                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Trucks Near Me', function() {
    it('should return an error when user location is not defined', function() {
        return request(server)
            .get('/api/diner/trucksNearMe')
            .set('authorization', token)
            .then(res => {
                // should have the status 201
                expect(res.status).toBe(201)

                // should have the error message
                expect(res.body.message).toBe('No location defined for the diner');
            });
    });
    it.todo('should return a list of trucks under 10 mile radius when no radius given');
    it.todo('should return a list of trucks within x mile radius');
    it.todo('throws an error when token is invalid');
});

describe('Trucks by Cuisine', function() {
    it('should return trucks with cuisine type as diner favorite cuisine when cuisine is undefined', function() {
        return request(server)
            .get('/api/diner/trucksByCuisine')
            .set('authorization', token)
            .then(res => {
                // should have the status 201
                expect(res.status).toBe(201);

                // expect a list of trucks
                expect(res.body.trucks).toBeDefined();
            });
    });
    it('should return trucks with given cuisine', function() {
        return request(server)
            .get('/api/diner/trucksByCuisine')
            .send({cuisine: 'mexican'})
            .set('authorization', token)
            .then(res => {
                // should have the status 201
                expect(res.status).toBe(201);

                // expect a list of trucks
                expect(res.body.trucks).toBeDefined();

                //expect the trucks cuisine type to match mexican
                expect(res.body.trucks[0].cuisine_type).toBe('mexican');
            });
    });
    it('should have length 0 when cuisine is not found', function() {
        return request(server)
            .get('/api/diner/trucksByCuisine')
            .send({cuisine: 'indian'})
            .set('authorization', token)
            .then(res => {
                // should have the status 201
                expect(res.status).toBe(201);

                // expect a list of trucks
                expect(res.body.trucks).toBeDefined();

                //expect the trucks array to have length 0
                expect(res.body.trucks).toHaveLength(0);
            });
    });
    it('throws an error when token is invalid', function() {
        return request(server)
            .get('/api/diner/trucksByCuisine')
            .send({cuisine: 'mexican'})
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
})
