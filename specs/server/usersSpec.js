process.env.NODE_ENV = 'test'; // disable morgan

var expect = require('chai').expect,
    request = require('supertest'),
    testData = require('./testData.js'),
    User = require('../../server/api/users/userModel.js'),

    server = require('../../server/server.js'),
    route = '/api/users';
    


/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * *        USERS ROUTES         * * * * */
/* * * * *        /api/users           * * * * */
/* * * * *        /api/signup          * * * * */
/* * * * *        /api/login           * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * */


describe('The users API', function() {
  var username = 'Bob';
  var password = 'c';


  /* * * * * * * * * * * * * * * * * * * * * 
   *            AUTHENTICATION             *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Authentication', function() {

    after(function (done) {

      User.findOne({username: username})
        .then(function (user) {
          user.remove();
          done();
        });

    });

    it('should create a new user', function (done) {

      request(server.app)
        .post('/api/signup')
        .send({username: username, password: password})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);

          User.findOne({username: username})
            .then(function (user) {

              expect(user).to.have.property('username', username);
              done();

            });
          
        });

    });

    it('should be able to log in', function (done) {

      request(server.app)
        .get('/api/login')
        .query({username: username, password: password})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          done();

        });

    });

  });


  /* * * * * * * * * * * * * * * * * * * * * 
   *           GET /api/users              *
   * * * * * * * * * * * * * * * * * * * * */

  describe('Fetching Users', function() {

    before(function(done) {
      testData.seedUsers(done);
    });

    after(function(done) {
      testData.clearUsers(done);
    });

    it('should retrieve a specifc user', function (done) {

      request(server.app)
        .get(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);
          done();

        });

    });

    it('should retrieve an array of users', function (done) {

      request(server.app)
        .get(route)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

          expect(res.body).to.be.an('array');
          expect(res.body).to.not.be.empty;
          expect(res.body).to.have.deep.property('[0].username');
          done();

        });

    });

    it('should delete a user', function (done) {

      request(server.app)
        .delete(route + '/' + username)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {

          expect(res.body).to.have.property('username', username);

          User.findOne({username: username})
            .then(function (user) {

              expect(user).to.be.null;
              done();

            });

        });

    });

  });

});