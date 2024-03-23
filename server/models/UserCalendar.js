const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const UserCalendarSchema = new Schema({
    id_user: {
        type: String,
        default: uuidv4,
        //unique: true,
    },
    id_calendar: {
        type: String,
        default: uuidv4,
        //unique: true,
    },
    isMain:{
        type: Boolean
    },
    isCreate:{
        type: Boolean
    },
    isEdit:{
        type: Boolean
    },
    isAccess:{
        type: Boolean
    },
    isDelete:{
        type: Boolean
    },
    color:{
        type: String
    },

});

UserCalendarSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
};

module.exports = model("UserCalendar", UserCalendarSchema);
