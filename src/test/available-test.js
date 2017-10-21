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

let newUser2 = {
  'username': 'test2',
  'password': 'pass2',
  'firstName': 'Ronald',
  'lastName': 'McDonald',
  'email': 'test2@hotmail.com',
};

let newAvailability = {
  date: [new Date(2017,10,20)],
  comment: 'This is a test comment.',
};

let updateAvailability = {
  comment: 'This is an update test comment.',
  date: [new Date(2017,2,1)],
};




describe('Testing Available model', () => {
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
            .then(() => {
              return agent.post(`${TEST_API_URL}/API/availability/createOne`)
                .send(updateAvailability)
                .then(() => {
                  return agent.get(`${TEST_API_URL}/API/availability`)
                    .then(res => {
                      expect(res.body.length).toEqual(2);
                      clearDB();
                    });
                });
            });
        });
    });

    it('should return a 404 "validation failed" when no data exists', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability`)
            .catch(err => {
              expect(err.status).toEqual(404);
            });
        });
    });
  });





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
            .then((res) => {
              return agent.put(`${TEST_API_URL}/api/availability/updateOne/${res.body._id}`)
                .send(updateAvailability)
                .then((res) => {
                  expect(res.status).toEqual(200);
                  expect(res.body.comment).toEqual(updateAvailability.comment);
                  expect(res.body.date).toEqual(['2017-03-01T08:00:00.000Z']);
                  clearDB();
                });
            });
        });
    });

    it('should return a 401 "Unauthorized - cannot change another users resource."', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then((response) => {
              return agent.post(`${TEST_API_URL}/API/userSignup`)
                .send(newUser2)
                .then(() => {
                  return agent.put(`${TEST_API_URL}/API/availability/updateOne/${response.body._id}`)
                    .send(updateAvailability)
                    .catch(err => {
                      expect(err.status).toEqual(401);
                      clearDB();
                    });
                });
            });
        });
    });

    it('should return an updated availability object and 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then((res) => {
              return agent.put(`${TEST_API_URL}/api/availability/updateOne/${res.body._id}`)
                .catch((err) => {
                  expect(err.status).toEqual(400);
                });
            });
        });
    });
  });





  describe('Testing the /api/availability/deleteOne/:id endpoint.', () => {
    before(clearDB);
    after(clearDB);

    it('should return an updated availability object and 200 status.', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then((res) => {
              return agent.delete(`${TEST_API_URL}/api/availability/deleteOne/${res.body._id}`)
                .then((res) => {
                  expect(res.status).toEqual(204);
                  clearDB();
                });
            });
        });
    });

    it('should return a 401 "Unauthorized - cannot change another users resource."', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then((response) => {
              return agent.post(`${TEST_API_URL}/API/userSignup`)
                .send(newUser2)
                .then(() => {
                  return agent.delete(`${TEST_API_URL}/API/availability/deleteOne/${response.body._id}`)
                    .send(updateAvailability)
                    .catch(err => {
                      expect(err.status).toEqual(401);
                      clearDB();
                    });
                });
            });
        });
    });

    it('should return a 404 not found status if no _id parameter is sent.', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(newUser)
        .then(() => {
          return agent.post(`${TEST_API_URL}/API/availability/createOne`)
            .send(newAvailability)
            .then((res) => {
              return agent.delete(`${TEST_API_URL}/api/availability/deleteOne`)
                .catch((err) => {
                  expect(err.status).toEqual(404);
                  clearDB();
                });
            });
        });
    });
  });






});
