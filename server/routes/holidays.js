const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/holidays', (req, res) => {
    res.sendFile(path.join(__dirname, './holidays.json'));
});

module.exports = router;
