'use strict';

// npm modules
const moment = require('moment');
const { Router } = require('express');
const jsonParser = require('body-parser').json();

// app modules
const Available = require('../model/available.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const cookieAuth = require('../lib/cookie-auth-middleware.js');

// module logic
const availableRouter = (module.exports = new Router());






availableRouter.get('/api/availability', (req, res, next) => {
  console.log('---Hit GET /api/availability---');
  Available.find({})
    .then(available => res.json(available))
    .catch(next);
});

availableRouter.post('/api/availability/createOne', cookieAuth, jsonParser, (req, res, next) => {
  console.log('---Hit POST /api/availability/createOne---');
  new Available({
    fullName: req.user.fullName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    date: req.body.date,
    email: req.user.email,
    comment: req.body.comment,
    ownerId: req.user._id,
  })
    .save()
    .then(available => {
      res.json(available);
    })
    .catch(next);
});



availableRouter.put('/api/availability/updateOne/:id', cookieAuth, jsonParser, (req, res, next) => {
  console.log('---Hit PUT /api/availability/updateOne/:id---');

  if(!req.body.date && !req.body.comment)
    return next(new Error('no data sent with the update request, can not perform update.'));

  let options = {
    runValidators: true,
    new: true,
  };
  Available.findById(req.params.id)
    .then(data => {
      if(req.user._id.toString() !== data.ownerId.toString()) {
        throw Error('Unauthorized - cannot change another users resource.');
      } else {
        return data;
      }
    })
    .then(data => {
      Available.findByIdAndUpdate(req.params.id, req.body, options)
        .then(available => {
          res.json(available);
        })
        .catch(next);
    })
    .catch(next);
});

availableRouter.delete('/api/availability/deleteOne/:id', cookieAuth, (req, res, next) => {
  console.log('Hit DELETE /api/availability/deleteOne/:id');
  Available.findById(req.params.id)
    .then(data => {
      if (req.user._id.toString() !== data.ownerId.toString()) {
        throw Error('Unauthorized - cannot delete another users resource');
      }
      return;
    })
    .then(() => {
      Available.findByIdAndRemove(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
    })
    .catch(next);
});
