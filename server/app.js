const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Coach API is running",
  });
});

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});