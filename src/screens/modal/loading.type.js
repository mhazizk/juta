const LOADING_TYPES = {
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
};

export default LOADING_TYPES;
