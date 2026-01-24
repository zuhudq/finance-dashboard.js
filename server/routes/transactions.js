const express = require("express");
const router = express.Router();
// [FIX 1] Pastikan updateTransaction di-import
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getTransactions).post(protect, addTransaction);

router
  .route("/:id")
  .delete(protect, deleteTransaction)
  // [FIX 2] Tambahkan jalur PUT disini!
  .put(protect, updateTransaction);

module.exports = router;
