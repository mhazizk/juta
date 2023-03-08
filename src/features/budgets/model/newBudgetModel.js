import uuid from "react-native-uuid";
import BUDGET_TYPE_CONSTANTS from "../../../constants/budgetTypeConstants";
import * as utils from "../../../utils";
/**
 * Create budget model
 *
 * @param appSettings - appSettings object
 * @param userAccountUid - user account uid
 * @param logbookId - logbook id
 * @returns budget model
 */
const newBudgetModel = ({ appSettings, userAccountUid }) => {
  const initialStartDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    appSettings.budgetSettings.firstDateOfTheMonth,
    0,
    0,
    0
  ).getTime();

  return {
    uid: userAccountUid,
    budget_id: uuid.v4(),
    budget_name: "",
    budget_type: BUDGET_TYPE_CONSTANTS.DEFAULT,
    repeat: false,
    limit: 0,
    start_date: initialStartDate,
    finish_date: utils.getNextDateInRange(initialStartDate, "monthly"),
    _timestamps: {
      created_at: Date.now(),
      updated_at: Date.now(),
      created_by: userAccountUid,
      updated_by: userAccountUid,
    },
  };
};

export default newBudgetModel;
