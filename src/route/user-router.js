'use strict';

require('dotenv').config();
const Router = require('express');
const jsonParser = require('body-parser').json();

const CryptoJS = require('crypto-js');
const User = require('../model/user.js');
const errorHandler = require('../lib/error-middleware.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const cookieAuth = require('../lib/cookie-auth-middleware.js');

// module logic
const userRouter = (module.exports = new Router());
const daysToMilliseconds = days => days * 1000 * 60 * 60 * 24;

const passwordUnHash = function(hash){
  let bytes = CryptoJS.AES.decrypt(hash.toString(), process.env.APP_SECRET);
  let password = bytes.toString(CryptoJS.enc.Utf8);
  return password;
};
// Tested
userRouter.post('/api/userSignup', jsonParser, (req, res, next) => {
  console.log('---Hit POST /api/userSignup---');
  req.body.password = passwordUnHash(req.body.password);
  User.create(req.body)
    .then(token => {
      res.cookie('X-IBCF-Token', token);
      res.send(token);
    })
    .catch(next);
});

// Tested
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

// Tested
userRouter.get('/api/user', cookieAuth, (req,res,next) => {
  console.log('---Hit PUT /api/user---');
  User.findById(req.user._id, {'username': 1, 'firstName': 1, 'lastName': 1, 'email': 1})
    .then(data => res.json(data))
    .catch(next);
});

// Tested
userRouter.get('/api/userFullName', cookieAuth, (req,res,next) => {
  console.log('---Hit PUT /api/userFullName---');
  User.findById(req.user._id)
    .then(data => res.json(data.fullName))
    .catch(next);
});

// Testing
userRouter.put('/api/userUpdate', cookieAuth, jsonParser, (req,res,next) => {
  console.log('---Hit PUT /api/userUpdate---');
  let options = {
    runValidators: true,
    new: true,
    fields: {'username': 1, 'firstName': 1, 'lastName': 1, 'email': 1},
  };
  User.findOneAndUpdate({_id: req.user._id}, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

userRouter.delete('/api/userDelete', cookieAuth, (req,res,next) => {
  console.log('---Hit DELETE /api/userDelete---');
  User.findByIdAndRemove(req.user._id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

userRouter.get('/api/500test', (req, res, next) => {
  console.log('Hit /api/500test');
  return errorHandler(new Error('fake-error'), req, res, next);
});
