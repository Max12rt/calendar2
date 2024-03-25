const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const EventSchema = Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  id_calendar: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  type: {
    type: String,
    enum: ["meeting", "appointment", "birthday", "holiday"],
    //required: [true, "Type is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  start: {
    type: Date,
    required: [true, "Start date is required"],
  },
  end: {
    type: Date,
    required: [true, "End date is required"],
  },
  notes: {
    type: String,
  },
  creator_user_id: {
    type: String,
    required: [true, "User is required"],
  },
});

EventSchema.methods.toJSON = function () {
  const { __v, ...event } = this.toObject();
  return event;
};

module.exports = model("Event", EventSchema);
