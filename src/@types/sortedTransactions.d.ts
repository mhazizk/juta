import { ILogbookToOpen } from "./logbook";
import { ITransaction } from "./transactions";

/**
 *
 * interface for global sorted transactions state
 * @interface IGlobalSortedTransactions
 * @property {Object} sortedTransactions - sorted transactions
 * @property {number} reducerUpdatedAt - timestamp in milliseconds
 *
 */
export interface IGlobalSortedTransactions {
  reducerUpdatedAt: number; // timestamp in milliseconds
  logbookToOpen: ILogbookToOpen | null;
  groupSorted: ILogbookInSortedTransactions[];
}

/**
 *
 * interface for logbook in sorted transactions
 * @interface ILogbookInSortedTransactions
 * @property {string} logbook_id - logbook id
 * @property {Object} transactions - array of section date
 *
 * */
interface ILogbookInSortedTransactions {
  logbook_id: string | number[];
  transactions: IDateSectionInSortedTransactions[];
}

/**
 *
 * interface for section date in sorted transactions
 * @interface IDateSectionInSortedTransactions
 * @property {string} title - section title
 * @property {string} customDate - section custom date
 * @property {Object} data - array of transaction
 *
 * */
interface IDateSectionInSortedTransactions {
  title: string;
  customDate: string;
  data: ITransaction[];
}

// type ActionMap<M extends { [index: string]: any }> = {
//   [Key in keyof M]: M[Key] extends undefined
//     ? {
//         type: Key;
//       }
//     : {
//         type: Key;
//         payload: M[Key];
//       };
// };

// type ProductPayload = {
//   [Types.Create]: {
//     id: number;
//     name: string;
//     price: number;
//   };
//   [Types.Delete]: {
//     id: number;
//   };
// };

// export type ProductActions =
//   ActionMap<ProductPayload>[keyof ActionMap<ProductPayload>];
