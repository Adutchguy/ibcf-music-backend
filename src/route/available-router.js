'use strict';

// npm modules
const moment = require('moment');
const { Router } = require('express');
const jsonParser = require('body-parser').json();

// app modules
const Available = require('../model/available.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module logic
const availableRouter = (module.exports = new Router());

// /api/availability
availableRouter.post('/api/availability', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit POST /api/availability');
  new Available({
    title: req.body.title,
    allDay: req.body.allDay,
    start: req.body.start,
    end: req.body.end,
    eventType: req.body.eventType,
    tag: req.body.tag,
    notify: req.body.notify,
    ownerId: req.user._id.toString(),
  })
    .save()
    .then(available => {
      console.log('POST available req', req.body);
      console.log('POST available res', available);
      res.json(available);
    })
    .catch(next);
});

availableRouter.get('/api/availability/:id', (req, res, next) => {
  console.log('Hit GET /api/availability/:id');
  Available.findById(req.params.id).then(available => res.json(available)).catch(next);
});

availableRouter.get('/api/availability/', (req, res, next) => {
  Available.find({}).then(availability => res.json(availability)).catch(next);
});

availableRouter.put('/api/availability/:id', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit PUT /api/availability/:id');

  let options = {
    runValidators: true,
    new: true,
  };

  Available.findById(req.params.id)
    .then(available => {
      Available.findByIdAndUpdate(req.params.id, req.body, options)
        .then(available => {
          res.json(available);
        })
        .catch(next);
    })
    .catch(next);
});

availableRouter.delete('/api/availability/:id', bearerAuth, (req, res, next) => {
  console.log('Hit DELETE /api/availability/:id');
  Available.findById(req.params.id)
    .then(available => {
      if (req.user._id.toString() !== available.ownerId.toString()) {
        throw Error('Unauthorized - cannot change another users resource');
      }
      return available;
    })
    .then(available => {
      Available.findByIdAndRemove(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
    })
    .catch(next);
});
