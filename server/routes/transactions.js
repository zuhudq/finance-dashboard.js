const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// [PENTING] Panggil Satpam (Middleware)
const { protect } = require("../middleware/auth");

// Pasang 'protect' di setiap jalur
router
  .route("/")
  .get(protect, getTransactions) // Cek tiket dulu, baru ambil data
  .post(protect, addTransaction); // Cek tiket dulu, baru simpan data

router.route("/:id").delete(protect, deleteTransaction); // Cek tiket dulu, baru hapus

module.exports = router;
