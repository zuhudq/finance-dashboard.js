const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Silakan isi keterangan transaksi"],
  },
  amount: {
    type: Number,
    required: [true, "Silakan isi jumlah uang"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // [BARU] Kolom Pemilik Data
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Transaksi WAJIB punya pemilik
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
