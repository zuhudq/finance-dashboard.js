const express = require("express");
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");

// Semua route di sini diproteksi (Wajib Login)
router
  .route("/")
  .get(protect, getBudgets) // Ambil data
  .post(protect, setBudget); // Simpan data

router.route("/:id").delete(protect, deleteBudget); // Hapus budget

module.exports = router;
