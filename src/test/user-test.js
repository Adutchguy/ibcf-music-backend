'use strict';

require('dotenv').config();

const expect = require('expect');
const superagent = require('superagent');
const server = require('./lib/test-server.js');

const User = require('../model/user.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');

const TEST_API_URL = process.env.TEST_API_URL;

describe('---Testing User model---', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);
  let data = {
    'username': 'test1',
    'password': 'pass1',
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test1@hotmail.com',
  };





  describe('Testing POST /api/userSignup', () => {

    it('should return a token and a 200 status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });

    it('should return a 409 conflict status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.post(`${TEST_API_URL}/api/userSignup`)
            .send(data)
            .catch(err => {
              expect(err.status).toEqual(409);
            });
        });
    });

    it('empty body should return 400 bad request', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send()
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });
  });





  describe('Testing GET /api/userLogin', () => {

    it('should return a cookie and a 200 status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then((response) => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .auth('test1', 'pass1')
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.text).toExist();
              expect(res.header['set-cookie']).toEqual([`X-IBCF-Token=${res.text}; Path=/`]);
            });
        });
    });

    it('should return a 401 "unauthorized, no authorization provided"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "unauthorized, username or password is missing, please try again"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .auth('test1')
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "unauthorized, no basic authorization provided"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .set('Authorization', 'Basic')
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "unauthorized, user does not exist"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .auth('test5', 'pass0')
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });


}); // close final describe block
