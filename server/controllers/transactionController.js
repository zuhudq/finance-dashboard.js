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

// @desc    Hapus transaksi
// @route   DELETE /api/v1/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res, next) => {
  try {
    // 1. Cari transaksi berdasarkan ID yang dikirim
    const transaction = await Transaction.findById(req.params.id);

    // 2. Kalau tidak ketemu, kasih error
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaksi tidak ditemukan",
      });
    }

    // 3. Kalau ketemu, hapus!
    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    // 1. Cari data lama berdasarkan ID
    let transaction = await Transaction.findById(req.params.id);

    // 2. Kalau tidak ketemu
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaksi tidak ditemukan",
      });
    }

    // 3. Kalau ketemu, update isinya
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Supaya yang dikembalikan adalah data yang SUDAH diedit
      runValidators: true, // Cek aturan validasi lagi
    });

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
