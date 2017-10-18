'use strict';

require('dotenv').config();

const expect = require('expect');
const superagent = require('superagent');

// const db = require('./lib/db.js');
const server = require(`./lib/test-server.js`);

const TEST_API_URL = process.env.TEST_API_URL;

describe('testing server', () => {
  before(server.start);
  after(server.stop);
  describe('Testing Server', () => {
    it('should return 404 for non-existent route', () => {
      return superagent.get(`${TEST_API_URL}/api/not-a-route`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
    it('should throw an error if server already DOWN', () => {
      server.isOn = false;
      return server.stop().catch(err => {
        expect(err).toEqual('Error: server is not running');
      });
    });
    it('should throw an error if server already on', () => {
      server.isOn = true;
      return server.start().catch(err => {
        expect(err).toEqual('Error: server is already running');
      });
    });
  });
});

describe('testing error-handler 500 response', () => {
  before(server.start);
  after(server.stop);
  describe('Testing Error-Handler', () => {
    it('should return 500 for server error', done => {
      superagent.get(`${TEST_API_URL}/api/500test`).catch((err, res) => {
        expect(err.status).toEqual(500);
        done();
      });
    });
  });
});
