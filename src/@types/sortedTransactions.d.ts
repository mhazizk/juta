import { LogbookToOpenType } from "./logbook";
import { TransactionType } from "./transactions";

/**
 *
 * Type for sorted transactions
 *
 * @type GlobalSortedTransactionsType
 * @property {number} reducerUpdatedAt - timestamp in milliseconds
 * @property {Object} logbookToOpen - logbook to open when logbook screen is opened
 * @property {Object} groupSorted - transactions sorted in group
 *
 */
export type GlobalSortedTransactionsType = {
  reducerUpdatedAt: number;
  logbookToOpen: LogbookToOpenType | null;
  groupSorted: GroupSortedLogbook[];
};

/**
 *
 * interface for logbook in sorted transactions
 * @interface ILogbookInSortedTransactions
 * @property {string} logbook_id - logbook id
 * @property {Object} transactions - array of section date
 *
 * */
type GroupSortedLogbook = {
  logbook_id: string | number[];
  transactions: DateSectionType[];
};

/**
 *
 * Type for section date
 *
 * @type DateSectionType
 * @property {string} title - section title
 * @property {string} customDate - section custom date
 * @property {Object} data - array of transaction
 *
 * */
type DateSectionType = {
  title: string;
  customDate: string;
  data: TransactionType[];
};
