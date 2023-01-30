import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from "react";
import { GlobalAppSettingsType } from "../@types/appSettings";
import { GlobalBudgetsType } from "../@types/budgets";
import { GlobalCategoriesType } from "../@types/categories";
import { GlobalLogbook } from "../@types/logbook";
import { GlobalSortedTransactionsType } from "../@types/sortedTransactions";
import { GlobalUserAccountType } from "../@types/userAccount";
import globalAppSettingsReducer from "./globalAppSettingsReducer";
import globalBadgeCounterReducer from "./globalBadgeCounterReducer";
import globalBudgetsReducer from "./globalBudgetsReducer";
import globalCategoriesReducer from "./globalCategoriesReducer";
import globalFeatureWishlistReducer from "./globalFeatureWishlistReducer";
import globalLogbooksReducer from "./globalLogbooksReducer";
import globalRepeatedTransactionsReducer from "./globalRepeatedTransactionsReducer";
import globalSortedTransactionsReducer from "./globalSortedTransactionsReducer";
import globalUserAccountReducer from "./globalUserAccountReducer";
import initialAppSettings from "./initial-state/initialAppSettings";
import initialBadgeCounter from "./initial-state/initialBadgeCounter";
import initialBudgets from "./initial-state/initialBudgets";
import initialCategories from "./initial-state/initialCategories";
import initialFeatureWishlist from "./initial-state/initialFeatureWishlist";
import initialLogbooks from "./initial-state/initialLogbooks";
import initialRepeatedTransactions from "./initial-state/initialRepeatedTransactions";
import initialSortedTransactions from "./initial-state/initialSortedTransactions";
import initialUserAccount from "./initial-state/initialUserAccount";

// TAG : Create Context //
const globalTransactionsContext = createContext();
const globalBudgetsContext = createContext<{
  budgets: GlobalBudgetsType;
  dispatchBudgets: Dispatch<any>;
}>({
  budgets: initialBudgets,
  dispatchBudgets: () => null,
});
const globalSortedTransactionsContext = createContext<{
  sortedTransactions: GlobalSortedTransactionsType;
  dispatchSortedTransactions: Dispatch<any>;
}>({
  sortedTransactions: initialSortedTransactions,
  dispatchSortedTransactions: () => null,
});
const globalSettingsContext = createContext<{
  appSettings: GlobalAppSettingsType;
  dispatchAppSettings: Dispatch<any>;
}>({
  appSettings: initialAppSettings,
  dispatchAppSettings: () => null,
});
const globalUserAccountContext = createContext<{
  userAccount: GlobalUserAccountType;
  dispatchUserAccount: Dispatch<any>;
}>({
  userAccount: initialUserAccount,
  dispatchUserAccount: () => null,
});
const globalLoadingContext = createContext();
const globalLogbooksContext = createContext<{
  logbooks: GlobalLogbook;
  dispatchLogbooks: Dispatch<any>;
}>({
  logbooks: initialLogbooks,
  dispatchLogbooks: () => null,
});
const globalCategoriesContext = createContext<{
  categories: GlobalCategoriesType;
  dispatchCategories: Dispatch<any>;
}>({
  categories: initialCategories,
  dispatchCategories: () => null,
});
const globalBadgeCounterContext = createContext();
const globalGroupsContext = createContext();
const globalRepeatedTransactionsContext = createContext();
const globalFeatureWishlistContext = createContext();

// TAG : useContext //
export const useGlobalTransactions = () => {
  return useContext(globalTransactionsContext);
};

export const useGlobalLogbooks = () => {
  return useContext(globalLogbooksContext);
};

export const useGlobalCategories = () => {
  return useContext(globalCategoriesContext);
};

export const useGlobalSortedTransactions = () => {
  return useContext(globalSortedTransactionsContext);
};

export const useGlobalBudgets = () => {
  return useContext(globalBudgetsContext);
};

export const useGlobalAppSettings = () => {
  return useContext(globalSettingsContext);
};

export const useGlobalUserAccount = () => {
  return useContext(globalUserAccountContext);
};

