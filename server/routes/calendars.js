const { Router } = require("express");
const router = Router();
const {CalendarControllerNames, CalendarControllerDetails, CalendarControllerCreate, createCalendar,CalendarControllerUnlinq, CalendarControllerUnlinqEdit} = require('../controllers/calendar');
const UserCalendar = require('../models/UserCalendar');
const Calendar = require('../models/Calendars');

router.put("/:calendarId/color", async (req, res) => {
    const { color } = req.body;
    const { calendarId } = req.params;
    try {
        const updatedCalendar = await UserCalendar.findOneAndUpdate(
            { id_calendar: calendarId },
            { color },
            { new: true }
        );
        res.json(updatedCalendar);
    } catch (error) {
        console.error("Error updating calendar color:", error);
        res.status(500).json({ error: "Failed to update calendar color" });
    }
});


router.put("/:calendarId/name", async (req, res) => {
    const { name } = req.body;
    console.log(router + "/:calendarId/name");
    const { calendarId } = req.params;
    try {
        const calendar = await Calendar.findById(calendarId);
        if (!calendar) {
            throw new Error("Calendar not found");
        }

        const updatedCalendar = await UserCalendar.findOneAndUpdate(
            { id_calendar: calendarId },
            { name: calendar.name },
            { new: true }
        );
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
        console.log("userId user-calendars: ", userId.toString());
        const userCalendars = await UserCalendar.find({ id_user: userId.toString() });
        console.log("userCalendars: ", userCalendars);
        res.json(userCalendars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання календарів користувача' });
    }
});

router.delete("/unlinq/:userId/:calendarId", CalendarControllerUnlinq);
router.put("/unlinq/:userId/:calendarId", CalendarControllerUnlinqEdit);
router.get("/details/:calendarId", CalendarControllerDetails);
router.get("/names/:userId", CalendarControllerNames);
router.post("/create/notMain", CalendarControllerCreate);
router.post("/create", createCalendar);

module.exports = router;
