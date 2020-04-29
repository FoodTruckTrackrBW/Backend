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

// describe('Truck Menu', function() {
//     it('successfully shows the item list with prices for selected truck', function() {
//         return request(server)
//             .get('/api/diner/1/menu')
//             .set('authorization', token)
//             .then(res => {
//                 // should return the status 200
//                 expect(res.status).toBe(200);

//                 // should return the list of items
//                 expect(res.body.menu).toBeDefined();
//             });
//     });
//     it('should not show item list for other trucks', function() {
//         return request(server)
//             .get('/api/diner/1/menu')
//             .set('authorization', token)
//             .then(async res => {
//                 // should return the status 200
//                 expect(res.status).toBe(200);

//                 // should return the list of items only from truck_id = 1
//                 const truckIdMatch = true;
//                 await res.body.menu.map(i => {
//                     if(i.truck_id != 1) {
//                         truckIdMatch = false;
//                     }
//                 })
//                 expect(truckIdMatch).toBeTruthy();
//             })
//     });
//     it('should throw an error when truck ID is invalid', function() {
//         return request(server)
//             .get('/api/diner/102/menu')
//             .set('authorization', token)
//             .then(async res => {
//                 // should return the status 200
//                 expect(res.status).toBe(404);

//                 // should return the error
//                 expect(res.body.error).toBe('Invalid Truck ID');
//             })
//     });
//     it('throws an error when token is invalid', function() {
//         return request(server)
//             .get('/api/diner/1/menu')
//             .set('authorization', 'XYZ')
//             .then(res => {
//                 // should have a status 401
//                 expect(res.status).toBe(401);

//                 // should return a error message
//                 expect(res.body.message).toBe('Something is wrong with your token');
//             });
//     });
// });

describe('Visited Trucks', function() {
    it.todo('should return the list of visited trucks when token is valid');
    it('throws an error when token is invalid', function() {
        return request(server)
            .put('/api/auth/account')
            .send({username: 'XYZ'})
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
    it.todo('should successfully check in the truck under visited list for user');
    it.todo('should throw an error when truck ID is invalid');
    it('throws an error when token is invalid', function() {
        return request(server)
            .put('/api/auth/account')
            .send({username: 'XYZ'})
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
    it.todo('should throw an error when update is not given');

    describe('Mark favorite', function() {
        it.todo('should mark the truck as favorite');
        it.todo('should throw an error when truck id is invalid');
        it('throws an error when token is invalid', function() {
            return request(server)
                .put('/api/auth/account')
                .send({username: 'XYZ'})
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
        it.todo('should update the rating for the truck');
        it.todo('should throw an error when rating is invalid');
        it.todo('should throw an error when truck id is invalid');
        it('throws an error when token is invalid', function() {
            return request(server)
                .put('/api/auth/account')
                .send({username: 'XYZ'})
                .set('authorization', 'XYZ')
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);
    
                    // should return a error message
                    expect(res.body.message).toBe('Something is wrong with your token');
                });
        });
    });
});

describe('Rate Items', function() {
    it.todo('should successfully update the item rating');
    it.todo('should throw an error when rating is invalid');
    it.todo('should throw an error when truck Id is invalid');
    it.todo('should throw an error when item id is invalid');
    it('throws an error when token is invalid', function() {
        return request(server)
            .put('/api/auth/account')
            .send({username: 'XYZ'})
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
    it.todo('should return a list of trucks under 10 mile radius when no radius given');
    it.todo('should return a list of trucks within x mile radius');
    it('throws an error when token is invalid', function() {
        return request(server)
            .put('/api/auth/account')
            .send({username: 'XYZ'})
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
});

describe('Trucks by Cuisine', function() {
    it.todo('should return trucks with cuisine type as diner favorite cuisine when cuisine is undefined');
    it.todo('should return trucks with given cuisine');
    it.todo('should have length 0 when cuisine is not found');
    it('throws an error when token is invalid', function() {
        return request(server)
            .put('/api/auth/account')
            .send({username: 'XYZ'})
            .set('authorization', 'XYZ')
            .then(res => {
                // should have a status 401
                expect(res.status).toBe(401);

                // should return a error message
                expect(res.body.message).toBe('Something is wrong with your token');
            });
    });
})
