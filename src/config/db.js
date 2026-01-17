const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ke7g9qv.mongodb.net/gadget?appName=Cluster0`,
    );

    console.log("DB connected successfully");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
