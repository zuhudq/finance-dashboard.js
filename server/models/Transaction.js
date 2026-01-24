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
  category: {
    type: String,
    required: [true, "Silakan pilih kategori"],
    default: "Umum",
  },
  // [BARU] Kolom khusus untuk Tanggal Transaksi (Bisa diedit)
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    // Ini cuma timestamp kapan data diinput (jangan diubah user)
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
