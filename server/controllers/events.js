const Event = require("../models/Event");

const getEvents = async (req, res) => {
    try {
        return res.json({
            ok: true,
        });
    } catch (error) { console.log(error);
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
        creator_user_id: req.id,
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
            id, {title, start, end, notes,}, { new: true });
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
    } catch (error) { console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "ErrorDeleteEvent",
        });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
