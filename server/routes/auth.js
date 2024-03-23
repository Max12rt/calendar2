const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { emailExists } = require("../helpers/databaseValidators");
const validateFields = require("../middlewares/validateFields");
const validateJWT = require("../middlewares/validateJWT");
const router = Router();
const User = require("../models/User");


router.post(
  "/register",
  [ check("name", "Name is required").not().isEmpty(),
    check("name", "Name length must be max 32 characters").isLength({max: 32,}),
    check("email", "Invalid email").isEmail(),
    check("password", "Password should be between 8-32 characters and should include 1 number, 1 symbol, 1 lowercase and 1 uppercase.").isStrongPassword(),
    check("password", "Password should be between 8-32 characters.").isLength({max: 32,}),
    validateFields,
    emailExists,
  ],
  createUser
);

router.post(
    "/calendars",
    async (req, res) => {
        const { name } = req.body;

        try {
            const user = await User.findByIdAndUpdate(
                req.id,
                { $push: { calendars: { name } } },
                { new: true }
            );

            return res.status(200).json({ ok: true, user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, msg: "ErrorCreateCalendar" });
        }
    }
);


router.post(
  "/login", [ check("email", "Invalid email").isEmail(),
    check("password", "Password is required.").not().isEmpty(),
    validateFields,
  ],
  loginUser
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
