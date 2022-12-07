import { createContext, useContext, useReducer } from "react"
import { globalAppSettings, globalCategories, GlobalLoading, globalLogbooks, globalSortedTransactions, globalTransactions, globalUserAccount, initialLoading, initialSortedTransactions, initialTransactions, initialUserAccount } from "./GlobalReducer";
import initialAppSettings from "./InitialAppSettings";
import initialCategories from "./InitialCategories";
import initialLogbooks from "./InitialLogbooks";

// ! Create Context //
const GlobalTransactionsContext = createContext();
const GlobalSortedTransactionsContext = createContext();
const GlobalSettingsContext = createContext();
const GlobalUserAccountContext = createContext();
const GlobalLoadingContext = createContext();
const GlobalLogbooksContext = createContext();
const GlobalCategoriesContext = createContext();

// ! useContext //
export const useGlobalTransactions = () => {
    return useContext(GlobalTransactionsContext);
}

export const useGlobalLogbooks = () => {
    return useContext(GlobalLogbooksContext);
}

export const useGlobalCategories = () => {
    return useContext(GlobalCategoriesContext);
}

export const useGlobalSortedTransactions = () => {
    return useContext(GlobalSortedTransactionsContext);
}

export const useGlobalAppSettings = () => {
    return useContext(GlobalSettingsContext)
}

export const useGlobalUserAccount = () => {
    return useContext(GlobalUserAccountContext)
}

export const useGlobalLoading = () => {
    return useContext(GlobalLoadingContext)
}

// ! Context Provider //
export const GlobalStateProvider = ({ children }) => {
    const [userAccount, dispatchUserAccount] = useReducer(globalUserAccount, initialUserAccount);
    const [appSettings, dispatchAppSettings] = useReducer(globalAppSettings, initialAppSettings);
    const [isLoading, dispatchLoading] = useReducer(GlobalLoading, initialLoading);
    const [sortedTransactions, dispatchSortedTransactions] = useReducer(globalSortedTransactions, initialSortedTransactions);
    const [logbooks, dispatchLogbooks] = useReducer(globalLogbooks, initialLogbooks);
    const [categories, dispatchCategories] = useReducer(globalCategories, initialCategories);
    const [rawTransactions, dispatchRawTransactions] = useReducer(globalTransactions, initialTransactions);

    return (
        <>
            <GlobalLoadingContext.Provider value={{ isLoading: isLoading, dispatchLoading: dispatchLoading }}>
                <GlobalSettingsContext.Provider value={{ appSettings: appSettings, dispatchAppSettings: dispatchAppSettings }}>
                    <GlobalUserAccountContext.Provider value={{ userAccount: userAccount, dispatchUserAccount: dispatchUserAccount }} >
                        <GlobalTransactionsContext.Provider value={{ rawTransactions: rawTransactions, dispatchRawTransactions: dispatchRawTransactions }}>
                            <GlobalLogbooksContext.Provider value={{ logbooks: logbooks, dispatchLogbooks: dispatchLogbooks }}>
                                <GlobalCategoriesContext.Provider value={{ categories: categories, dispatchCategories: dispatchCategories }}>
                                    <GlobalSortedTransactionsContext.Provider value={{ sortedTransactions: sortedTransactions, dispatchSortedTransactions: dispatchSortedTransactions }}>
                                        {children}
                                    </GlobalSortedTransactionsContext.Provider>
                                </GlobalCategoriesContext.Provider>
                            </GlobalLogbooksContext.Provider>
                        </GlobalTransactionsContext.Provider>
                    </GlobalUserAccountContext.Provider>
                </GlobalSettingsContext.Provider>
            </GlobalLoadingContext.Provider>
        </>
    )
}

export default GlobalStateProvider;

