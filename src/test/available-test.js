'use strict';

require('dotenv').config();

const expect = require('expect');
const superagent = require('superagent');
const agent = superagent.agent();

const User = require('../model/user.js');
const clearDB = require('./lib/clear-db.js');
const server = require('./lib/test-server.js');

const TEST_API_URL = process.env.TEST_API_URL;

let newUser = {
  'username': 'test1',
  'password': 'pass1',
  'firstName': 'first',
  'lastName': 'last',
  'email': 'test1@hotmail.com',
};

let newAvailability = {
  date: new Date(2017,10,20),
  comment: 'This is a test comment.',
};

let updateAvailability = {
  comment: 'This is an update test comment.',
};

describe.only('Testing Available model', () => {
  before(server.start);
  before(clearDB);
  after(server.stop);
  after(clearDB);




  describe('Testing the /api/availability/createOne endpoint.', () => {
    before(clearDB);
    after(clearDB);

    it('should return a new availability object and 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then(res => {
              expect(res.body.fullName).toEqual(`${newUser.firstName} ${newUser.lastName}`);
              expect(res.body.firstName).toEqual(`${newUser.firstName}`);
              expect(res.body.lastName).toEqual(`${newUser.lastName}`);
              expect(res.body.email).toEqual(`${newUser.email}`);
              expect(res.body.comment).toEqual(`${newAvailability.comment}`);
              expect(res.body.ownerId).toExist();
              expect(res.body._id).toExist();
              expect(res.body.timeStamp).toExist();
              expect(res.body.date).toEqual(['2017-11-20T08:00:00.000Z']);
            });
        });
    });

    it('should return a 400 "validation failed" when no data is sent', () => {
      return agent.post(`${TEST_API_URL}/API/availability/createOne`)
        .send()
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });
  });





  describe('Testing the /api/availability/updateOne/:id endpoint.', () => {
    before(clearDB);
    after(clearDB);

    it('should return an updated availability object and 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then(() => {
              return agent.put(`/api/availability/updateOne/${res._id}`)
                .send(updateAvailability)
                .then(res => {
                  console.log(res.body);
                  expect(res.body).toEqual();
                });
            });
        });
    });
  });






});
