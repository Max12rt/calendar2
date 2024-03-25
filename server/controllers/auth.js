const bcryptjs = require("bcryptjs");
const User = require('../models/User');
const { createCalendar } = require("./calendar");
const UserCalendar = require('../models/UserCalendar');
const generateJWT = require("../helpers/jwt");

const createUser = async (req, res) => {
  const { name, email, password, color } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
          .status(400)
          .json({ ok: false, msg: "User email already exists" });
    }

    // Create a new user object
    user = new User({
      name,
      email,
      password,
    });

    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = await generateJWT(user.id, user.name);

    // Create calendar name and description
    const calendarName = `Calendar of ${user.name}`;
    const calendarDescription = `${user.name}'s Calendar`;

    // Create a calendar for the user
    const calendar = await createCalendar({ name: calendarName, description: calendarDescription, userId: user.id, isMain: true, color: color });

    // Query all calendars associated with this user from UserCalendar collection
    const userCalendars = await UserCalendar.find({ id_user: user.id }).select('id_calendar');

    // Return response with created user, token, and list of calendars
    return res.status(201).json({ ok: true, user, token, userCalendars });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Error creating user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ok: false, msg: "User email does not exist",});

    // Verify if passwords match
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Invalid password.",
      });
    }

    const token = await generateJWT(user.id, user.name);

    // Query UserCalendar collection with the user's ID and populate the id_user field
    const userCalendars = await UserCalendar.find({ id_user: user.id }).select('id_calendar');

    return res.status(200).json({
      ok: true,
      user,
      token,
      userCalendars
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "ErrorLoginUser",
    });
  }
};


const renewToken = async (req, res) => {
  const { id, name } = req;

  const token = await generateJWT(id, name);

  res.json({ ok: true, user: { _id: id, name }, token });
};

module.exports = { createUser, loginUser, renewToken };
