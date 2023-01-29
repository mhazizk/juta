import { IGlobalSortedTransactions } from "../../@types/sortedTransactions";

const initialSortedTransactions = {
  reducerUpdatedAt: Date.now(),
  logbookToOpen: null,
  groupSorted: [],
} satisfies IGlobalSortedTransactions;

export default initialSortedTransactions;
