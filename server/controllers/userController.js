const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- 1. REGISTER USER ---
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // [DEBUG] Cek data masuk di Terminal Backend
    console.log("👉 Register Request Masuk:", { name, email, password });

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Mohon lengkapi semua data" });
    }

    // Cek User Lama
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, error: "Email sudah terdaftar" });
    }

    // Hash Password
    console.log("👉 Hashing Password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    console.log("👉 Menyimpan ke DB...");
    const user = await User.create({
      name, // Pastikan Model User.js pakai 'name', bukan 'username'
      email,
      password: hashedPassword,
    });

    console.log("✅ User Berhasil Disimpan ID:", user._id);

    // Token
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ ERROR REGISTER:", error.message); // Ini akan muncul di terminal
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- 2. LOGIN USER ---
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("👉 Login Request:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Isi email dan password" });
    }

    // Cek Email (+password karena select: false)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Email tidak ditemukan" });
    }

    // Cek Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    // Token
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ ERROR LOGIN:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- 3. GET ME (LOAD USER) ---
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
