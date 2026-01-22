const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// 1. Konfigurasi dotenv
dotenv.config();

// 2. Import Route Files
const transactions = require("./routes/transactions");
const users = require("./routes/users"); // Pastikan file ini ada di folder routes

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors());
app.use(express.json()); // Supaya bisa baca data JSON dari frontend

// 4. Koneksi Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Database: ${error.message}`);
    process.exit(1);
  }
};
// Jalankan koneksi
connectDB();

// 5. Routes (Jalur API)
// Jalur Transaksi: localhost:5000/api/v1/transactions
app.use("/api/v1/transactions", transactions);

// Jalur User (Login/Register): localhost:5000/api/v1/users
app.use("/api/v1/users", users);

// 6. Route Default (Cek Server)
app.get("/", (req, res) => {
  res.send("Halo Coach! Server Backend Finance Dashboard sudah jalan normal!");
});

// 7. Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port: http://localhost:${PORT}`);
});
