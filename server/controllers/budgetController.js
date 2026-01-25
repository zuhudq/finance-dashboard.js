const Budget = require("../models/Budget");

// @desc    Get all budgets for logged in user
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Set budget (Create or Update if exists)
// @route   POST /api/v1/budgets
// @access  Private
exports.setBudget = async (req, res, next) => {
  try {
    const { category, amount } = req.body;

    // Logika Pintar: Upsert (Update kalau ada, Insert kalau belum ada)
    // Kita cari budget berdasarkan User ID + Kategori
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category: category }, // Cari yang cocok
      { amount: amount }, // Data baru
      { new: true, upsert: true, runValidators: true }, // Opsi sakti
    );

    return res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Budget kategori ini sudah ada" });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res
        .status(404)
        .json({ success: false, error: "Budget tidak ditemukan" });
    }

    // Pastikan milik user sendiri
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "Tidak berhak" });
    }

    await budget.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
