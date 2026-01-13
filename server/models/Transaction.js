const mongoose = require("mongoose");

// Kita desain tabelnya di sini
const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Tolong isi keterangan transaksi"], // Validasi: Wajib isi
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Tolong isi nominal uang"],
    // Kalau positif = Income, Negatif = Expense
  },
  category: {
    type: String,
    required: false,
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Otomatis isi tanggal saat ini
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
