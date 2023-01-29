import { ITimestamps } from "./timestamps.d";

/**
 * interface for transaction object
 *
 * @interface ITransaction
 * @property {string} id - transaction id
 * @property {string} logbook_id - logbook id
 * @property {string} transaction_id - transaction id
 * @property {Object} details - transaction details
 * @property {string} details.in_out - transaction type (income or expense)
 * @property {number} details.amount - transaction amount
 * @property {string} details.type - transaction type (cash, card, etc.)
 * @property {number} details.date - transaction date
 * @property {string} details.notes - transaction notes
 * @property {string} details.category_id - transaction category id
 * @property {Object} _timestamps - transaction timestamps
 * @property {number} _timestamps.created_at - transaction created at timestamp
 * @property {string} _timestamps.created_by - transaction created by user id
 * @property {number} _timestamps.updated_at - transaction updated at timestamp
 * @property {string} _timestamps.updated_by - transaction updated by user id
 */
export interface ITransaction {
  uid: string | number[];
  logbook_id: string | number[];
  transaction_id: string | number[];
  repeat_id: string | number[] | null;
  details: {
    in_out: string;
    amount: number;
    type: string;
    date: number;
    notes: string | null;
    category_id: number;
    attachment_URL: string[];
  };
  _timestamps: ITimestamps;
}
