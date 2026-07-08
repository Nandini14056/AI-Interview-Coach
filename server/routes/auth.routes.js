const express = require("express");
const { registerUser, loginUser, getCurrentUser, logOut } = require("../controllers/auth.controller");
const verifyJWT = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logOut);

module.exports = router;