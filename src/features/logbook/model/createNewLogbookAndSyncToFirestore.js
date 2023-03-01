import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import getLogbookModel from "./getLogbookModel";

/**
 * Create new logbook and sync to firestore
 *
 * @param dispatchLogbooks - dispatchLogbooks from global reducer
 * @param dispatchSortedTransactions - dispatchSortedTransactions from global reducer
 * @param logbookName - logbook name to be created
 * @param uid - user account uid
 * @param defaultCurrency - default currency object from appSettings.logbookSettings
 * @returns new logbook
 */
const createNewLogbookAndSyncToFirestore = ({
  dispatchLogbooks,
  dispatchSortedTransactions,
  logbookName,
  uid,
  defaultCurrency,
}) => {
  const newLogbook = getLogbookModel({
    logbookName: logbookName,
    uid: uid,
    defaultCurrency: defaultCurrency,
  });

  dispatchLogbooks({
    type: REDUCER_ACTIONS.LOGBOOKS.INSERT,
    payload: { newLogbook, reducerUpdatedAt: Date.now() },
  });

  dispatchSortedTransactions({
    type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_LOGBOOK,
    payload: {
      newLogbook: {
        logbook_id: newLogbook.logbook_id,
        transactions: [],
      },
      logbookToOpen: {
        name: newLogbook.logbook_name,
        logbook_id: newLogbook.logbook_id,
        logbook_currency: newLogbook.logbook_currency,
      },
    },
  });

  setTimeout(async () => {
    await firestore.setData(
      FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      newLogbook.logbook_id,
      newLogbook
    );
  }, 5000);
};
export default createNewLogbookAndSyncToFirestore;
