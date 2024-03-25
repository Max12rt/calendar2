const { v4: uuidv4 } = require('uuid');
const Calendars = require('../models/Calendars');
const UserCalendar = require('../models/UserCalendar');
const User = require('../models/User');

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
const CalendarControllerDetails = async(req, res) => {

        var id_calendar =req.params.calendarId;

        const userCalendars = await UserCalendar.find({ id_calendar: id_calendar }).cursor();

        const calendar = await Calendars.find({ id: id_calendar });

        const userAccess=[];

        for (let doc = await userCalendars.next(); doc != null; doc = await userCalendars.next()) {
                console.log(doc);
                const user = await User.find({ id: doc.id_user });
                userAccess.push({
                        userName: user[0].name,
                        id_user: doc.id_user,
                        isMain: doc.isMain,
                        isEdit: doc.isEdit,
                        isAccess : doc.isAccess,
                        isDelete: doc.isDelete,
                        color : doc.color
                })
        }
        res.json({
                calendarName: calendar[0].name,
                userAccess: userAccess
        });
};

const CalendarControllerCreate = async(req, res) =>{
        const { name, description, color, userId, isMain = false } = req.body;

        try {
                const calendarId= uuidv4();
                console.log(calendarId);

                const calendar = new Calendars({
                        id: calendarId,
                        name,
                        description,
                        user: userId,
                });

                await calendar.save();

                const userCalendar = new UserCalendar({
                        id_user: userId,
                        id_calendar: calendar.id,
                        isMain :false,
                        isCreate: true,
                        isEdit: true,
                        isAccess: true,
                        isDelete: true,
                        color: color || "#ffffff",
                });

                await userCalendar.save();

                res.status(201).json({ calendar, userCalendar });
        } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Error creating calendar" });
        }
}

//create event
//show calendar при нажатії  -> show event
//форма вверху випадающий список календарів і при воборі ідуть рядки
// 1 творець і таблиця з тими хто приписаний до календаря
//збоку кнопку для чуваків видалити і внизу добавити людину для календаря
const CalendarControllerNames = async (req, res) => {
        var id_user =req.params.userId;

        const userCalendars = await UserCalendar.find({ id_user: id_user }).cursor();

        const names=[];

        for (let doc = await userCalendars.next(); doc != null; doc = await userCalendars.next()) {

                const calendar = await Calendars.find({ id: doc.id_calendar });
                names.push({
                        id: doc.id_calendar,
                        name: calendar[0].name,
                        color : doc.color
                })
        }
        res.json({
                names
        });
};

const CalendarControllerUnlinq = async(req, res) => {

        const id_user = req.params.userId;
        const id_calendar = req.params.calendarId;

        await UserCalendar.deleteOne({ id_user: id_user, id_calendar: id_calendar, isMain:false });
        res.status(200).json();
}

const CalendarControllerUnlinqEdit = async (req, res)=> {
        const id_user = req.params.userId;
        const id_calendar = req.params.calendarId;

        const { isCreate, isEdit, isAccess, isDelete, isMain } = req.body;

        UserCalendar.findOneAndUpdate({ id_user: id_user, id_calendar: id_calendar, isMain:isMain },
            {isCreate: isCreate, isEdit: isEdit,  isAccess: isAccess, isDelete: isDelete},
            null, function (err) {
                    if (err){
                            console.log(err);
                            res.status(500).json({ error: "Error CalendarControllerUnlinqEdit" });
                    }
            });

        res.status(200).json();
}

module.exports = { CalendarControllerDetails, CalendarControllerCreate, CalendarControllerNames, CalendarControllerUnlinq, CalendarControllerUnlinqEdit,createCalendar};


