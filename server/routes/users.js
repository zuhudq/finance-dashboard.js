const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth"); // Import middleware

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // Route baru diproteksi

module.exports = router;
