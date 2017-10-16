'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const availableSchema = new Schema({
  fullName: {
    type:String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: [Date],
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  timeStamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('availableDate', availableSchema);
