const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  // Punya siapa budget ini?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Kategori apa? (Makanan, Transport, dll)
  category: {
    type: String,
    required: [true, "Silakan pilih kategori"],
    trim: true,
  },
  // Batas maksimal berapa? (Target)
  amount: {
    type: Number,
    required: [true, "Silakan isi batas budget"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mencegah duplikasi: 1 User cuma boleh punya 1 Budget per Kategori
// Jadi gak bisa ada 2 budget buat "Makanan" di user yang sama.
BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
