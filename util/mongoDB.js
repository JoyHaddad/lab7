const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("error connecting to MongoDB: ", error);
  }
};
