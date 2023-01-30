import { TimestampsType } from "./timestamps.d";

/**
 * Type for transaction
 *
 * @type TransactionType
 * @property {string} id - transaction id
 * @property {string} logbook_id - logbook id
 * @property {string} transaction_id - transaction id
 * @property {Object} details - transaction details
 * @property {string} in_out - transaction type 'income' or 'expense'
 * @property {number} amount - transaction amount
 * @property {string} type - transaction type 'cash' or 'loan'
 * @property {number} date - transaction date
 * @property {string} notes - transaction notes
 * @property {string} category_id - transaction category id
 * @property {string} attachmentURL - attachment URL from uploaded file to firebase storage
 * @property {Object} _timestamps - transaction timestamps
 */
export type TransactionType = {
  uid: string | number[];
  logbook_id: string | number[];
  transaction_id: string | number[];
  repeat_id: string | number[] | null;
  details: {
    in_out: "income" | "expense";
    amount: number;
    type: "cash" | "loan";
    date: number;
    notes: string | null;
    category_id: number;
    attachment_URL: string[];
  };
  _timestamps: TimestampsType;
};
