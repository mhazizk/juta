import REDUCER_ACTIONS from "./reducer.action";

const globalLoanReducer = (state, action) => {
  // Loan contact
  const insertLoanContact = action.payload?.insertLoanContact;
  const patchLoanContact = action.payload?.patchLoanContact;
  const deleteLoanContact = action.payload?.deleteLoanContact;

  // Loan transaction
  const targetLoanContactUid = action.payload?.targetLoanContactUid;
  const insertLoanTransaction = action.payload?.insertTransactionToLoanContact;
  const deleteLoanTransaction =
    action.payload?.deleteTransactionFromLoanContact;

  // timestamps
  const newLocalTimestamp = action.payload?.newGlobalLoanTimestamps;
  const newTimestampFromFirestore = action.payload?._timestamps;
  const newUpdatedAtTimestampFromLocal = newLocalTimestamp?.updated_at;
  const newUpdatedAtTimestampFromFirestore =
    newTimestampFromFirestore?.updated_at;
  const existingUpdatedAtTimestamp = state._timestamps?.updated_at;
  switch (action.type) {
    case REDUCER_ACTIONS.LOAN.FORCE_SET:
      //   force set is used when the user is logged in
      return action.payload;
    case REDUCER_ACTIONS.LOAN.SET:
      return {
        ...state,
        ...action.payload,
      };
    case REDUCER_ACTIONS.LOAN.SET_MULTI_ACTIONS:
      // changes from firebase are being reduced here
      //  check timestamp
      if (newUpdatedAtTimestampFromFirestore > existingUpdatedAtTimestamp) {
        return {
          ...state,
          ...action.payload,
        };
      } else {
        return state;
      }

    // below are the actions for local changes first before being sent to firebase in loading screen
    case REDUCER_ACTIONS.LOAN.INSERT_ONE_CONTACT:
      //  check timestamp
      if (newUpdatedAtTimestampFromLocal > existingUpdatedAtTimestamp) {
        return {
          ...state,
          contacts: [...state.contacts, insertLoanContact].sort((a, b) => {
            return a.contact_name - b.contact_name;
          }),
          _timestamps: { ...newLocalTimestamp },
        };
      } else {
        return state;
      }

    case REDUCER_ACTIONS.LOAN.PATCH_ONE_CONTACT:
      //  check timestamp
      if (newUpdatedAtTimestampFromLocal > existingUpdatedAtTimestamp) {
        //   find the existing contact
        const filterOutExistingContact = state.contacts.filter((contact) => {
          return contact.contact_uid !== patchLoanContact.contact_uid;
        });
        return {
          ...state,
          contacts: [...filterOutExistingContact, patchLoanContact].sort(
            (a, b) => {
              return a.contact_name - b.contact_name;
            }
          ),
          _timestamps: { ...newLocalTimestamp },
        };
      } else {
        return state;
      }

    case REDUCER_ACTIONS.LOAN.DELETE_ONE_CONTACT:
      //  check timestamp
      if (newUpdatedAtTimestampFromLocal > existingUpdatedAtTimestamp) {
        //   find the existing contact
        const filterOutExistingContact = state.contacts.filter((contact) => {
          return contact.contact_uid !== deleteLoanContact.contact_uid;
        });
        return {
          ...state,
          contacts: [...filterOutExistingContact].sort((a, b) => {
            return a.contact_name - b.contact_name;
          }),
          _timestamps: { ...newLocalTimestamp },
        };
      } else {
        return state;
      }

    case REDUCER_ACTIONS.LOAN.INSERT_ONE_TRANSACTION_TO_LOAN_CONTACT:
      //  check timestamp
      if (newUpdatedAtTimestampFromLocal > existingUpdatedAtTimestamp) {
        //   find the existing contact by transaction id
        const foundExistingContact = state.contacts.find((contact) => {
          return contact.contact_uid === targetLoanContactUid;
        });

        // put back to the state

        return {
          ...state,
          contacts: [
            ...state.contacts.filter((contact) => {
              return contact.contact_uid !== foundExistingContact.contact_uid;
            }),
            {
              ...foundExistingContact,
              transactions_id: [
                ...foundExistingContact.transactions_id,
                insertLoanTransaction,
              ],
            },
          ].sort((a, b) => {
            return a.contact_name - b.contact_name;
          }),
          _timestamps: { ...newLocalTimestamp },
        };
      } else {
        return state;
      }

    case REDUCER_ACTIONS.LOAN.DELETE_ONE_TRANSACTION_FROM_LOAN_CONTACT:
      //  check timestamp
      if (newUpdatedAtTimestampFromLocal > existingUpdatedAtTimestamp) {
        //   find the existing contact by transaction id
        const foundExistingContact = state.contacts.find((contact) => {
          return contact.transactions_id.includes(deleteLoanTransaction)
            ? contact
            : null;
        });

        // remove the transaction from the found contact
        const filterOutExistingTransaction =
          foundExistingContact.transactions_id.filter((id) => {
            return id !== deleteLoanTransaction;
          });

        // put back to the state

        return {
          ...state,
          contacts: [
            ...state.contacts.filter((contact) => {
              return contact.contact_uid !== foundExistingContact.contact_uid;
            }),
            {
              ...foundExistingContact,
              transactions_id: [...filterOutExistingTransaction],
            },
          ].sort((a, b) => {
            return a.contact_name - b.contact_name;
          }),
          _timestamps: { ...newLocalTimestamp },
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default globalLoanReducer;
