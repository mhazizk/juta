import screenList from "../navigations/ScreenList";

const REDUCER_ACTIONS = {
  BADGE_COUNTER: {
    FORCE_SET_ALL: "FORCE_SET_ALL_BADGE_COUNTER",
    TAB: {
      SET_BADGE_IN_DASHBOARD_TAB: "SET_DASHBOARD_TAB",
      SET_BADGE_IN_LOGBOOK_TAB: "SET_LOGBOOK_TAB",
      SET_BADGE_IN_ACTION_TAB: "SET_ACTION_TAB",
      SET_BADGE_IN_SEARCH_TAB: "SET_SEARCH_TAB",
      SET_BADGE_IN_USER_TAB: "SET_USER_TAB",
      FORCE_SET_BADGE_TAB: "FORCE_SET_BADGE_TAB",
    },
    SCREEN: {
      SET_BADGE_IN_ACCOUNT_SCREEN: screenList.myAccountScreen
        .replace(/ /g, "_")
        .toUpperCase(),
      SET_BADGE_IN_ACCOUNT_SCREEN: screenList.logbookScreen
        .replace(/ /g, "_")
        .toUpperCase(),
    },
  },
  MULTI_ACTIONS: {
    SET_INIT_TRANSACTIONS: "SET_INIT_TRANSACTIONS",
  },
  SORTED_TRANSACTIONS: {
    GROUP_SORTED: {
      FORCE_SET: "FORCE_SET_GROUP_SORTED_TRANSACTIONS",
      SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_SORTED_TRANSACTIONS",
      SET: "SET_SORTED_TRANSACTIONS",
      INIT_SETUP: "INIT_SETUP_SORTED_TRANSACTIONS",
      INSERT_TRANSACTION: "INSERT_SORTED_TRANSACTIONS",
      PATCH_TRANSACTION: "PATCH_SORTED_TRANSACTIONS",
      PATCH_MANY_TRANSACTIONS: "PATCH_MANY_SORTED_TRANSACTIONS",
      DELETE_ONE_TRANSACTION: "DELETE_ONE_SORTED_TRANSACTION",
      DELETE_MANY_TRANSACTIONS: "DELETE_MANY_SORTED_TRANSACTIONS",
      CLEAR_TRANSACTIONS: "CLEAR_SORTED_TRANSACTIONS",
      INSERT_LOGBOOK: "INSERT_SORTED_LOGBOOK",
      DELETE_ONE_LOGBOOK: "DELETE_SORTED_ONE_LOGBOOK",
      PATCH_CATEGORY: "PATCH_SORTED_CATEGORY",
    },
  },
  REPEATED_TRANSACTIONS: {
    FORCE_SET: "FORCE_SET_REPEAT_TRANSACTIONS",
    SET: "SET_REPEAT_TRANSACTIONS",
    INSERT: "INSERT_REPEAT_TRANSACTION",
    PATCH: "PATCH_REPEAT_TRANSACTION",
    PATCH_MANY: "PATCH_MANY_REPEAT_TRANSACTIONS",
    LOAD: "LOAD_REPEAT_TRANSACTIONS",
    DELETE_ONE: "DELETE_ONE_REPEAT_TRANSACTIONS",
    DELETE_MANY: "DELETE_MANY_REPEAT_TRANSACTIONS",
    CLEAR: "CLEAR_REPEAT_TRANSACTIONS",
  },
  TRANSACTIONS: {
    SET: "SET_TRANSACTIONS",
    INSERT: "INSERT_TRANSACTION",
    PATCH: "PATCH_TRANSACTION",
    LOAD: "LOAD_TRANSACTIONS",
    DELETE_ONE: "DELETE_ONE_TRANSACTIONS",
    DELETE_MANY: "DELETE_MANY_TRANSACTIONS",
    CLEAR: "CLEAR_TRANSACTIONS",
  },
  GROUPED_TRANSACTIONS: {
    SET: "SET_GROUPED_TRANSACTIONS",
    LOAD: "LOAD_GROUPED_TRANSACTIONS",
    CLEAR: "CLEAR_GROUPED_TRANSACTIONS",
  },
  LOGBOOKS: {
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_LOGBOOKS",
    FORCE_SET: "FORCE_SET_LOGBOOKS",
    SET: "SET_LOGBOOKS",
    LOAD: "LOAD_LOGBOOKS",
    INSERT: "INSERT_LOGBOOK",
    PATCH: "PATCH_LOGBOOK",
    DELETE_ONE: "DELETE_ONE_LOGBOOK",
    CLEAR: "CLEAR_LOGBOOKS",
  },
  CATEGORIES: {
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_CATEGORIES",
    FORCE_SET: "FORCE_SET_CATEGORIES",
    SET: "SET_CATEGORIES",
    LOAD: "LOAD_CATEGORIES",
    INSERT: "INSERT_CATEGORY",
    PATCH: "PATCH_CATEGORY",
    DELETE_ONE: "DELETE_ONE_CATEGORY",
    CLEAR: "CLEAR_CATEGORIES",
  },
  BUDGETS: {
    FORCE_SET: "FORCE_SET_BUDGETS",
    SET: "SET_BUDGETS",
    LOAD: "LOAD_BUDGETS",
    INSERT: "INSERT_BUDGET",
    PATCH: "PATCH_BUDGET",
    DELETE_ONE: "DELETE_ONE_BUDGET",
    CLEAR: "CLEAR_BUDGETS",
  },
  GROUPS: {
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_GROUPS",
    FORCE_SET: "FORCE_SET_GROUPS",
    SET: "SET_GROUPS",
    LOAD: "LOAD_GROUPS",
    INSERT: "INSERT_GROUP",
    PATCH: "PATCH_GROUP",
    DELETE_ONE: "DELETE_ONE_GROUP",
    CLEAR: "CLEAR_GROUPS",
  },
  LOADING: {
    SET: "SET_LOADING",
  },
  FEATURE_WISHLIST: {
    FORCE_SET: "FORCE_SET_FEATURE_WISHLIST",
    INSERT: "INSERT_ONE_FEATURE_WISHLIST",
    DELETE_ONE: "DELETE_ONE_FEATURE_WISHLIST",
    DELETE_MANY: "DELETE_MANY_FEATURE_WISHLIST",
  },
  USER_ACCOUNT: {
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_USER_ACCOUNT",
    FORCE_SET: "FORCE_SET_ALL_USER_ACCOUNT",
    DISPLAY_NAME: {
      SET: "SET_DISPLAY_NAME",
      LOAD: "LOAD_DISPLAY_NAME",
      CLEAR: "CLEAR_DISPLAY_NAME",
    },
    VERIFICATION: {
      SET: "SET_VERIFICATION",
      CLEAR: "CLEAR_VERFICATION",
    },
    EMAIL: {
      SET: "SET_EMAIL",
      CLEAR: "CLEAR_EMAIL",
    },
    PROFILE_PICTURE: {
      SET: "SET_PROFILE_PICTURE",
      CLEAR: "CLEAR_PROFILE_PICTURE",
    },
    TOKEN: {
      SET: "SET_TOKEN",
      CLEAR: "CLEAR_TOKEN",
    },
  },
  THEME: {
    SET: "SET_THEME",
    LOAD: "LOAD_THEME",
    CLEAR: "CLEAR_THEME",
  },
  CURRENCY_RATES: {
    SET: "SET_CURRENCY_RATE",
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_CURRENCY_RATE",
    FORCE_SET: "FORCE_SET_CURRENCY_RATE",
    LOAD: "LOAD_CURRENCY_RATE",
    CLEAR: "CLEAR_CURRENCY_RATE",
  },
  LOAN: {
    SET: "SET_LOAN",
    INSERT_ONE_CONTACT: "INSERT_ONE_LOAN_CONTACT",
    PATCH_ONE_CONTACT: "PATCH_ONE_LOAN_CONTACT",
    DELETE_ONE_CONTACT: "DELETE_ONE_LOAN_CONTACT",
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_LOAN",
    FORCE_SET: "FORCE_SET_LOAN",
    LOAD: "LOAD_LOAN",
    CLEAR: "CLEAR_LOAN",
  },
  APP_SETTINGS: {
    SET_MULTI_ACTIONS: "SET_MULTI_ACTIONS_APP_SETTINGS",
    FORCE_SET: "FORCE_SET_ALL_APP_SETTINGS",
    THEME: {
      SET: "SET_THEME",
      LOAD: "LOAD_THEME",
      CLEAR: "CLEAR_THEME",
    },
    FONT_SIZE: {
      SET: "SET_FONT_SIZE",
      LOAD: "LOAD_FONT_SIZE",
      CLEAR: "CLEAR_FONT_SIZE",
    },
    LANGUAGE: {
      SET: "SET_LANGUAGE",
      LOAD: "LOAD_LANGUAGE",
      CLEAR: "CLEAR_LANGUAGE",
    },
    LOCALE: {
      SET: "SET_LOCALE",
      LOAD: "LOAD_LOCALE",
      CLEAR: "CLEAR_LOCALE",
    },
    CURRENCY_RATE: {
      SET: "SET_CURRENCY_RATE",
      LOAD: "LOAD_CURRENCY_RATE",
      CLEAR: "CLEAR_CURRENCY_RATE",
    },
    DECIMALS: {
      SET: "SET_DECIMALS",
    },
    SCREEN_HIDDEN: {
      PUSH: "PUSH_SCREEN_HIDDEN",
    },
  },
};

export default REDUCER_ACTIONS;
