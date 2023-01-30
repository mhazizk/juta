import { GlobalSortedTransactionsType } from "../../@types/sortedTransactions";

const initialSortedTransactions = {
  reducerUpdatedAt: Date.now(),
  logbookToOpen: null,
  groupSorted: [],
} satisfies GlobalSortedTransactionsType;

export default initialSortedTransactions;
