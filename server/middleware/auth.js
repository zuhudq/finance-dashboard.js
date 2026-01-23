const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token dari header "Bearer eyJhbG..."
      token = req.headers.authorization.split(" ")[1];

      // Dekode token
      const decoded = jwt.verify(token, "rahasia123");

      // Cari user berdasarkan ID di token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, error: "Token tidak valid" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Tidak ada akses (No Token)" });
  }
};
