import uuid from "react-native-uuid";
/**
 * Create transaction details model
 *
 * @param userAccountUid - user account uid
 * @param logbookId - logbook id
 * @returns transaction details model
 */
const transactionDetailsModel = ({ userAccountUid, logbookId }) => {
  return {
    details: {
      in_out: "expense",
      amount: 0,
      loan_details: {
        from_uid: null,
        to_uid: null,
      },
      date: Date.now(),
      notes: null,
      category_id: null,
      attachment_URL: [],
    },
    _timestamps: {
      created_at: Date.now(),
      created_by: userAccountUid,
      updated_at: Date.now(),
      updated_by: userAccountUid,
    },
    repeat_id: null,
    logbook_id: logbookId,
    transaction_id: uuid.v4(),
    uid: userAccountUid,
  };
};

export default transactionDetailsModel;
