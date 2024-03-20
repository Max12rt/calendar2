const mongoose = require('mongoose');
const Event = require("../models/Event");
const User = require("../models/User");

const getUserById = async (userId) => {
    try {
        console.log("1" + " " +userId);
        const user = await User.findOne({ id: userId });
        console.log("2" + " " + user);
        return user;
    } catch (error) {
        console.log(error);
        throw new Error("Error finding user by id");
    }
};

const getEvents = async (req, res) => {
    try {
        console.log("3" + " " +req.id);
        const user = await getUserById(req.id);
        if (!user || !user.id) {
            return res.status(404).json({
                ok: false,
                msg: "User not found",
            });
        }
        console.log("4" + " " +user.id);
        const events = await Event.find({ user });
        console.log("4" + " " +events);
        return res.json({
            ok: true,
            events,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "EventError",
        });
    }
};

const createEvent = async (req, res) => {
    const { id_calendar, title, start, end, notes } = req.body;
    const event = new Event({
        id_calendar,
        title,
        start,
        end,
        notes,
        creator_user_id: req.params.id_user,
    });
    try {
        await event.save();
        return res.status(201).json({
            ok: true,
            event,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "CreateEventError",
        });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, start, end, notes } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(
            id, { title, start, end, notes }, { new: true }
        );
        return res.json({ ok: true, event });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "ErrorEventUpdate",
        });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByIdAndDelete(id);
        return res.json({
            ok: true,
            event,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "ErrorDeleteEvent",
        });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
