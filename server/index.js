const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path"); // [BARU 1] Import module Path

// 1. Konfigurasi dotenv
dotenv.config();

// 2. Import Route Files
const transactions = require("./routes/transactions");
const users = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors());
app.use(express.json()); // Supaya bisa baca data JSON dari frontend

// [BARU 2] Konfigurasi Folder Uploads agar Terbuka untuk Umum
// Ini penting supaya gambar yang diupload bisa dilihat via URL (misal: localhost:5000/uploads/foto.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/v1/transactions", transactions);
app.use("/api/v1/users", users);

// 6. Route Default (Cek Server)
app.get("/", (req, res) => {
  res.send("Halo Coach! Server Backend Finance Dashboard sudah jalan normal!");
});

// 7. Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port: http://localhost:${PORT}`);
});
