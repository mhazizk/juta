import { createContext, useContext, useReducer } from "react";
import {
  globalAppSettings,
  globalBudgets,
  globalCategories,
  GlobalLoading,
  globalLogbooks,
  globalSortedTransactions,
  globalTransactions,
  globalUserAccount,
  initialLoading,
  initialTransactions,
  initialUserAccount,
} from "./GlobalReducer";
import initialAppSettings from "./initial-state/InitialAppSettings";
import { InitialBudgets } from "./initial-state/InitialBudgets";
import initialCategories from "./initial-state/InitialCategories";
import initialLogbooks from "./initial-state/InitialLogbooks";
import InitialSortedTransactions from "./initial-state/InitialSortedTransactions";

// TAG : Create Context //
const GlobalTransactionsContext = createContext();
const GlobalBudgetsContext = createContext();
const GlobalSortedTransactionsContext = createContext();
const GlobalSettingsContext = createContext();
const GlobalUserAccountContext = createContext();
const GlobalLoadingContext = createContext();
const GlobalLogbooksContext = createContext();
const GlobalCategoriesContext = createContext();

// TAG : useContext //
export const useGlobalTransactions = () => {
  return useContext(GlobalTransactionsContext);
};

export const useGlobalLogbooks = () => {
  return useContext(GlobalLogbooksContext);
};

export const useGlobalCategories = () => {
  return useContext(GlobalCategoriesContext);
};

export const useGlobalSortedTransactions = () => {
  return useContext(GlobalSortedTransactionsContext);
};

export const useGlobalBudgets = () => {
  return useContext(GlobalBudgetsContext);
};

export const useGlobalAppSettings = () => {
  return useContext(GlobalSettingsContext);
};

export const useGlobalUserAccount = () => {
  return useContext(GlobalUserAccountContext);
};

export const useGlobalLoading = () => {
  return useContext(GlobalLoadingContext);
};

// TAG : Context Provider //
export const GlobalStateProvider = ({ children }) => {
  const [userAccount, dispatchUserAccount] = useReducer(
    globalUserAccount,
    initialUserAccount
  );
  const [appSettings, dispatchAppSettings] = useReducer(
    globalAppSettings,
    initialAppSettings
  );
  const [isLoading, dispatchLoading] = useReducer(
    GlobalLoading,
    initialLoading
  );
  const [sortedTransactions, dispatchSortedTransactions] = useReducer(
    globalSortedTransactions,
    InitialSortedTransactions
  );
  const [logbooks, dispatchLogbooks] = useReducer(
    globalLogbooks,
    initialLogbooks
  );
  const [categories, dispatchCategories] = useReducer(
    globalCategories,
    initialCategories
  );
  const [rawTransactions, dispatchRawTransactions] = useReducer(
    globalTransactions,
    initialTransactions
  );

  const [budgets, dispatchBudgets] = useReducer(globalBudgets, InitialBudgets);

  return (
    <>
      <GlobalLoadingContext.Provider
        value={{ isLoading: isLoading, dispatchLoading: dispatchLoading }}
      >
        <GlobalSettingsContext.Provider
          value={{
            appSettings: appSettings,
            dispatchAppSettings: dispatchAppSettings,
          }}
        >
          <GlobalUserAccountContext.Provider
            value={{
              userAccount: userAccount,
              dispatchUserAccount: dispatchUserAccount,
            }}
          >
            <GlobalTransactionsContext.Provider
              value={{
                rawTransactions: rawTransactions,
                dispatchRawTransactions: dispatchRawTransactions,
              }}
            >
              <GlobalLogbooksContext.Provider
                value={{
                  logbooks: logbooks,
                  dispatchLogbooks: dispatchLogbooks,
                }}
              >
                <GlobalCategoriesContext.Provider
                  value={{
                    categories: categories,
                    dispatchCategories: dispatchCategories,
                  }}
                >
                  <GlobalSortedTransactionsContext.Provider
                    value={{
                      sortedTransactions: sortedTransactions,
                      dispatchSortedTransactions: dispatchSortedTransactions,
                    }}
                  >
                    <GlobalBudgetsContext.Provider
                      value={{
                        budgets: budgets,
                        dispatchBudgets: dispatchBudgets,
                      }}
                    >
                      {children}
                    </GlobalBudgetsContext.Provider>
                  </GlobalSortedTransactionsContext.Provider>
                </GlobalCategoriesContext.Provider>
              </GlobalLogbooksContext.Provider>
            </GlobalTransactionsContext.Provider>
          </GlobalUserAccountContext.Provider>
        </GlobalSettingsContext.Provider>
      </GlobalLoadingContext.Provider>
    </>
  );
};

export default GlobalStateProvider;
