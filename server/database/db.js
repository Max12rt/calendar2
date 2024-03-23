const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB database connection established successfully!");
  } catch (error) {
    throw new Error("Database initialization error");
  }
};

/*
* username: test
* mail: test@gmail.com
* pass: SecureP@ss123
*/
module.exports = dbConnection;