export const useGlobalLoading = () => {
  return useContext(globalLoadingContext);
};

export const useGlobalBadgeCounter = () => {
  return useContext(globalBadgeCounterContext);
};

export const useGlobalGroups = () => {
  return useContext(globalGroupsContext);
};

export const useGlobalRepeatedTransactions = () => {
  return useContext(globalRepeatedTransactionsContext);
};

export const useGlobalFeatureWishlist = () => {
  return useContext(globalFeatureWishlistContext);
};

type GlobalStateProviderProps = {
  children: ReactNode;
};

// TAG : Context Provider //
export const GlobalStateProvider = ({ children }) => {
  const [userAccount, dispatchUserAccount] = useReducer(
    globalUserAccountReducer,
    initialUserAccount
  );
  const [appSettings, dispatchAppSettings] = useReducer(
    globalAppSettingsReducer,
    initialAppSettings
  );
  const [sortedTransactions, dispatchSortedTransactions] = useReducer(
    globalSortedTransactionsReducer,
    initialSortedTransactions
  );
  const [logbooks, dispatchLogbooks] = useReducer(
    globalLogbooksReducer,
    initialLogbooks
  );
  const [categories, dispatchCategories] = useReducer(
    globalCategoriesReducer,
    initialCategories
  );

  const [globalFeatureWishlist, dispatchGlobalFeatureWishlist] = useReducer(
    globalFeatureWishlistReducer,
    initialFeatureWishlist
  );

  const [budgets, dispatchBudgets] = useReducer(
    globalBudgetsReducer,
    initialBudgets
  );

  const [badgeCounter, dispatchBadgeCounter] = useReducer(
    globalBadgeCounterReducer,
    initialBadgeCounter
  );

  const [repeatedTransactions, dispatchRepeatedTransactions] = useReducer(
    globalRepeatedTransactionsReducer,
    initialRepeatedTransactions
  );

  // const [groups, dispatchGroups] = useReducer(globalGroups, initialGroups);
  const [isFirstTime, setIsFirstTime] = useState(true); // Maybe not needed

  return (
    <globalSettingsContext.Provider
      value={{
        appSettings: appSettings,
        dispatchAppSettings: dispatchAppSettings,
      }}
    >
      <globalUserAccountContext.Provider
        value={{
          userAccount: userAccount,
          dispatchUserAccount: dispatchUserAccount,
        }}
      >
        <globalLogbooksContext.Provider
          value={{
            logbooks: logbooks,
            dispatchLogbooks: dispatchLogbooks,
          }}
        >
          <globalCategoriesContext.Provider
            value={{
              categories: categories,
              dispatchCategories: dispatchCategories,
            }}
          >
            <globalSortedTransactionsContext.Provider
              value={{
                sortedTransactions,
                dispatchSortedTransactions,
              }}
            >
              <globalBudgetsContext.Provider
                value={{
                  budgets: budgets,
                  dispatchBudgets: dispatchBudgets,
                }}
              >
                <globalBadgeCounterContext.Provider
                  value={{
                    badgeCounter: badgeCounter,
                    dispatchBadgeCounter: dispatchBadgeCounter,
                  }}
                >
                  <globalRepeatedTransactionsContext.Provider
                    value={{
                      repeatedTransactions: repeatedTransactions,
                      dispatchRepeatedTransactions:
                        dispatchRepeatedTransactions,
                    }}
                  >
                    <globalFeatureWishlistContext.Provider
                      value={{
                        globalFeatureWishlist: globalFeatureWishlist,
                        dispatchGlobalFeatureWishlist:
                          dispatchGlobalFeatureWishlist,
                      }}
                    >
                      {children}
                    </globalFeatureWishlistContext.Provider>
                  </globalRepeatedTransactionsContext.Provider>
                </globalBadgeCounterContext.Provider>
              </globalBudgetsContext.Provider>
            </globalSortedTransactionsContext.Provider>
          </globalCategoriesContext.Provider>
        </globalLogbooksContext.Provider>
      </globalUserAccountContext.Provider>
    </globalSettingsContext.Provider>
  );
};

export default GlobalStateProvider;
