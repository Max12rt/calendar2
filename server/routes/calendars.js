// calendar.js

const { Router } = require("express");
const router = Router();
const createCalendar = require('../controllers/calendar');
const UserCalendar = require('../models/UserCalendar');
const Calendar = require('../models/Calendars');

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

router.put("/:calendarId/color", async (req, res) => {
    const { color } = req.body;
    const { calendarId } = req.params;
    try {
        const updatedCalendar = await UserCalendar.findOneAndUpdate(
            { id_calendar: calendarId },
            { color },
            { new: true }
        );
        console.log("/:calendarId/color " + updatedCalendar);
        res.json(updatedCalendar);
    } catch (error) {
        console.error("Error updating calendar color:", error);
        res.status(500).json({ error: "Failed to update calendar color" });
    }
});

router.put("/:calendarId/name", async (req, res) => {
    const { name } = req.body;
    const { calendarId } = req.params;
    try {
        const updatedCalendar = await Calendar.findByIdAndUpdate(
            calendarId,
            { name },
            { new: true }
        );
        console.log("/:calendarId/name " + updatedCalendar);
        res.json(updatedCalendar);
    } catch (error) {
        console.error("Error updating calendar name:", error);
        res.status(500).json({ error: "Failed to update calendar name" });
    }
});

router.delete("/:calendarId", async (req, res) => {
    const { calendarId } = req.params;
    try {
        await UserCalendar.deleteOne({ id_calendar: calendarId });
        res.json({ message: "Calendar deleted successfully" });
    } catch (error) {
        console.error("Error deleting calendar:", error);
        res.status(500).json({ error: "Failed to delete calendar" });
    }
});

router.get('/calendars', async (req, res) => {
    const { userId } = req.query;
    try {
        const userCalendars = await UserCalendar.find({ id_user: userId });
        res.json(userCalendars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting user calendars' });
    }
});

router.get('/user-calendars', async (req, res) => {
    const { userId } = req.query;
    try {
        const userCalendars = await UserCalendar.find({ id_user: userId }).populate({
            path: 'id_calendar',
            select: 'name' // Вибираємо тільки поле "name" з календаря
        });

        // Перетворюємо дані у потрібний формат
        const formattedUserCalendars = userCalendars.map(userCalendar => {
            return {
                ...userCalendar.toObject(), // Отримуємо об'єкт UserCalendar
                calendarName: userCalendar.id_calendar.name // Додаємо поле "calendarName" з ім'ям календаря
            };
        });

        res.json(formattedUserCalendars); // Відправляємо відформатовані дані на фронтенд
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting user calendars' });
    }
});



module.exports = router;
