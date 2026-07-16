const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const router = express.Router();
const { startInterview,getInterview,submitAnswer, getInterviewHistory, getInterviewResult } = require("../controllers/interview.controller");

router.post("/start", verifyJWT, startInterview);

router.get("/", verifyJWT, getInterviewHistory);

router.get("/:id", verifyJWT, getInterview);

router.post("/:id/answers", verifyJWT, submitAnswer);

router.get("/:id/result", verifyJWT, getInterviewResult);

module.exports = router;