const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. CCTV: Cek data masuk
    console.log("--------------------------------");
    console.log("1. Request Masuk Controller:", { name, email, password });

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Mohon lengkapi data" });
    }

    // 2. CCTV: Cek Database
    console.log("2. Mengecek email di database...");
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("X. Email sudah ada!");
      return res
        .status(400)
        .json({ success: false, error: "Email sudah terdaftar" });
    }

    // 3. CCTV: Mulai Enkripsi
    console.log("3. Memulai Hash Password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("   Password berhasil di-hash.");

    // 4. CCTV: Simpan User
    console.log("4. Menyimpan ke MongoDB...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("   User berhasil disimpan dengan ID:", user._id);

    // 5. CCTV: Bikin Token
    console.log("5. Membuat Token JWT...");
    // Pastikan pakai string 'rahasia123' dulu biar aman dari error env
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });
    console.log("   Token berhasil dibuat.");

    // SUKSES
    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // TANGKAP ERRORNYA DISINI
    console.error("!!! ERROR FATAL DI CONTROLLER !!!");
    console.error(error); // Ini akan muncul di terminal
    res.status(500).json({ success: false, error: error.message });
  }
};
