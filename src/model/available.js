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
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: [Date],
    required: true,
  },
  email: {
    type: String,
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
    unique: true,
  },
},{strict: 'throw'});

module.exports = mongoose.model('availableDate', availableSchema);
