import { LogbookType, LogbookCurrencyType } from "../@types/logbook";
import uuid from "react-native-uuid";
import { TransactionType } from "../@types/transactions";

interface newTransactionProps {
  uid: string | number[];
  logbookId: string | number[];
}

/**
 *
 * function to create new transaction object
 *
 * @function newTransaction
 * @param props uid
 * @param props logbookId
 * @returns new transaction object
 *
 */
const newTransaction = (props: newTransactionProps) => {
  const transactionId = uuid.v4();
  return {
    uid: props.uid,
    transaction_id: transactionId,
    logbook_id: props.logbookId,
    repeat_id: null,
    details: {
      in_out: "expense",
      amount: 0,
      type: "cash",
      date: Date.now(),
      notes: null,
      category_id: null,
      attachment_URL: [],
    },
    _timestamps: {
      created_at: Date.now(),
      created_by: props.uid,
      updated_at: Date.now(),
      updated_by: props.uid,
    },
  } satisfies TransactionType;
};

export default newTransaction;
