'use strict';

require('dotenv').config();

const CryptoJS = require('crypto-js');
const expect = require('expect');
const superagent = require('superagent');
const agent = superagent.agent();
const server = require('./lib/test-server.js');

const User = require('../model/user.js');
const clearDB = require('./lib/clear-db.js');

const TEST_API_URL = process.env.TEST_API_URL;
const passwordHashCreate = function(password){
  return CryptoJS.AES.encrypt(password, process.env.APP_SECRET).toString();
};

describe('---Testing User model---', () => {
  before(server.start);
  after(server.stop);
  let data = {
    'username': 'test1',
    'password': passwordHashCreate('pass1'),
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test1@hotmail.com',
  };
  let data2 = {
    'username': 'test2',
    'password': passwordHashCreate('pass2'),
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test2@hotmail.com',
  };
  let extraData = {
    'extra': 'field',
    'username': 'test2',
    'password': passwordHashCreate('pass2'),
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test2@hotmail.com',
  };

  let missingPass = {
    'username': 'test2',
    'firstName': 'first',
    'lastName': 'last',
    'email': 'test2@hotmail.com',
  };






  describe('Testing POST /api/userSignup', () => {
    after(clearDB);

    it('should return a token and a 200 status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });

    it('should return a 400 "not in schema and strict mode is set to throw"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(extraData)
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });

    it('empty body should return 400 "data and salt arguments required"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(missingPass)
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });

    it('should return a 409 conflict status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .catch(err => {
          expect(err.status).toEqual(409);
        });
    });
  });





  describe('Testing GET /api/userLogin', () => {
    afterEach(clearDB);

    it('should return a cookie and a 200 status', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .auth('test1', passwordHashCreate('pass1'))
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
            .auth('test5', passwordHashCreate('pass0'))
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "unauthorized password does not match"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/userLogin`)
            .auth('test1', passwordHashCreate('badpass'))
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });






  describe('Testing GET /api/user', () => {
    afterEach(clearDB);

    it('should return user info and a 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return agent.get(`${TEST_API_URL}/api/user`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body._id).toExist();
              expect(res.body.username).toEqual(data.username);
              expect(res.body.firstName).toEqual(data.firstName);
              expect(res.body.lastName).toEqual(data.lastName);
              expect(res.body.email).toEqual(data.email);
            });
        });
    });

    it('should return a 401 "unauthorized not logged in, no cookie found"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/user`)
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "unauthorized no token found"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/user`)
            .set('Cookie', ['X-IBCF-Token='])
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });

    it('should return a 401 "invalid signature"', () => {
      return superagent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return superagent.get(`${TEST_API_URL}/api/user`)
            .set('Cookie', ['X-IBCF-Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJmNzQwZWVhMjE2MjgxNDYyY2Q1NDUyMmFlNDg0NDYyMDA2MjdlYjZmMDk2NWQ1MjIzNDMxOTBjNzIwNTkwNGI1IiwiaWF0IjoxNTA4NDQ0MDgyfQ.fs9YlsRFz3u_NlFzGk1B5liW5NhbIDZUJyh1eFLngfg'])
            .catch(err => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });






  describe('Testing GET /api/userFullName', () => {
    after(clearDB);

    it('should return user\'s full concatenated name and a 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return agent.get(`${TEST_API_URL}/api/userFullName`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body).toEqual(`${data.firstName} ${data.lastName}`);
            });
        });
    });

    it('should return a 401 "unauthorized not logged in, no cookie found"', () => {
      return superagent.get(`${TEST_API_URL}/api/userFullName`)
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "unauthorized no token found"', () => {
      return superagent.get(`${TEST_API_URL}/api/userFullName`)
        .set('Cookie', ['X-IBCF-Token='])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "invalid signature"', () => {
      return superagent.get(`${TEST_API_URL}/api/userFullName`)
        .set('Cookie', ['X-IBCF-Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJmNzQwZWVhMjE2MjgxNDYyY2Q1NDUyMmFlNDg0NDYyMDA2MjdlYjZmMDk2NWQ1MjIzNDMxOTBjNzIwNTkwNGI1IiwiaWF0IjoxNTA4NDQ0MDgyfQ.fs9YlsRFz3u_NlFzGk1B5liW5NhbIDZUJyh1eFLngfg'])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });
  });





  describe('Testing PUT /api/userUpdate', () => {
    let updatedData = {
      firstName: 'updatedFN',
      lastName: 'updatedLN',
    };
    after(clearDB);

    it('should return user\'s updated profile data 200 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return agent.put(`${TEST_API_URL}/api/userUpdate`)
            .send(updatedData)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body._id).toExist();
              expect(res.body.username).toEqual(data.username);
              expect(res.body.firstName).toEqual(updatedData.firstName);
              expect(res.body.lastName).toEqual(updatedData.lastName);
              expect(res.body.email).toEqual(data.email);
            });
        });
    });

    it('should return a 400 "validation failed"', () => {
      return agent.put(`${TEST_API_URL}/api/userUpdate`)
        .send({firstName: 546})
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });

    it('should return a 401 "unauthorized not logged in, no cookie found"', () => {
      return superagent.put(`${TEST_API_URL}/api/userUpdate`)
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "unauthorized no token found"', () => {
      return superagent.put(`${TEST_API_URL}/api/userUpdate`)
        .set('Cookie', ['X-IBCF-Token='])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "invalid signature"', () => {
      return superagent.put(`${TEST_API_URL}/api/userUpdate`)
        .set('Cookie', ['X-IBCF-Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJmNzQwZWVhMjE2MjgxNDYyY2Q1NDUyMmFlNDg0NDYyMDA2MjdlYjZmMDk2NWQ1MjIzNDMxOTBjNzIwNTkwNGI1IiwiaWF0IjoxNTA4NDQ0MDgyfQ.fs9YlsRFz3u_NlFzGk1B5liW5NhbIDZUJyh1eFLngfg'])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });
  });




  describe('Testing DELETE /api/userDelete', () => {
    after(clearDB);

    it('should delete user\'s profile data and return 204 status', () => {
      return agent.post(`${TEST_API_URL}/api/userSignup`)
        .send(data)
        .then(() => {
          return agent.delete(`${TEST_API_URL}/api/userDelete`)
            .then(res => {
              expect(res.status).toEqual(204);
            });
        });
    });

    it('should return a 401 "unauthorized not logged in, no cookie found"', () => {
      return superagent.delete(`${TEST_API_URL}/api/userDelete`)
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "unauthorized no token found"', () => {
      return superagent.delete(`${TEST_API_URL}/api/userDelete`)
        .set('Cookie', ['X-IBCF-Token='])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should return a 401 "invalid signature"', () => {
      return superagent.delete(`${TEST_API_URL}/api/userDelete`)
        .set('Cookie', ['X-IBCF-Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJmNzQwZWVhMjE2MjgxNDYyY2Q1NDUyMmFlNDg0NDYyMDA2MjdlYjZmMDk2NWQ1MjIzNDMxOTBjNzIwNTkwNGI1IiwiaWF0IjoxNTA4NDQ0MDgyfQ.fs9YlsRFz3u_NlFzGk1B5liW5NhbIDZUJyh1eFLngfg'])
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });
  });


}); // close final describe block
