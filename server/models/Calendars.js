const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const CalendarsSchema = new Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description:{
        type: String,
        required: [true, "description is needed"],
    }
});

CalendarsSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
};

module.exports = model("Calendars", CalendarsSchema);
