const request = require('supertest');

const server = require('../../api/server.js');
const authModel = require('./auth-model.js');

const dinerData = {
    username: 'testDiner3', 
    password: '123', 
    email: 'test@test.com',
    user_type: 'diner',
    favorite_cuisine_type: 'italian'
}

const dinerData2 = {
    username: 'testDiner',
    password: '123'
}

const dinerData3 = {
    username:'testDiner23',
    password:'123'
}

let token = "";

describe('authRouter', function() {
    describe('register', function() {
        it('successful registration for Diner', function() {
            return request(server)
                .post('/api/auth/register')
                .send(dinerData)
                .then(async res => {
                    // should return the status 200
                    expect(res.status).toBe(201);

                    // should return the message - Registration Successful
                    expect(res.body.message).toBe('Registration successful');

                    // should return the userId
                    expect(res.body.userId).toBeDefined();

                    // should add the user to the db
                    const id = res.body.userId;
                    const dbCheck = await authModel.findBy({id});
                    expect(dbCheck).toBeTruthy();
                });
        });

        it('should throw an error when the user is already registered', function() {
            return request(server)
                .post('/api/auth/register')
                .send({...dinerData, username: 'testDiner'})
                .then(res => {
                    // should return the status 400
                    expect(res.status).toBe(400);
                    // should throw error message
                    expect(res.body.error).toContain('already exists');
                });
        });

        it('should throw an error when the username is missing', function() {
            return request(server)
                .post('/api/auth/register')
                .send({...dinerData, username: ''})
                .then(res => {
                    // should return the status 400
                    expect(res.status).toBe(400);
                    // should throw error message
                    expect(res.body.error).toBe('Please provide username, password, email and user_type to register');
                });
        });

        it('should throw an error when the password is missing', function() {
            return request(server)
                .post('/api/auth/register')
                .send({...dinerData, password: ''})
                .then(res => {
                    // should return the status 400
                    expect(res.status).toBe(400);
                    // should throw error message
                    expect(res.body.error).toBe('Please provide username, password, email and user_type to register');
                });
        });

        it('should throw an error when the email is missing', function() {
            return request(server)
                .post('/api/auth/register')
                .send({...dinerData, email: ''})
                .then(res => {
                    // should return the status 400
                    expect(res.status).toBe(400);
                    // should throw error message
                    expect(res.body.error).toBe('Please provide username, password, email and user_type to register');
                });
        });

        it('should throw an error when the user_type is missing', function() {
            return request(server)
                .post('/api/auth/register')
                .send({...dinerData, user_type: ''})
                .then(res => {
                    // should return the status 400
                    expect(res.status).toBe(400);
                    // should throw error message
                    expect(res.body.error).toBe('Please provide username, password, email and user_type to register');
                });
        });
    });

    describe('login', function () {
        it('successful login', function() {
            return request(server)
                .post('/api/auth/login')
                .send(dinerData2)
                .then(res => {
                    // should have a status 201
                    expect(res.status).toBe(201);

                    // should return a success message
                    expect(res.body.message).toBe('Successful Login');

                    // should have a token
                    expect(res.body.token).toBeDefined();
                })
        });
        it('should throw an error when username is not registered', function() {
            return request(server)
                .post('/api/auth/login')
                .send({...dinerData2, username: 'ABCXYZ'})
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);

                    // should return a error message
                    expect(res.body.message).toBe('User info does not exist or password is wrong');

                    // should not have a token
                    expect(res.body.token).toBeUndefined();
                });
        });
        it('should throw an error when username is missing', function() {
            return request(server)
                .post('/api/auth/login')
                .send({password: dinerData2.password})
                .then(res => {
                    // should have a status 400
                    expect(res.status).toBe(400);

                    // should return a error message
                    expect(res.body.error).toBe('Please provide username and password to login');

                    // should not have a token
                    expect(res.body.token).toBeUndefined();
                });
        });
        it('should throw an error when password is missing', function() {
            return request(server)
                .post('/api/auth/login')
                .send({username: dinerData2.username})
                .then(res => {
                    // should have a status 400
                    expect(res.status).toBe(400);

                    // should return a error message
                    expect(res.body.error).toBe('Please provide username and password to login');

                    // should not have a token
                    expect(res.body.token).toBeUndefined();
                });
        });
    });

    describe('account', function() {

        describe('get account', function() {
            it('should show account info when token is valid', async function() {
                const response = await request(server)
                    .post('/api/auth/login')
                    .send(dinerData2);
                token = response.body.token;
                return request(server)
                .get('/api/auth/account')
                .set('authorization', token)
                .then(res => {
                    // should have a status 200
                    expect(res.status).toBe(200);

                    // should return the user info
                    expect(res.body.username).toBeDefined();
                    expect(res.body.password).toBe('******');
                    expect(res.body.email).toBeDefined();
                    expect(res.body.user_type).toBeDefined();

                });
            });
            it('should throw an error when token is invalid', function() {
                return request(server)
                .get('/api/auth/account')
                .set('authorization', 'XYZ')
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);

                    // should return a error message
                    expect(res.body.message).toBe('Something is wrong with your token');
                });
            });
            it('should throw an error when token is undefined', function() {
                return request(server)
                .get('/api/auth/account')
                .then(res => {
                    // should have a status 401
                    expect(res.status).toBe(401);

                    // should return a error message
                    expect(res.body.message).toBe('Please Sign in!');
                });
            });
        });

        describe('put account', function() {
            // it('should successfully update the username', async function() {
            //     const response = await request(server)
            //         .post('/api/auth/login')
            //         .send(dinerData3);
            //     token = response.body.token;
            //     return request(server)
            //         .put('/api/auth/account')
            //         .set('authorization', token)
            //         .send({username: 'newsABC'})
            //         .then(res => {
            //             // should have a status 200
            //             expect(res.status).toBe(200);

            //             // should return updated info
            //             expect(res.body.username).toBe('newsABC');
            //             expect(res.body.password).toBe('******');
            //             expect(res.body.email).toBeDefined();
            //             expect(res.body.user_type).toBeDefined();
            //         })
            // });
            it('should throw an error when token is invalid', async function() {
                const response = await request(server).post('/api/auth/login').send(dinerData2);
                token = response.body.token;
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
            it('should throw an error when no information is provided in request body', async function() {
                const response = await request(server).post('/api/auth/login').send(dinerData2);
                token = response.body.token;
                return request(server)
                    .put('/api/auth/account')
                    .set('authorization', token)
                    .then(res => {
                        // should have a status 401
                        expect(res.status).toBe(500);

                        // should return a error message
                        // expect(res.body.error).toBe('Please provide some information to update');
                    });
            });
            it('should throw an error when trying to update user_type', function() {
                return request(server)
                    .put('/api/auth/account')
                    .send({user_type:'operator'})
                    .set('authorization', token)
                    .then(res => {
                        // should have a status 401
                        expect(res.status).toBe(401);

                        // should return a error message
                        expect(res.body.error).toBe('User cannot change Account Type');
                    });
            });
        });
    });

    describe('delete', function() {
        it('should delete the account when token is valid', async function() {
            const response = await request(server).post('/api/auth/login').send({username: dinerData.username, password: dinerData.password});
            token = response.body.token;
            return request(server)
                .delete('/api/auth/account')
                .set('authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
        it('should throw an error when token is invalid', function() {
            return request(server)
                .delete('/api/auth/account')
                .set('authorization', 'XYZ')
                .then(res => {
                    expect(res.status).toBe(401);
                    expect(res.body.message).toBe('Something is wrong with your token');
                });
        });
    });
});