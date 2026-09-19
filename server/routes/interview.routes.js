const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const router = express.Router();
const { startInterview,
  getInterview,
  submitAnswer,
  submitVoiceAnswer,
  submitVideoAnswer,
  getInterviewHistory,
  getInterviewResult, } = require("../controllers/interview.controller");

router.post("/start", verifyJWT, startInterview);

router.get("/", verifyJWT, getInterviewHistory);

router.get("/:id", verifyJWT, getInterview);

router.post("/:id/answers", verifyJWT, submitAnswer);

router.post("/:id/voice-answer", verifyJWT, submitVoiceAnswer);

router.post("/:id/video-answer", verifyJWT, submitVideoAnswer);

router.get("/:id/result", verifyJWT, getInterviewResult);

module.exports = router;