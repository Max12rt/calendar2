
const { Router } = require("express");
const router = Router();
const createCalendar = require('../controllers/calendar');
const UserCalendar = require('../models/UserCalendar');

router.post('/create', async (req, res) => {
    const { name, description, color, userId } = req.body;

    try {
        const { calendar, userCalendar } = await createCalendar({ name, description, color, userId });
        res.status(201).json({ calendar, userCalendar });
    } catch (error) {
        console.error("Error creating calendar:", error);
        res.status(500).json({ error: "Error creating calendar" });
    }
});

router.get('/calendars', async (req, res) => {
    const { userId } = req.query;
    try {
        const userCalendars = await UserCalendar.find({ id_user: userId });
        console.log(userCalendars);
        res.json(userCalendars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання календарів користувача' });
    }
});
router.get('/user-calendars', async (req, res) => {
    const { userId } = req.query;
    try {
        const userCalendars = await UserCalendar.find({ id_user: userId });
        console.log(userCalendars);
        res.json(userCalendars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання календарів користувача' });
    }
});


module.exports = router;
