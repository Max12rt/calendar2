// server/routes/holidays.js

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/api/calendar/holiday', (req, res) => {
    res.sendFile(path.join(__dirname, './holidays.json'));
});

module.exports = router;


module.exports = router;
