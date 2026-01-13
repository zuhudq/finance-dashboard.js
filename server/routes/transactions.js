const express = require("express");
const router = express.Router();

// Panggil controller yang tadi kita buat
const {
  getTransactions,
  addTransaction,
} = require("../controllers/transactionController");

// Mengatur rute
// Kalau ada yang akses '/' (root) dari file ini:
router
  .route("/")
  .get(getTransactions) // Kalau metodenya GET -> jalankan fungsi getTransactions
  .post(addTransaction); // Kalau metodenya POST -> jalankan fungsi addTransaction

module.exports = router;
