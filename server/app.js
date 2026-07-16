const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const errorHandler = require("./middleware/error.middleware");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Coach API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/interviews", interviewRouter);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});