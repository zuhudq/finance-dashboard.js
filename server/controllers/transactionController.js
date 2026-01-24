const Transaction = require("../models/Transaction");

// @desc    Ambil semua transaksi (Milik User yang Login)
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    // [MODIFIKASI] Tambahkan filter { user: req.user.id }
    // Artinya: Cari transaksi yang kolom 'user'-nya sama dengan ID user yang sedang login
    const transactions = await Transaction.find({ user: req.user.id });

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
// @access  Private
exports.addTransaction = async (req, res, next) => {
  try {
    // [MODIFIKASI] Ambil data text & amount, lalu tempelkan ID User
    // req.user.id didapat dari Middleware 'protect' (token JWT)
    req.body.user = req.user.id;

    // Simpan ke database dengan ID User tertempel
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
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    // [MODIFIKASI] Cari transaksi berdasarkan ID DAN Pemiliknya
    // findOne memastikan kita tidak salah hapus punya orang lain
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    // 2. Kalau tidak ketemu (atau bukan miliknya)
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaksi tidak ditemukan (atau bukan milik Anda)",
      });
    }

    // 3. Kalau ketemu dan milik sendiri, hapus!
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

// @desc    Update transaksi
// @route   PUT /api/v1/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    // 1. Cek Data Lama & Kepemilikan
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaksi tidak ditemukan (atau bukan milik Anda)",
      });
    }

    // 2. Lakukan Update
    // [PENTING] { new: true } artinya kembalikan data SETELAH diedit
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
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
