import { LogbookCurrencyType } from "./logbook.d";
import { TimestampsType } from "./timestamps";

/**
 *
 * Global logbooks type
 * @type GlobalLogbook
 * @property {number} reducerUpdatedAt - timestamp in milliseconds
 * @property {string} logbooks - logbooks
 *
 */
export type GlobalLogbook = {
  reducerUpdatedAt: number; // timestamp in milliseconds
  logbooks: LogbookType[];
};

/**
 *
 * Type for logbook to open
 *
 * @type LogbookToOpenType
 * @property {string} name - logbook name
 * @property {string} logbook_id - logbook id
 * @property {string} logbook_name - logbook name
 * @property {Object} logbook_currency - logbook currency
 *
 */
export type LogbookToOpenType = {
  name: string;
  logbook_id: string | number[];
  logbook_name: string;
  logbook_currency: LogbookCurrencyType;
};

/**
 *
 * Type for logbook
 *
 * @type LogbookType
 * @property {string} uid - user id
 * @property {string} group_id - group id
 * @property {string} logbook_id - logbook id
 * @property {string} logbook_name - logbook name
 *
 */
export type LogbookType = {
  uid: string | number[];
  group_id: string | number[] | null;
  logbook_id: string | number[];
  logbook_name: string;
  logbook_type: string | null;
  logbook_currency: LogbookCurrencyType;
  _timestamps: TimestampsType;
};

/**
 *
 * Logbook currency type
 * @interface LogbookCurrencyType
 * @property {string} isocode - currency isocode
 * @property {string} symbol - currency symbol
 * @property {string} name - currency name
 *
 */
export type LogbookCurrencyType = {
  isocode: "id" | "en";
  symbol: "Rp" | "$";
  name: "IDR" | "USD";
};
