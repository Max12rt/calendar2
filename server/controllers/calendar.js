const { v4: uuidv4 } = require('uuid');
const Calendars = require('../models/Calendars');
const UserCalendar = require('../models/UserCalendar');

const createCalendar = async ({ name, description, color, userId, isMain = false }) => {
        try {
                const calendar = new Calendars({
                        id: uuidv4(),
                        name,
                        description,
                        user: userId,
                });

                await calendar.save();

                const userCalendar = new UserCalendar({
                        id_user: userId,
                        id_calendar: calendar.id,
                        isMain,
                        isCreate: true,
                        isEdit: true,
                        isAccess: true,
                        isDelete: true,
                        color: color || "#ffffff",
                });

                await userCalendar.save();

                return { calendar, userCalendar };
        } catch (error) {
                console.log(error);
                throw new Error("Error creating calendar");
        }
};

module.exports = createCalendar;
