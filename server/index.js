const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // 1. Panggil Mongoose

dotenv.config();

// BARU: Panggil file routes
const transactions = require("./routes/transactions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Kodingan Koneksi ke MongoDB (Ini yang baru)
// Kita pakai try-catch biar kalau error ketahuan
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Matikan server jika gagal connect database
  }
};

// Panggil fungsi koneksi tadi
connectDB();

app.get("/", (req, res) => {
  res.send("Halo Coach! Server Backend Finance Dashboard sudah jalan!");
}); // BARU: Gunakan routes
// Artinya: URL apapun yang diawali '/api/v1/transactions' akan diurus oleh file transactions.js
app.use("/api/v1/transactions", transactions);

// Route Default (Cek server jalan) - Boleh dihapus atau biarkan saja
app.get("/", (req, res) => {
  res.send("Server Backend Aman!");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port: http://localhost:${PORT}`);
});
