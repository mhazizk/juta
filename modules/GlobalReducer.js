import AsyncStorage from "@react-native-async-storage/async-storage"

export const ACTIONS = {
    MULTI_ACTIONS: {
        SET_INIT_TRANSACTIONS: 'SET_INIT_TRANSACTIONS',
        SET_INIT_APP_SETTINGS: 'SET_INIT_APP_SETTINGS',
        SET_INIT_USER_ACCOUNT: 'SET_INIT_USER_ACCCOUNT'
    },
    SORTED_TRANSACTIONS: {
        GROUP_SORTED: {
            SET: 'SET_SORTED_TRANSACTIONS',

            CLEAR: 'CLEAR_SORTED_TRANSACTIONS'
        }
    },
    TRANSACTIONS: {
        SET: 'SET_TRANSACTIONS',
        INSERT: 'INSERT_TRANSACTION',
        PATCH: 'PATCH_TRANSACTION',
        LOAD: 'LOAD_TRANSACTIONS',
        DELETE_ONE: 'DELETE_ONE_TRANSACTIONS',
        DELETE_MANY: 'DELETE_MANY_TRANSACTIONS',
        CLEAR: 'CLEAR_TRANSACTIONS'
    },
    GROUPED_TRANSACTIONS: {
        SET: 'SET_GROUPED_TRANSACTIONS',
        LOAD: 'LOAD_GROUPED_TRANSACTIONS',
        CLEAR: 'CLEAR_GROUPED_TRANSACTIONS'
    },
    LOGBOOKS: {
        SET: 'SET_LOGBOOKS',
        LOAD: 'LOAD_LOGBOOKS',
        CLEAR: 'CLEAR_LOGBOOKS'
    },
    CATEGORIES: {
        SET: 'SET_CATEGORIES',
        LOAD: 'LOAD_CATEGORIES',
        CLEAR: 'CLEAR_CATEGORIES'
    },
    LOADING: {
        SET: 'SET_LOADING'
    },
    USER_ACCOUNT: {
        NICKNAME: {
            SET: 'SET_NICKNAME',
            LOAD: 'LOAD_NICKNAME',
            CLEAR: 'CLEAR_NICKNAME'
        },
        VERIFICATION: {
            SET: 'SET_VERIFICATION',
            CLEAR: 'CLEAR_VERFICATION'
        },
        EMAIL: {
            SET: 'SET_EMAIL',
            CLEAR: 'CLEAR_EMAIL'
        },
        AVATAR: {
            SET: 'SET_AVATAR',
            CLEAR: 'CLEAR_AVATAR'
        },
        TOKEN: {
            SET: 'SET_TOKEN',
            CLEAR: 'CLEAR_TOKEN'
        }
    },
    APP_SETTINGS: {
        THEME: {
            SET: 'SET_THEME',
            LOAD: 'LOAD_THEME',
            CLEAR: 'CLEAR_THEME'
        },
        FONT_SIZE: {
            SET: 'SET_FONT_SIZE',
            LOAD: 'LOAD_FONT_SIZE',
            CLEAR: 'CLEAR_FONT_SIZE'
        },
        LANGUAGE: {
            SET: 'SET_LANGUAGE',
            LOAD: 'LOAD_LANGUAGE',
            CLEAR: 'CLEAR_LANGUAGE'
        },
        LOCALE: {
            SET: 'SET_LOCALE',
            LOAD: 'LOAD_LOCALE',
            CLEAR: 'CLEAR_LOCALE'
        },
        CURRENCY: {
            SET: 'SET_CURRENCY',
            LOAD: 'LOAD_CURRENCY',
            CLEAR: 'CLEAR_CURRENCY'
        },
        DECIMALS: {
            SET: 'SET_DECIMALS'
        }
    }


}

