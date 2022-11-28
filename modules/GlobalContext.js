import { createContext, useContext, useReducer } from "react"
import { globalAppSettings, globalTransactions, globalUserAccount, initialAppSettings, initialTransactions, initialUserAccount as initialUserAccount } from "./GlobalReducer";

// ! Create Context //
const GlobalTransactionsContext = createContext();
const GlobalSettingsContext = createContext();
const GlobalUserAccountContext = createContext();

// ! useContext //
export const useGlobalTransactions = () => {
    return useContext(GlobalTransactionsContext);
}

export const useGlobalAppSettings = () => {
    return useContext(GlobalSettingsContext)
}

export const useGlobalUserAccount = () => {
    return useContext(GlobalUserAccountContext)
}

// ! Context Provider //
export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalTransactions, initialTransactions);
    const [appSettings, dispatchAppSettings] = useReducer(globalAppSettings, initialAppSettings);
    const [userAccount, dispatchUserAccount] = useReducer(globalUserAccount, initialUserAccount);

    return (
        <>
            <GlobalSettingsContext.Provider value={{ appSettings: appSettings, dispatchAppSettings: dispatchAppSettings }}>
                <GlobalUserAccountContext.Provider value={{ userAccount: userAccount, dispatchUserAccount: dispatchUserAccount }} >
                    <GlobalTransactionsContext.Provider value={{ state: state, dispatch: dispatch }}>
                        {children}
                    </GlobalTransactionsContext.Provider>
                </GlobalUserAccountContext.Provider>
            </GlobalSettingsContext.Provider>
        </>
    )
}


