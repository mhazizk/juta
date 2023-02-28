import uuid from "react-native-uuid";
/**
 * @description - get logbook model
 *
 * @param logbookName - logbook name
 * @param uid - user id
 * @param defaultCurrency - default currency from app settings
 */
const getLogbookModel = ({ logbookName, uid, defaultCurrency }) => {
  return {
    _timestamps: {
      created_at: Date.now(),
      created_by: uid,
      updated_at: Date.now(),
      updated_by: uid,
    },
    uid: uid,
    group_id: null,
    logbook_currency: defaultCurrency,
    logbook_type: "basic",
    logbook_id: uuid.v4(),
    logbook_name: logbookName || "New Logbook",
    logbook_records: [],
    logbook_categories: [],
  };
};

export default getLogbookModel;
