const request = require('supertest');
const server = require('../../api/server.js');

// Test Data
const operatorData = {
    username: 'testOperator',
    password: '123',
    email: 'test@123.com',
    user_type: 'operator',
}

const operatorData2 = {
    username: 'testOperator',
    password: '123'
};

const truckData = {
    truck_name: 'Test Truck 1',
    truck_img_url: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1726&q=80',
    cuisine_type: 'mexican',
    departure_time: '09:30:00'
}

const truckData2 = {
    truck_name: 'Test Truck 2',
    truck_img_url: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1726&q=80',
    cuisine_type: 'mexican',
    departure_time: '09:30:00'
}

const itemData = {
    item_name: 'Test Item',
    item_description: 'This is a test item',
    item_photo_url: 'https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1726&q=80',
    item_price: 1.00
};

let token = '';
let truckId = '';
let truckId2 = '';
let itemId = '';

// Test Cases

describe('register and login', function() {
    it('should register as operator', function() {
        return request(server)
            .post('/api/auth/register')
            .send(operatorData)
            .then(res => {
                // 201 status
                expect(res.status).toBe(201);

                // success message
                expect(res.body.message).toBe('Registration successful');

                // userId
                expect(res.body.userId).toBeDefined();
            });
    });

    it('should login with the registered credentials', function() {
        return request(server)
            .post('/api/auth/login')
            .send(operatorData2)
            .then(res => {
                // 201 status
                expect(res.status).toBe(201);

                // success message
                expect(res.body.message).toBe('Successful Login');

                // user info
                expect(res.body.user).toBeDefined();
                
                // get token
                token = res.body.token;
                expect(token).toBeDefined();
            });
    });
});

