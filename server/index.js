// server/index.js

const express = require("express");
require("dotenv").config();
const dbConnection = require("./database/db");
const cors = require("cors");
const path = require("path");

// Server
const app = express();

// Database
dbConnection();

// Use CORS middleware
app.use(cors());

// Public path
app.use(express.static("build"));

// Read and parse body
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events.js"));
app.use("/api/calendars", require("./routes/calendars"));
app.use("/api/holiday", require("./routes/holidays"));


// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Listening PORT
const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`PORT http://localhost:${port}`);
});
