const express = require("express");
const router = express.Router();

// Pastikan cuma ada SATU baris ini yang memuat 4 fungsi sekaligus
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.route("/").get(getTransactions).post(addTransaction);

router.route("/:id").delete(deleteTransaction).put(updateTransaction);

module.exports = router;
