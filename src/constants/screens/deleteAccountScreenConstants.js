const DELETE_ACCOUNT_SCREEN_CONSTANTS = {
  NOT_YET_REQUESTED: {
    FIRST_LABEL: "Please note that this action is irreversible.",
    SECOND_LABEL:
      "Deleting account means deleting all of your data, including your logbooks, categories, budgets, transactions, and any other data that you have stored in Juta.",
    THIRD_LABEL:
      "Your account will be deleted after 30 days since the deletion request is made.",
    FOURTH_LABEL:
      "During this period, you can still cancel your request by logging in to your account and coming back to this menu.",
    FIFTH_LABEL:
      "To proceed with the deletion request, please enter your password below.",
    CANCEL_BUTTON_LABEL: "Cancel",
    DELETE_BUTTON_LABEL: "Request Deletion",
  },
  REQUESTED: {
    FIRST_LABEL: "Your account deletion request has been made.",
    SECOND_LABEL: "Your account is scheduled to be deleted on",
    THIRD_LABEL:
      "During this period, you can still cancel your account deletion request.",
    FOURTH_LABEL:
      "To cancel your account deletion request, please enter your password below.",
    CANCEL_DELETION_BUTTON_LABEL: "Cancel My Deletion Request",
  },
};

export default DELETE_ACCOUNT_SCREEN_CONSTANTS;