describe('POST /', function() {
    it('add trucks to the operator - truck 1', function() {
        return request(server)
            .post('/api/operator/')
            .send(truckData)
            .set('authorization', token)
            .then(res => {
                // status 201
                expect(res.status).toBe(201);

                // success message
                expect(res.body.message).toBe('truck has been added');
            });
    });
    it('add trucks to the operator - truck 2', function() {
        return request(server)
            .post('/api/operator/')
            .send(truckData2)
            .set('authorization', token)
            .then(res => {
                // status 201
                expect(res.status).toBe(201);

                // success message
                expect(res.body.message).toBe('truck has been added');
            });
    });
    it('should throw error when truck is already registered', function() {
        return request(server)
            .post('/api/operator/')
            .send(truckData)
            .set('authorization', token)
            .then(res => {
                // status 400
                expect(res.status).toBe(400);

                // error message
                expect(res.body.error).toContain('already exists');
            });
    });
    it('should throw error when truck name is missing', function() {
        return request(server)
            .post('/api/operator/')
            .send({...truckData, truck_name: ''})
            .set('authorization', token)
            .then(res => {
                // status 400
                expect(res.status).toBe(400);

                // error message
                expect(res.body.error).toBe('Please provide truck_name, cuisine_type and departure_time')
            });
    });
    it('should throw error when cuisine_type is missing', function() {
        return request(server)
            .post('/api/operator/')
            .send({...truckData, cuisine_type: ''})
            .set('authorization', token)
            .then(res => {
                // status 400
                expect(res.status).toBe(400);

                // error message
                expect(res.body.error).toBe('Please provide truck_name, cuisine_type and departure_time')
            });
    });
    it('should throw error when departure_time is missing', function() {
        return request(server)
            .post('/api/operator/')
            .send({...truckData, departure_time: ''})
            .set('authorization', token)
            .then(res => {
                // status 400
                expect(res.status).toBe(400);

                // error message
                expect(res.body.error).toBe('Please provide truck_name, cuisine_type and departure_time')
            });
    });
    it('should throw error when token is invalid', function() {
        return request(server)
            .post('/api/operator/')
            .send(truckData)
            .set('authorization', 'XYZ')
            .then(res => {
                // status 401
                expect(res.status).toBe(401);

                // error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('GET /', function() {
    it('should successfully get the trucks registered with the operator', function() {
        return request(server)
            .get('/api/operator/')
            .set('authorization', token)
            .then(res => {
                // status 200
                expect(res.status).toBe(200);

                // should have a list of trucks
                expect(res.body.trucks).toBeDefined();

                // get truckId
                truckId = res.body.trucks[0].id;
                truckId2 = res.body.trucks[1].id;
            });
    });
    it('should throw an error when token is invalid', function() {
        return request(server)
            .get('/api/operator/')
            .set('authorization', 'XYZ')
            .then(res => {
                // status 401
                expect(res.status).toBe(401);

                // error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('GET /:truckId', function() {
    it('should get the truck info registered under the user', function() {
        return request(server)
            .get(`/api/operator/${truckId}`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 200
                expect(status).toBe(200);

                // truck info
                expect(body.truck).toBeDefined();

                // truck name
                expect(body.truck.truck_name).toBe(truckData.truck_name);
            });
    });
    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .get(`/api/operator/354`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
    it('should throw an error when invalid token', function() {
        return request(server)
            .get(`/api/operator/${truckId}`)
            .set('authorization', 'XYZ')
            .then(({status, body}) => {
                // status 401
                expect(status).toBe(401);

                // error message
                expect(body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('PUT /truckId', function() {
    it('should be able to edit truck name', function() {
        return request(server)
            .put(`/api/operator/${truckId2}`)
            .send({truck_name: "Name Changed for Test"})
            .set('authorization', token)
            .then(({status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success messsage
                expect(body.message).toBe('truck has been updated');
            });
    });
    it('should be able to edit truck info', function() {
        return request(server)
            .put(`/api/operator/${truckId2}`)
            .send({truck_name: "Name Changed Again for Test", cuisine_type: "Indian"})
            .set('authorization', token)
            .then(({status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success messsage
                expect(body.message).toBe('truck has been updated');
            });
    });
    it('should throw an error when no update is given', function() {
        return request(server)
            .put(`/api/operator/${truckId2}`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 400
                expect(status).toBe(400);

                // error messsage
                expect(body.error).toBe('Please provide some information to update');
            });
    });
    it('should throw an error when truck name already exists', function() {
        return request(server)
            .put(`/api/operator/${truckId2}`)
            .send({truck_name: truckData.truck_name})
            .set('authorization', token)
            .then(({status, body}) => {
                // status 401
                expect(status).toBe(401);

                // error messsage
                expect(body.error).toContain('already exists');
            });
    });
    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .put(`/api/operator/354`)
            .send({truck_name: 'Test'})
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
    it('should throw an error when invalid token', function() {
        return request(server)
            .put(`/api/operator/${truckId2}`)
            .send({truck_name: "Name Changed for Test"})
            .set('authorization', 'XYZ')
            .then(({status, body}) => {
                // status 401
                expect(status).toBe(401);

                // error message
                expect(body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('GET /truckId/ratings', function() {
    it('should return truck ratings', function() {
        return request(server)
            .get(`/api/operator/${truckId}/ratings`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 200
                expect(status).toBe(200);

                // success
                expect(body.ratings).toBeDefined();
            });
    });
    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .get(`/api/operator/3867/ratings`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
    it('should throw an error when invalid token', function() {
        return request(server)
            .get(`/api/operator/${truckId}/ratings`)
            .set('authorization', 'XYZ')
            .then(({status, body}) => {
                // status 401
                expect(status).toBe(401);

                // error message
                expect(body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('POST /truckId/items', function() {
    it('should successfully add items to the truck', function() {
        return request(server)
            .post(`/api/operator/${truckId}/items`)
            .send(itemData)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success
                expect(body.message).toBe('item created');
            });
    });
    it('should throw error when no info is provided', function() {
        return request(server)
            .post(`/api/operator/${truckId}/items`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 400
                expect(status).toBe(400);

                // error
                expect(body.error).toBe('Please provide item_name, item_description, item_price');
            });
    });
    it('should throw an error when truck doesnot belong to operator', function() {
        return request(server)
            .post(`/api/operator/1/items`)
            .send(itemData)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    })
    it('should throw error when truck ID is invalid', function() {
        return request(server)
            .post(`/api/operator/3489/items`)
            .send(itemData)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
});

describe('GET /truckId/items', function() {
    it('should get the items in the truck', function() {
        return request(server)
            .get(`/api/operator/${truckId}/items`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 
                expect(status).toBe(200)

                // success
                expect(body.items).toBeDefined();

                // should have item name
                expect(body.items[0].item_name).toBe(itemData.item_name);
                itemId = body.items[0].id;
            });
    });
    it('should throw an error when truckID is invalid', function() {
        return request(server)
            .get(`/api/operator/3489/items`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
});

describe('GET /truckId/items/itemId', function() {
    it('should return the item info', function() {
        return request(server)
            .get(`/api/operator/${truckId}/items/${itemId}`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 200
                expect(status).toBe(200);

                // item
                expect(body.items).toBeDefined();

                // item name check
                expect(body.items.item_name).toBe(itemData.item_name);
            });
    });
    it('should throw an error when item id is invalid', function() {
        return request(server)
            .get(`/api/operator/${truckId}/items/457`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Item ID');
            });
    });
    it('should return the error when truck ID is invalid', function() {
        return request(server)
            .get(`/api/operator/456/items/${itemId}`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
});

describe('PUT /truckId/items/itemId', function() {
    it('should change the item name successfully', function() {
        return request(server)
            .put(`/api/operator/${truckId}/items/${itemId
            }`)
            .send({item_name: 'New Item Name'})
            .set('authorization', token)
            .then(({ status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success
                expect(body.message).toBe('item updated');
            });
    });
    it('should return an error when nothing to update', function() {
        return request(server)
            .put(`/api/operator/${truckId}/items/${itemId
            }`)
            .set('authorization', token)
            .then(({ status, body}) => {
                // status 400
                expect(status).toBe(400);

                // error
                expect(body.error).toBe('Please provide something to update');
            });
    });
    it('should throw an error when item id is invalid', function() {
        return request(server)
            .put(`/api/operator/${truckId}/items/567`)
            .send({item_name: 'New Item Name'})
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Item ID');
            });
    });
    it('should return the error when truck ID is invalid', function() {
        return request(server)
            .put(`/api/operator/567/items/${itemId
            }`)
            .send({item_name: 'New Item Name'})
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
});


describe('DELETE /truckId/items/itemID', function() {
    it('should delete the item', function() {
        return request(server)
            .delete(`/api/operator/${truckId}/items/${itemId
            }`)
            .set('authorization', token)
            .then(({ status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success
                expect(body.message).toBe('item successfully deleted');
            });
    });
    it('should throw an error when item id is invalid', function() {
        return request(server)
            .delete(`/api/operator/${truckId}/items/457`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Item ID');
            });
    });
    it('should return the error when truck ID is invalid', function() {
        return request(server)
            .delete(`/api/operator/456/items/${itemId}`)
            .set('authorization', token)
            .then(({ status, body }) => {
                // status 404
                expect(status).toBe(404);

                // error
                expect(body.error).toBe('Invalid Truck ID');
            });
    });

})

describe('DELETE /truckId', function() {
    it('should delete the truck successfully', function() {
        return request(server)
            .delete(`/api/operator/${truckId2}`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 201
                expect(status).toBe(201);

                // success message
                expect(body.message).toBe('truck successfully deleted');
            })
    });
    it('should throw an error when truck ID is invalid', function() {
        return request(server)
            .delete(`/api/operator/3867`)
            .set('authorization', token)
            .then(({status, body}) => {
                // status 404
                expect(status).toBe(404);

                // error message
                expect(body.error).toBe('Invalid Truck ID');
            });
    });
    it('should throw an error when invalid token', function() {
        return request(server)
            .delete(`/api/operator/${truckId2}`)
            .set('authorization', 'XYZ')
            .then(({status, body}) => {
                // status 401
                expect(status).toBe(401);

                // error message
                expect(body.message).toBe('Something is wrong with your token');
            });
    });
})
describe('delete the test operator', function() {
    it('should successfully delete the operator account', async function() {
        return request(server)
                .delete('/api/auth/account')
                .set('authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                });
    });
})