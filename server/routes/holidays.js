const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/holidays', (req, res) => {
    //console.log("/api/holiday  " + __dirname + '/holidays.json');
    res.sendFile(path.join(__dirname, '/holidays.json'));
    console.log("Path to holidays.json:", path.join(__dirname, 'holidays.json'));
});

module.exports = router;