export const initialSortedTransactions = {
    groupSorted: null,
    sortedTransactionsInsertCounter: 0,
    sortedTransactionsPatchCounter: 0,
    sortedTransactionsDeleteCounter: 0
    //     groupSorted: [
    //         {
    //             logbook1: [
    //                 {
    //                     title: 'date',
    //                     data: [
    //                         { transaction1 },
    //                         { transaction2 },
    //                         { transaction3 },
    //                     ]
    //                 },
    //                 {
    //                     title: 'date',
    //                     data: [
    //                         { transaction1 },
    //                         { transaction2 },
    //                         { transaction3 },
    //                     ]
    //                 },
    //             ]
    //         },
    //         {
    //             logbook2: [
    //                 {
    //                     title: 'date',
    //                     data: [
    //                         { transaction1 },
    //                         { transaction2 },
    //                         { transaction3 },
    //                     ]
    //                 },
    //                 {
    //                     title: 'date',
    //                     data: [
    //                         { transaction1 },
    //                         { transaction2 },
    //                         { transaction3 },
    //                     ]
    //                 },
    //             ]
    //         },
    //         { logbook3: [] }
    //     ]
}

export const initialTransactions = null
// {
//     transactions: null,
//     categories: null,
//     logbooks: null,
// }

export const initialAppSettings = null
// {
//     theme: null,
//     fontSize: null,
//     language: null,
//     locale: null,
//     currency: null,
// }

export const initialUserAccount = null
// {
//     profile: {
//         nickname: null,
//         avatar: null
//     },
//     account: {
//         verification: false,
//         token: null,
//         email: null
//     }
// }

export const initialLoading = {
    status: true
}

export const globalSortedTransactions = (state, action) => {
    switch (action.type) {
        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET:
            let array = [];
            let insert;
            let patch;
            let deleted;

            // if (action.payload) {
            action.payload.forEach(
                (logbook) => logbook.transactions.forEach(
                    (section) => section.data.forEach(
                        (transaction) => array.push(transaction.transaction_id))))
            // }

            // Increment insert counter
            if (!state.sortedTransactionsInsertCounter) {
                insert = 1
            } else {
                insert = state.sortedTransactionsInsertCounter + 1
            }

            // Increment patch counter
            if (!state.sortedTransactionsPatchCounter) {
                patch = 1
            } else {
                patch = state.sortedTransactionsPatchCounter + 1
            }

            // Increment delete counter
            if (!state.sortedTransactionsDeleteCounter) {
                deleted = 1
            } else {
                deleted = state.sortedTransactionsDeleteCounter + 1
            }


            return {
                groupSorted: action.payload,
                sortedTransactionsInsertCounter: insert,
                sortedTransactionsPatchCounter: patch,
                sortedTransactionsDeleteCounter: deleted
            }

        default:
            return state;
    }
}

