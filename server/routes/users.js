const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController"); // Pastikan ini juga ada

// Jalur untuk Register
// URL Akhir: POST /api/v1/users/register
router.post("/register", registerUser);

module.exports = router;
