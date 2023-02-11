import { createContext, useContext, useReducer, useState } from "react";
import globalAppSettingsReducer from "./globalAppSettingsReducer";
import globalBadgeCounterReducer from "./globalBadgeCounterReducer";
import globalBudgetsReducer from "./globalBudgetsReducer";
import globalCategoriesReducer from "./globalCategoriesReducer";
import globalCurrencyRatesReducer from "./globalCurrencyRatesReducer";
import globalFeatureWishlistReducer from "./globalFeatureWishlistReducer";
import globalLogbooksReducer from "./globalLogbooksReducer";
import globalRepeatedTransactionsReducer from "./globalRepeatedTransactionsReducer";
import globalSortedTransactionsReducer from "./globalSortedTransactionsReducer";
import globalThemeReducer from "./globalThemeReducer";
import globalUserAccountReducer from "./globalUserAccountReducer";
import initialAppSettings from "./initial-state/initialAppSettings";
import initialBadgeCounter from "./initial-state/initialBadgeCounter";
import initialBudgets from "./initial-state/initialBudgets";
import initialCategories from "./initial-state/initialCategories";
import initialFeatureWishlist from "./initial-state/initialFeatureWishlist";
import initialGlobalCurrencyRates from "./initial-state/initialGlobalCurrencyRates";
import initialGlobalTheme from "./initial-state/initialGlobalTheme";
import initialLogbooks from "./initial-state/initialLogbooks";
import initialRepeatedTransactions from "./initial-state/initialRepeatedTransactions";
import initialSortedTransactions from "./initial-state/initialSortedTransactions";
import initialUserAccount from "./initial-state/initialUserAccount";

// TAG : Create Context //
const globalTransactionsContext = createContext();
const globalBudgetsContext = createContext();
const globalSortedTransactionsContext = createContext();
const globalSettingsContext = createContext();
const globalUserAccountContext = createContext();
const globalLoadingContext = createContext();
const globalLogbooksContext = createContext();
const globalCategoriesContext = createContext();
const globalBadgeCounterContext = createContext();
const globalGroupsContext = createContext();
const globalRepeatedTransactionsContext = createContext();
const globalThemeContext = createContext();
const globalFeatureWishlistContext = createContext();
const globalCurrencyRatesContext = createContext();

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

export const useGlobalTheme = () => {
  return useContext(globalThemeContext);
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

export const useGlobalCurrencyRates = () => {
  return useContext(globalCurrencyRatesContext);
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
  const [globalTheme, dispatchGlobalTheme] = useReducer(
    globalThemeReducer,
    initialGlobalTheme
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
  const [globalCurrencyRates, dispatchGlobalCurrencyRates] = useReducer(
    globalCurrencyRatesReducer,
    initialGlobalCurrencyRates
  );

  // const [groups, dispatchGroups] = useReducer(globalGroups, initialGroups);

  return (
    <>
      <globalSettingsContext.Provider
        value={{
          appSettings: appSettings,
          dispatchAppSettings: dispatchAppSettings,
        }}
      >
        <globalThemeContext.Provider
          value={{
            globalTheme,
            dispatchGlobalTheme,
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
                    sortedTransactions: sortedTransactions,
                    dispatchSortedTransactions: dispatchSortedTransactions,
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
                          <globalCurrencyRatesContext.Provider
                            value={{
                              globalCurrencyRates,
                              dispatchGlobalCurrencyRates,
                            }}
                          >
                            {children}
                          </globalCurrencyRatesContext.Provider>
                        </globalFeatureWishlistContext.Provider>
                      </globalRepeatedTransactionsContext.Provider>
                    </globalBadgeCounterContext.Provider>
                  </globalBudgetsContext.Provider>
                </globalSortedTransactionsContext.Provider>
              </globalCategoriesContext.Provider>
            </globalLogbooksContext.Provider>
          </globalUserAccountContext.Provider>
        </globalThemeContext.Provider>
      </globalSettingsContext.Provider>
    </>
  );
};

export default GlobalStateProvider;
