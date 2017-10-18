'use strict';

require('dotenv').config();

const expect = require('expect');
const superagent = require('superagent');
const server = require('./lib/test-server.js');

const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');

const TEST_API_URL = process.env.TEST_API_URL;

describe('Testing User model', () => {
  before(server.start);
  after(server.stop);
  // afterEach(clearDB);

  let data = {
    'username': 'test1',
    'password': 'pass1',
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test1@hotmail.com',
  };

  describe('Testing POST', () => {
    it('should return a token and a 200 status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
          done();
        });
    });
  });
}); // close final describe block
