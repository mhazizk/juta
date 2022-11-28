import { useContext } from "react";
import userCategories from "../database/userCategories";
import userLogBooks from "../database/userLogBooks";
import { GlobalSettingsContext, useGlobalUserAccount, useGlobalAppSettings, useGlobalTransactions } from "./GlobalContext";
import { ACTIONS } from "./GlobalReducer";

// Get Transaction File from storage
const getFileFromStorage = async () => {
    try {
        const json = await AsyncStorage.getItem('trx');
        if (json != null) {
            return parsed = JSON.parse(json)
        }
    } catch (error) {
        alert(error)
    }
}

// ! Set Initial App Settings //
export const SetInitialAppSettings = () => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    dispatchAppSettings({
        type: ACTIONS.APP_SETTINGS.THEME.SET,
        payload: 'light'
    });
    dispatchAppSettings({
        type: ACTIONS.APP_SETTINGS.LANGUAGE.SET,
        payload: 'english'
    });
    dispatchAppSettings({
        type: ACTIONS.APP_SETTINGS.FONT_SIZE.SET,
        payload: 'medium'
    })

}
// ! Set Initial User Account //
export const SetInitialUserAccount = () => {
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

    dispatchUserAccount({
        type: ACTIONS.USER_ACCOUNT.NICKNAME.SET,
        payload: 'Haziz'
    })
    dispatchUserAccount({
        type: ACTIONS.USER_ACCOUNT.EMAIL.SET,
        payload: 'mhazizk@gmail.com'
    })
    dispatchUserAccount({
        type: ACTIONS.USER_ACCOUNT.TOKEN.SET,
        payload: '123456789'
    })
    dispatchUserAccount({
        type: ACTIONS.USER_ACCOUNT.VERIFICATION.SET,
        payload: true
    })
}

// ! Set Initial Transactions
export const SetInitialTransactions = () => {
    const { state, dispatch } = useGlobalTransactions();


    dispatch({
        type: ACTIONS.TRANSACTIONS.SET,
        payload: getFileFromStorage()
    })


    dispatch({
        type: ACTIONS.LOGBOOKS.SET,
        payload: userLogBooks
    });
    dispatch({
        type: ACTIONS.CATEGORIES.SET,
        payload: userCategories
    });
}

