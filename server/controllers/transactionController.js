const Transaction = require("../models/Transaction");

// @desc    Ambil semua transaksi
// @route   GET /api/v1/transactions
// @access  Public
exports.getTransactions = async (req, res, next) => {
  try {
    // Cari semua data di database (mirip: SELECT * FROM transaction)
    const transactions = await Transaction.find();

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Tambah transaksi baru
// @route   POST /api/v1/transactions
// @access  Public
exports.addTransaction = async (req, res, next) => {
  try {
    // Ambil data yang dikirim user dari 'body' request
    const { text, amount } = req.body;

    // Simpan ke database (mirip: INSERT INTO...)
    const transaction = await Transaction.create(req.body);

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    // Kalau user lupa isi data yang wajib
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};
