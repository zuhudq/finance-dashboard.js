const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // [PERBAIKAN] Ubah 'username' jadi 'name' agar sesuai dengan form register
  name: {
    type: String,
    required: [true, "Silakan isi nama"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
