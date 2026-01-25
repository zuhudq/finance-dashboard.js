export default function AppReducer(state, action) {
  switch (action.type) {
    // --- TRANSAKSI ---
    case "GET_TRANSACTIONS":
      return {
        ...state,
        loading: false,
        transactions: action.payload,
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== action.payload,
        ),
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction._id === action.payload._id ? action.payload : transaction,
        ),
        loading: false,
      };
    case "TRANSACTION_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    // --- BUDGETING ---
    case "GET_BUDGETS":
      return {
        ...state,
        budgets: action.payload,
        loading: false,
      };
    case "SET_BUDGET":
      // Update list: Hapus budget lama kategori tsb (kalo ada), masukkan yang baru
      return {
        ...state,
        budgets: [
          action.payload,
          ...state.budgets.filter(
            (b) => b.category !== action.payload.category,
          ),
        ],
      };
    case "BUDGET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    // --- AUTHENTICATION ---

    // 1. Load User Berhasil (Auto Login)
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload, // Data user dari backend
      };

    // 2. Login/Register Berhasil
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    // 3. Gagal / Logout (Disatukan biar tidak DUPLICATE)
    case "AUTH_ERROR":
    case "REGISTER_FAIL":
    case "LOGIN_FAIL":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
        transactions: [], // [PENTING] Kosongkan array transaksi saat keluar!
      };

    default:
      return state;
  }
}
