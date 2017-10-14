'use strict';

// npm modules
const Router = require('express');
const jsonParser = require('body-parser').json();

// app modules
const User = require('../model/user.js');
const errorHandler = require('../lib/error-middleware.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const cookieAuth = require('../lib/cookie-auth-middleware.js');

// module logic
const userRouter = (module.exports = new Router());
const daysToMilliseconds = days => days * 1000 * 60 * 60 * 24;

// /api/signup
userRouter.post('/api/userSignup', jsonParser, (req, res, next) => {
  console.log('---Hit POST /api/userSignup---');
  User.create(req.body)
    .then(token => {
      res.cookie('X-IBCF-Token', token);
      res.send(token);
    })
    .catch(next);
});

userRouter.get('/api/userLogin', basicAuth, (req, res, next) => {
  console.log('---Hit GET /api/userSignin---');
  req.user
    .tokenCreate()
    .then(token => {
      res.cookie('X-IBCF-Token', token);
      res.send(token);
    })
    .catch(next);
});

userRouter.put('/api/userUpdate', cookieAuth, jsonParser, (req,res,next) => {
  console.log('---Hit PUT /api/userUpdate---');
  console.log('PUT req.user:\n', req.user);
  console.log('PUT req.body:\n', req.body);
  let options = {
    runValidators: true,
    new: true,
  };
  User.findByIdAndUpdate(req.user._id, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

userRouter.get('/api/500test', (req, res, next) => {
  console.log('Hit /api/500test');
  return errorHandler(new Error('fake-error'), req, res, next);
});
