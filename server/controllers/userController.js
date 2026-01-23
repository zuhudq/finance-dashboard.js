const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- 1. REGISTER USER (YANG KEMARIN) ---
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Mohon lengkapi data" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, error: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Bikin Token
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- 2. LOGIN USER (YANG BARU HARI INI) ---
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // A. Validasi Input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Mohon isi email dan password" });
    }

    // B. Cek Email di Database (Sertakan password karena di Model kita set select: false)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Email tidak ditemukan" });
    }

    // C. Cek Password (Bandingkan input user vs hash di DB)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    // D. Jika Lolos Semua -> Kasih Token
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Ambil data user yang sedang login
// @route   GET /api/v1/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
