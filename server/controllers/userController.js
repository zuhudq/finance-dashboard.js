const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- 1. REGISTER USER ---
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Mohon lengkapi semua data" });
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

// --- 2. LOGIN USER ---
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Isi email dan password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Email tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token: token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
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

// --- 4. UPDATE USER DETAILS (Nama, Email, & Upload Avatar) ---
exports.updateUserDetails = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    let avatarPath;

    // [LOGIKA BARU] Cek apakah ada file yang diupload?
    if (req.file) {
      // Simpan path gambar. Kita ganti backslash windows (\) jadi slash (/) biar aman di URL
      // Kita tambahkan full URL server juga
      avatarPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // Siapkan object update
    const updateData = { name, email };
    // Kalau ada avatar baru, masukkan ke update. Kalau tidak, pakai yang lama (jangan ditimpa null)
    if (avatarPath) {
      updateData.avatar = avatarPath;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error); // Cek error di terminal
    res.status(500).json({ success: false, error: "Gagal update profil" });
  }
};

// --- [BARU] 5. UPDATE PASSWORD ---
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Cari user + passwordnya
    const user = await User.findById(req.user.id).select("+password");

    // 2. Cek password lama
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Password lama salah" });
    }

    // 3. Hash password baru
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Simpan
    await user.save();

    // 5. Kirim token baru (opsional, tapi bagus untuk keamanan)
    const token = jwt.sign({ id: user._id }, "rahasia123", {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal update password" });
  }
};
