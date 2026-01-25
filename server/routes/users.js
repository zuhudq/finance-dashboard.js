const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  registerUser,
  loginUser,
  getMe,
  updateUserDetails,
  updatePassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");

// --- KONFIGURASI MULTER (UPLOAD) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Simpan di folder uploads
  },
  filename: function (req, file, cb) {
    // Format nama file: avatar-USERID-TIMESTAMP.jpg
    cb(null, "avatar-" + Date.now() + path.extname(file.originalname));
  },
});

// Filter: Hanya boleh upload gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Bukan file gambar!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- ROUTES ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

// [UPDATE] Route update details sekarang pakai middleware upload.single('avatar')
router.put(
  "/updatedetails",
  protect,
  upload.single("avatar"),
  updateUserDetails,
);

router.put("/updatepassword", protect, updatePassword);

module.exports = router;
