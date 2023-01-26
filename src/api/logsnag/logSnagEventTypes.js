const LOGSNAG_EVENT_TYPES = {
  USER_SIGNUP: {
    channel: "user-signup",
    title: "User Signup",
    description: "has signed up",
    icon: "👤",
  },
  TRANSACTION_NEW: {
    channel: "transaction-new",
    title: "New Transaction",
    description: "has created a new transaction",
    icon: "💰",
  },
  TRANSACTION_DELETE: {
    channel: "transaction-delete",
    title: "Delete Transaction",
    description: "has deleted a transaction",
    icon: "🗑️",
  },
};

export default LOGSNAG_EVENT_TYPES;
