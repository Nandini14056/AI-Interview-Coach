const mongoose = require("mongoose");

const connectDB = async() => {
  await mongoose.connect(process.env.MONGOURI);

  console.log("MONGODB connected")
}

module.exports = connectDB