export const globalTransactions = (state, action) => {

    switch (action.type) {

        // ! Transactions
        // Set Transactions
        case ACTIONS.TRANSACTIONS.SET:
            return {
                ...state,
                transactions: action.payload,
                transactionsPatchCounter: 0,
                transactionsInsertCounter: 0
            }
        // ! Insert New Transaction
        case ACTIONS.TRANSACTIONS.INSERT:

            let insertedArray = [...state.transactions, action.payload]
            let count;

            if (!state.transactionsInsertCounter) {
                count = 1
            } else {
                count = state.transactionsInsertCounter + 1
            }
            return {
                ...state,
                transactions: insertedArray,
                transactionsInsertCounter: count
            }

        // ! Patch Transaction
        case ACTIONS.TRANSACTIONS.PATCH:
            const filter = state.transactions.filter((transaction) => { return transaction.transaction_id !== action.payload.transaction_id })
            const pushed = [...filter, action.payload]
            let patched
            if (!state.transactionsPatchCounter) {
                patched = 1
            } else {
                patched = state.transactionsPatchCounter + 1
            }
            return {
                ...state,
                transactions: pushed,
                transactionsPatchCounter: patched,
            }

        // ! Delete One Transaction
        case ACTIONS.TRANSACTIONS.DELETE_ONE:
            const deleteFiltered = state.transactions.filter((transaction) => { return transaction.transaction_id !== action.payload })
            let deleted
            if (!state.transactionsDeleteCounter) {
                deleted = 1
            } else {
                deleted = state.transactionsDeleteCounter + 1
            }

            return {
                ...state,
                transactions: deleteFiltered,
                transactionsDeleteCounter: deleted
            }

        // ! Clear Transactions
        case ACTIONS.TRANSACTIONS.CLEAR:
            return { ...state, transactions: null }

        // ! Sorted Transactions
        // Set Transactions
        case ACTIONS.GROUPED_TRANSACTIONS.SET:
            return { ...state, groupedTransactions: action.payload }

        // ! Logbooks
        // Set Logbooks
        case ACTIONS.LOGBOOKS.SET:
            return {
                ...state,
                logbooks: action.payload,
                logbooksLength: action.payload.length
            }
        // Clear Logbooks
        case ACTIONS.LOGBOOKS.SET:
            return { ...state, logbooks: null }

        // ! Categories
        // Set Categories
        case ACTIONS.CATEGORIES.SET:
            return { ...state, categories: action.payload }
        // Clear Categories
        case ACTIONS.CATEGORIES.SET:
            return { ...state, categories: null }

        // ! Multiple Actions
        // Set Initial Transactions, Logbooks, and Catogories
        case ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload.transactions,
                transactionsPatchCounter: 0,
                transactionsInsertCounter: 0,
                transactionsDeleteCounter: 0,
                logbooks: action.payload.logbooks,
                logbooksPatchCounter: 0,
                logbooksLength: action.payload.logbooks.length,
                categories: action.payload.categories
            }

        default:
            return state;
    }
}

export const globalAppSettings = (state, action) => {
    switch (action.type) {

        // Set App Theme
        case ACTIONS.APP_SETTINGS.THEME.SET:
            return {
                ...state,
                theme: action.payload
            }
        // Set App Font Size
        case ACTIONS.APP_SETTINGS.FONT_SIZE.SET:
            return {
                ...state,
                fontSize: action.payload
            }
        // Set App Language
        case ACTIONS.APP_SETTINGS.LANGUAGE.SET:
            return {
                ...state,
                language: action.payload
            }

        // Set App Currency
        case ACTIONS.APP_SETTINGS.CURRENCY.SET:
            return {
                ...state,
                currency: action.payload
            }

        // ! Multiple Actions
        // Set Initial App Settings
        case ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS:
            return { ...state, ...action.payload }

        default:
            return state;
    }
}

export const globalUserAccount = (state, action) => {
    switch (action.type) {
        case ACTIONS.USER_ACCOUNT.AVATAR.SET:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    avatar: action.payload
                }
            }
        case ACTIONS.USER_ACCOUNT.NICKNAME.SET:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    nickname: action.payload
                }
            }
        case ACTIONS.USER_ACCOUNT.VERIFICATION.SET:
            return {
                ...state,
                account: {
                    ...state.account,
                    verification: action.payload
                }
            }
        case ACTIONS.USER_ACCOUNT.EMAIL.SET:
            return {
                ...state,
                account: {
                    ...state.account,
                    email: action.payload
                }
            }
        case ACTIONS.USER_ACCOUNT.TOKEN.SET:
            return {
                ...state,
                account: {
                    ...state.account,
                    token: action.payload
                }
            }

        // ! Multiple Actions
        // Set Initial User Account
        case ACTIONS.MULTI_ACTIONS.SET_INIT_USER_ACCOUNT:
            return { ...state, ...action.payload }


        default:
            return state;
    }
}


export const GlobalLoading = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOADING.SET:
            console.log(state)
            return { status: action.payload }
        default:
            return state
    }
}