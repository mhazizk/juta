const LOADING_TYPES = {
  TRANSACTIONS: {
    INSERT_ONE: "INSERT_ONE_TRANSACTION",
    PATCH_ONE: "PATCH_ONE_TRANSACTION",
    PATCH_MANY: "PATCH_MANY_TRANSACTIONS",
    DELETE_ONE: "DELETE_ONE_TRANSACTION",
    DELETE_MANY: "DELETE_MANY_TRANSACTIONS",
  },
  LOGBOOKS: {
    INSERT_ONE: "INSERT_ONE_LOGBOOK",
    PATCH_ONE: "PATCH_ONE_LOGBOOK",
    DELETE_ONE: "DELETE_ONE_LOGBOOK",
  },
  REPEATED_TRANSACTIONS: {
    PATCH_ALL: "PATCH_ALL_REPEATED_TRANSACTIONS",
    PATCH_NEXT: "PATCH_NEXT_REPEATED_TRANSACTIONS",
    DELETE_THIS_ONE_AND_ALL_TRANSACTIONS_INSIDE:
      "DELETE_ALL_REPEATED_TRANSACTIONS",
    DELETE_PREVIOUS_TRANSACTIONS_INSIDE_THIS_ONE:
      "DELETE_PREVIOUS_REPEATED_TRANSACTIONS",
  },
  FEATURE_WISHLIST: {
    INSERT_ONE: "INSERT_ONE_FEATURE_WISHLIST",
  },
  BUDGETS: {
    INSERT_ONE: "INSERT_ONE_BUDGET",
    PATCH_ONE: "PATCH_ONE_BUDGET",
    DELETE_ONE: "DELETE_ONE_BUDGET",
  },
  LOAN: {
    INSERT_ONE: "INSERT_ONE_LOAN",
    INSERT_ONE_CONTACT: "INSERT_ONE_LOAN_CONTACT",
    INSERT_ONE_TRANSACTION_TO_LOAN_CONTACT:
      "INSERT_ONE_TRANSACTION_TO_LOAN_CONTACT",
    DELETE_ONE_TRANSACTION_FROM_LOAN_CONTACT:
      "DELETE_ONE_TRANSACTION_FROM_LOAN_CONTACT",
    PATCH_ONE_CONTACT: "PATCH_ONE_LOAN",
    DELETE_ONE_CONTACT: "DELETE_ONE_LOAN",
  },
};

export default LOADING_TYPES;
