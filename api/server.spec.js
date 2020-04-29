const request = require('supertest');
const server = require('./server.js');


const dinerData = {
    username: 'testDiner1', 
    password: '123', 
    email: 'test@test.com',
    user_type: 'diner',
    favorite_cuisine_type: 'italian'
}
describe('server.js', function() {
    describe('GET /', function() {
        it('should return 200 OK', function() {
            return request(server)
                .get('/')
                .expect(200);
        });
        it('should return JSON', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                })
        });
        it('should respond with {api: "up"}', function() {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.body.message).toBe("server up");
                })
        });
    });
})