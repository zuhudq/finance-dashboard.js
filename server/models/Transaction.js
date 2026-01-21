const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Silakan tambahkan teks"],
  },
  amount: {
    type: Number,
    required: [true, "Silakan tambahkan angka positif atau negatif"],
  },
  // Update bagian ini:
  category: {
    type: String,
    required: [true, "Silakan pilih kategori"],
    enum: ["Gaji", "Makanan", "Transport", "Tagihan", "Hiburan", "Lainnya"], // Pilihan wajib
    default: "Lainnya",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
