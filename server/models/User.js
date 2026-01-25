const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Silakan isi nama lengkap"],
  },
  email: {
    type: String,
    required: [true, "Silakan isi email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Silakan isi format email yang valid",
    ],
  },
  password: {
    type: String,
    required: [true, "Silakan isi password"],
    minlength: 6,
    select: false,
  },
  // [BARU] Kolom Avatar (menyimpan URL gambar)
  avatar: {
    type: String,
    default: "", // Default kosong jika belum punya
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
