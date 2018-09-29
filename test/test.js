var request = require('supertest');
var assert = require('assert');

describe('testing listenup application', function () {
    var server;
    beforeEach(function () {
        server = require('../src/index');
    });
    afterEach(function () {
        server.close();
    });
    it('responds to /', function (done) {
        request(server)
            .get('/')
            .expect(200,done);
    });
    it('404 everything else', function (done) {
        request(server)
            .get('/foo/bar')
            .expect(404,done);
    });
    it('responds to /users', function() {
        return request(server)
            .get('/users')
            .expect(200)
            .then(response => {
                assert(response.body.length, 50)
            })
    });
    it('responds to /users with valid id', function (done) {
        request(server)
            .get('/users/ada_vang')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('responds to /users with invalid id', function (done) {
        request(server)
            .get('/users/george')
            .set('Accept', 'application/json')
            .expect(404,done);
    });
});