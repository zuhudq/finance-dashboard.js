const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Tidak boleh ada username kembar
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // timestamps: true akan otomatis buat kolom createdAt & updatedAt

module.exports = mongoose.model("User", UserSchema);
