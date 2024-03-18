const { v4: uuidv4 } = require('uuid');
const Calendars = require('../models/Calendars');
const UserCalendar = require('../models/UserCalendar');

const createCalendar = async ({ name, description, color, userId, isMain = false }) => {
        try {
                // Create a new calendar object
                const calendar = new Calendars({
                        id: uuidv4(),
                        name,
                        description,
                        user: userId,
                });

                // Save the calendar to the database
                await calendar.save();

                // Create a UserCalendar entry associating the user with the calendar
                const userCalendar = new UserCalendar({
                        id_user: userId,
                        id_calendar: calendar.id,
                        isMain,
                        isCreate: true,
                        isEdit: true,
                        isAccess: true,
                        isDelete: true,
                        color: color || "#ffffff", // Default color or you can pass it from parameters
                });

                // Save the UserCalendar entry to the database
                await userCalendar.save();

                return { calendar, userCalendar }; // Return the created calendar and user calendar entry
        } catch (error) {
                console.log(error);
                throw new Error("Error creating calendar");
        }
};

module.exports = createCalendar;
