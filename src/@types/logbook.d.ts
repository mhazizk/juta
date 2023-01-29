import { ITimestamps } from "./timestamps";

/**
 *
 * interface for global logbook state
 * @interface IGlobalLogbook
 * @property {Object} logbooks - logbooks
 * @property {number} reducerUpdatedAt - timestamp in milliseconds
 * @property {string} logbooks - logbooks
 *
 */
export interface IGlobalLogbook {
  reducerUpdatedAt: number; // timestamp in milliseconds
  logbooks: ILogbook[];
}

/**
 *
 * interface logbook to be open in sorted transactions
 * @interface ILogbookToOpen
 * @property {string} name - logbook name
 * @property {string} logbook_id - logbook id
 * @property {string} logbook_name - logbook name
 * @property {Object} logbook_currency - logbook currency
 *
 */
export interface ILogbookToOpen {
  name: string;
  logbook_id: string | number[];
  logbook_name: string;
  logbook_currency: ILogbookCurrency;
}

/**
 *
 * interface for logbook
 * @interface ILogbook
 * @property {string} logbook_id - logbook id
 * @property {string} logbook_name - logbook name
 *
 */
export interface ILogbook {
  uid: string | number[];
  group_id: string | number[] | null;
  logbook_id: string | number[];
  logbook_name: string;
  logbook_type: string | null;
  logbook_currency: ILogbookCurrency;
  _timestamps: ITimestamps;
}

/**
 *
 * interface for logbook currency
 * @interface ILogbookCurrency
 * @property {string} isocode - currency isocode
 * @property {string} symbol - currency symbol
 * @property {string} name - currency name
 *
 */
export interface ILogbookCurrency {
  isocode: string;
  symbol: string;
  name: string;
}
