'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const availableSchema = new Schema({
  fullName: {
    type:String,
    required: true,
    ref: 'user.fullName',
  },
  title: {
    type: String,
    required: true,
  },
  allDay: {
    type: Boolean,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId, required: true,
    ref: 'user',
  },
});

module.exports = mongoose.model('availableDate', availableSchema);
