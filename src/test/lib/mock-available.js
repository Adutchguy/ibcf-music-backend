'use strict';

const faker = require('faker');
const Available = require('../../model/available.js');
const mockUser = require('./mock-user.js');

const mockAvailable = module.exports = {};

mockAvailable.createOne = () => {
  let result = {};
  return mockUser.createOne()
    .then(userData => {
      result = userData;
      return new Available({
        title: 'mock-available',
        start: 'Wed Aug 16 2017 17:03:41 GMT-0700 (PDT)',
        end: 'Wed Aug 16 2017 19:03:41 GMT-0700 (PDT)',
        eventType: 'appointment',
        ownerId: userData.user._id,
      })
        .save();
    })
    .then(available => {
      result.available = available;
      return result;
    });
};
