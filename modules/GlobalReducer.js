import AsyncStorage from "@react-native-async-storage/async-storage"

const sortTransactions = (prevTransaction, currentTransaction) => {
    if (prevTransaction.details.date < currentTransaction.details.date) {
        return 1;
    }
    if (prevTransaction.details.date > currentTransaction.details.date) {
        return -1;
    }
    return 0;
}

const sortLogbookTransactions = (prevDateTransaction, currentDateTransaction) => {
    if (prevDateTransaction.customDate < currentDateTransaction.customDate) {
        return 1;
    }
    if (prevDateTransaction.customDate > currentDateTransaction.customDate) {
        return -1;
    }
    return 0;
}


export const ACTIONS = {
    MULTI_ACTIONS: {
        SET_INIT_TRANSACTIONS: 'SET_INIT_TRANSACTIONS',
        SET_INIT_APP_SETTINGS: 'SET_INIT_APP_SETTINGS',
        SET_INIT_USER_ACCOUNT: 'SET_INIT_USER_ACCCOUNT'
    },
    SORTED_TRANSACTIONS: {
        GROUP_SORTED: {
            SET: 'SET_SORTED_TRANSACTIONS',
            INSERT_TRANSACTION: 'INSERT_SORTED_TRANSACTIONS',
            PATCH_TRANSACTION: 'PATCH_SORTED_TRANSACTIONS',
            DELETE_ONE_TRANSACTION: 'DELETE_ONE_TRANSACTION',
            CLEAR_TRANSACTIONS: 'CLEAR_SORTED_TRANSACTIONS',
            INSERT_LOGBOOK: 'INSERT_SORTED_LOGBOOK',
            DELETE_ONE_LOGBOOK: 'DELETE_SORTED_ONE_LOGBOOK'
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
        INSERT: 'INSERT_LOGBOOK',
        PATCH: 'PATCH_LOGBOOK',
        DELETE_ONE: 'DELETE_ONE_LOGBOOK',
        CLEAR: 'CLEAR_LOGBOOKS'
    },
    CATEGORIES: {
        SET: 'SET_CATEGORIES',
        LOAD: 'LOAD_CATEGORIES',
        INSERT: 'INSERT_CATEGORY',
        PATCH: 'PATCH_CATEGORY',
        DELETE_ONE: 'DELETE_ONE_CATEGORY',
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
        },
        SCREEN_HIDDEN: {
            PUSH: 'PUSH_SCREEN_HIDDEN'
        }
    }


}

export const initialSortedTransactions = {
    sortedTransactionsInitCounter: 0,
    sortedTransactionsInsertCounter: 0,
    sortedTransactionsPatchCounter: 0,
    sortedTransactionsDeleteCounter: 0,
    sortedLogbookInsertCounter: 0,
    sortedLogbookDeleteCounter: 0,
    logbookToOpen: null,
    groupSorted: null
}

export const initialTransactions = null
// {
//     transactions: null,
//     categories: null,
//     logbooks: null,
// }



export const initialUserAccount = null
// {
//     profile: {
//         nickname: null,
//         avatar: null
//     },
//     account: {
//         verification: false,
//         user_id: null,
//         token: null,
//         email: null
//     }
// }

export const initialLoading = {
    status: true
}

export const globalLogbooks = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOGBOOKS.INSERT:

            return {
                ...state,
                logbookInsertCounter: state.logbookInsertCounter + 1,
                logbooks: [...state.logbooks, action.payload]
            }

        case ACTIONS.LOGBOOKS.DELETE_ONE:

            let deleteLogbook = action.payload

            let foundOtherLogbook = state.logbooks.filter((logbook) => logbook.logbook_id !== deleteLogbook.logbook_id)

            return {
                ...state,
                logbookDeleteCounter: state.logbookDeleteCounter + 1,
                logbooks: [...foundOtherLogbook]
            }

        case ACTIONS.LOGBOOKS.PATCH:

            let patchLogbook = action.payload
            // console.log(patchLogbook)
            const foundLogbook = state.logbooks.filter((logbook) => logbook.logbook_id === patchLogbook.logbook_id)
            foundOtherLogbook = state.logbooks.filter((logbook) => logbook.logbook_id !== patchLogbook.logbook_id)
            console.log(foundOtherLogbook)
            // TODO REPLACE LOGBOOK WITH PATCHED ONE AND REPLACE ALL TRANSACTIONS IN IT WITH THE NEW LOGBBOK

            return {
                ...state,
                logbooks: [...foundOtherLogbook, patchLogbook],
                logbookPatchCounter: state.logbookPatchCounter + 1
            }

        default:
            return state
    }
}


export const globalCategories = (state, action) => {
    switch (action.type) {
        case ACTIONS.CATEGORIES.INSERT:

            return {
                ...state,
                categoryInsertCounter: state.categoryInsertCounter + 1,
                categories: action.payload
            }

        case ACTIONS.CATEGORIES.DELETE_ONE:

            let deleteCategory = action.payload


            return {
                ...state,
                categoryDeleteCounter: state.categoryDeleteCounter + 1,
                categories: action.payload,
            }

        case ACTIONS.CATEGORIES.PATCH:

            let patchCategory = action.payload

            // TODO REPLACE CATEGORY WITH PATCHED ONE AND REPLACE ALL TRANSACTIONS IN IT WITH THE NEW LOGBBOK

            return {
                ...state,
                categoryPatchCounter: state.categoryPatchCounter + 1,
                categories: action.payload
            }

        default:
            return state
    }
}

export const globalSortedTransactions = (state, action) => {
    switch (action.type) {

        // ! Delete One Logbook
        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_LOGBOOK:
            const deleteLogbook = action.payload
            let filterOtherLogbooks = state.groupSorted.filter((logbook) => logbook.logbook_id !== deleteLogbook.logbook_id)
            console.log('reducer')
            return {
                ...state,
                groupSorted: [...filterOtherLogbooks],
                logbookToOpen: null,
                sortedLogbookDeleteCounter: state.sortedLogbookDeleteCounter + 1
            }

        // ! Insert New Logbook
        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_LOGBOOK:
            let newLogbook = action.payload.newLogbook

            const newGroupSortedToBeReplaced = [
                ...state.groupSorted, newLogbook
            ]

            console.log(newGroupSortedToBeReplaced)
            return {
                ...state,
                sortedLogbookInsertCounter: state.sortedLogbookInsertCounter + 1,
                groupSorted: newGroupSortedToBeReplaced,
                logbookToOpen: action.payload.logbookToOpen
            }

        // ! Set Initial Sorted Transactions
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
                sortedTransactionsInitCounter: state.sortedTransactionsInitCounter + 1,
                sortedTransactionsInsertCounter: state.sortedTransactionsInsertCounter || 0,
                sortedTransactionsPatchCounter: state.sortedTransactionsPatchCounter || 0,
                sortedTransactionsDeleteCounter: state.sortedTransactionsDeleteCounter || 0,
                sortedLogbookInsertCounter: state.sortedLogbookInsertCounter || 0,
                sortedLogbookDeleteCounter: state.sortedLogbookDeleteCounter || 0
            }


        // ! Insert New Transaction Method
        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_TRANSACTION:

            const newTransaction = action.payload.transaction;
            const customDate = `${new Date(newTransaction.details.date).getFullYear()}/${('0' + (new Date(newTransaction.details.date).getMonth() + 1)).slice(-2)}/${('0' + new Date(newTransaction.details.date).getDate()).slice(-2)}`
            let groupSortedToBeReplaced;

            // ! Check logbook
            if (state.groupSorted.some((logbooks) => logbooks.logbook_id === newTransaction.logbook_id)) {

                // Get logboook section
                const foundLogbook = state.groupSorted.filter((logbook) => logbook.logbook_id === newTransaction.logbook_id)
                const foundOtherLogbooks = state.groupSorted.filter((logbook) => logbook.logbook_id !== newTransaction.logbook_id)
                console.log('first')


                // Check date and Get date section
                const foundDateSection = foundLogbook[0].transactions.filter((dateSection) => dateSection.customDate === customDate)
                const foundOtherDateSection = foundLogbook[0].transactions.filter((dateSection) => dateSection.customDate !== customDate)
                console.log('second')

                // !  If transaction has new date
                if (!foundDateSection.length) {

                    // Create new date section
                    const newDateSection = {
                        title: new Date(newTransaction.details.date).toLocaleDateString(),
                        customDate: `${new Date(newTransaction.details.date).getFullYear()}/${('0' + (new Date(newTransaction.details.date).getMonth() + 1)).slice(-2)}/${('0' + new Date(newTransaction.details.date).getDate()).slice(-2)}`,
                        data: [newTransaction]
                    };

                    // Insert new date section in logbook
                    // Replace initial logbook transactions with new section
                    const mergeLogbookTransactions = [...foundOtherDateSection, newDateSection]
                    const sortedLogbookTransactions = mergeLogbookTransactions.sort(sortLogbookTransactions)
                    // console.log(foundOtherDateSection)
                    const logbookToBeReplaced = { ...foundLogbook[0], transactions: sortedLogbookTransactions }
                    console.log('sixth')
                    console.log(logbookToBeReplaced)

                    // Rebuild new sorted transactions
                    groupSortedToBeReplaced = [...foundOtherLogbooks, logbookToBeReplaced]
                    console.log(groupSortedToBeReplaced)
                }


                // ! If transaction has same date
                if (foundDateSection.length) {

                    // Insert new transaction
                    const insertedTransactions = [...foundDateSection[0].data, newTransaction]
                    console.log('third')

                    // Sort new inserted transactions
                    const sortedDateSectionTransactions = insertedTransactions.sort(sortTransactions)
                    console.log('forth')

                    // Replace initial transactions data with sorted transactions
                    const sectionToBeInserted = { ...foundDateSection[0], data: sortedDateSectionTransactions }
                    console.log('fifth')

                    // Replace initial logbook transactions with new section
                    const mergeLogbookTransactions = [...foundOtherDateSection, sectionToBeInserted]
                    const sortedLogbookTransactions = mergeLogbookTransactions.sort(sortLogbookTransactions)
                    // console.log(foundOtherDateSection)
                    const logbookToBeReplaced = { ...foundLogbook[0], transactions: sortedLogbookTransactions }
                    console.log('sixth')
                    console.log(logbookToBeReplaced)

                    // Rebuild new sorted transactions
                    groupSortedToBeReplaced = [...foundOtherLogbooks, logbookToBeReplaced]
                    console.log(groupSortedToBeReplaced)
                }

            }

            return {
                ...state,
                groupSorted: groupSortedToBeReplaced,
                logbookToOpen: action.payload.logbookToOpen,
                sortedTransactionsInsertCounter: state.sortedTransactionsInsertCounter + 1
            }



        // ! Patch Transaction Method
        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_TRANSACTION:

            const newPatchTransaction = action.payload.patchTransaction;
            const prevTransaction = action.payload.prevTransaction;
            const customPatchDate = `${new Date(newPatchTransaction.details.date).getFullYear()}/${('0' + (new Date(newPatchTransaction.details.date).getMonth() + 1)).slice(-2)}/${('0' + new Date(newPatchTransaction.details.date).getDate()).slice(-2)}`
            const customPrevDate = `${new Date(prevTransaction.details.date).getFullYear()}/${('0' + (new Date(prevTransaction.details.date).getMonth() + 1)).slice(-2)}/${('0' + new Date(prevTransaction.details.date).getDate()).slice(-2)}`
            let groupSortPatched;
            let mergeLogbookTransactions;
            let sortedLogbookTransactions;
            let prevLogbookToBeReplaced;
            let targetLogbookToBeReplaced;

            // ! Create new date section
            const newDateSection = {
                title: new Date(newPatchTransaction.details.date).toLocaleDateString(),
                customDate: customPatchDate,
                data: [newPatchTransaction]
            };

            // Check patch and prev if logbook id and transaction date is still the same
            const isLogbookIdSame = newPatchTransaction.logbook_id === prevTransaction.logbook_id
            const isTransactionDateSame = customPatchDate === customPrevDate

            // Get logboook section
            const foundPrevLogbook = state.groupSorted.filter((logbook) => logbook.logbook_id === prevTransaction.logbook_id)
            const foundPrevOtherLogbooks = state.groupSorted.filter((logbook) => logbook.logbook_id !== prevTransaction.logbook_id)
            const foundTargetLogbook = state.groupSorted.filter((logbook) => logbook.logbook_id === newPatchTransaction.logbook_id)
            const foundTargetOtherLogbooks = state.groupSorted.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id)
            console.log('first')

            // Check date and Get date section
            // Target Date Section
            const foundTargetDateSection = foundTargetLogbook[0].transactions.filter((dateSection) => dateSection.customDate === customPatchDate)
            const foundTargetOtherDateSection = foundTargetLogbook[0].transactions.filter((dateSection) => dateSection.customDate !== customPatchDate)
            // Prev Date Section
            const foundPrevDateSection = foundPrevLogbook[0].transactions.filter((dateSection) => dateSection.customDate === customPrevDate)
            const foundPrevOtherDateSection = foundPrevLogbook[0].transactions.filter((dateSection) => dateSection.customDate !== customPrevDate)
            // Prev Transactions Data
            const foundPrevOtherTransactionsData = foundPrevDateSection[0].data.filter((transaction) => transaction.transaction_id !== newPatchTransaction.transaction_id)



            // ! OPTION 11
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                !foundPrevOtherDateSection.length &&
                foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 11')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                // sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: [] }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 1 date section and sort it
                const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...removeTargetDateSections, replacedTargetDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)


            }


            // ! OPTION 10
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                !foundPrevOtherDateSection.length &&
                !foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 10')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                // sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: [] }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 2 date section and sort it
                // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...foundTargetOtherDateSection, newDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)


            }


            // ! OPTION 9
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                foundPrevOtherDateSection.length &&
                !foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 9')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 2 date section and sort it
                // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...foundTargetOtherDateSection, newDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)
            }


            // ! OPTION 8
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                foundPrevOtherDateSection.length &&
                !foundTargetDateSection.length &&
                foundPrevOtherTransactionsData.length) {

                console.log('OPT 8')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                sortedLogbookTransactions = overridePrevDateSections.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 2 date section and sort it
                // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...foundTargetOtherDateSection, newDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)
            }


            // ! OPTION 7
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                foundPrevOtherDateSection.length &&
                foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 7')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                // console.log('first')
                // 2. Replace previous date section data with no 1
                // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                // console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 2 date section and sort it
                const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...removeTargetDateSections, replacedTargetDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)
            }

            // ! OPTION 6
            if (!isLogbookIdSame &&
                // isTransactionDateSame &&
                foundPrevOtherDateSection.length &&
                foundTargetDateSection.length &&
                foundPrevOtherTransactionsData.length) {

                console.log('OPT 6')

                // ! [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // ! [B] JOIN [A] IN PREVIOUS LOGBOOK
                // 3. Get previous section date, override date section and sort it
                const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
                sortedLogbookTransactions = overridePrevDateSections.sort(sortLogbookTransactions)
                console.log('third')

                // 4. Replace initial logbook transactions with new section
                prevLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('forth')
                // console.log(logbookToBeReplaced)

                // ! [C] HANDLING TARGET DATE SECTION
                // 5. Get transactions from target date section and sort it
                const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('fifth')

                // 6. Replace target date section data with no 5
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
                console.log('sixth')

                // ! [D] JOIN [C] IN TARGET LOGBOOK
                // 7. Get previous section date, override 2 date section and sort it
                const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
                const overrideTargetDateSections = [...removeTargetDateSections, replacedTargetDateSection]
                console.log('seventh')

                // 8. Sort new transactions date sections
                sortedLogbookTransactions = overrideTargetDateSections.sort(sortLogbookTransactions)
                console.log('eigth')

                // 9. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundTargetLogbook[0], transactions: sortedLogbookTransactions }
                console.log('ninth')
                // console.log(logbookToBeReplaced)


                // ! [E] JOINING [A] AND [D]

                // 10. Final Override 
                const removedTwoLogbooks = foundPrevOtherLogbooks.filter((logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id && logbook.logbook_id !== prevTransaction.logbook_id)
                groupSortedToBeReplaced = [...removedTwoLogbooks, targetLogbookToBeReplaced, prevLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)
            }

            // ! OPTION 5
            if (isLogbookIdSame &&
                isTransactionDateSame &&
                foundTargetDateSection.length) {

                console.log('OPT 5')

                // [A] HANDLING TARGET DATE SECTION
                // 1. Get trasnactions from target date section and sort it
                const getTargetTransactionsData = [...foundPrevOtherTransactionsData, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('third')

                // 4. Replace target date section data with no 3
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }

                // [C] JOINING [A] AND [B]

                // 5. Get previous section date, override 2 date section and sort it
                const overrideDateSections = [...foundTargetOtherDateSection, replacedTargetDateSection]

                // 6. Sort new transactions date sections
                sortedLogbookTransactions = overrideDateSections.sort(sortLogbookTransactions)
                console.log('forth')

                // 7. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('sixth')
                // console.log(logbookToBeReplaced)

                // 8. Final Override
                groupSortedToBeReplaced = [...foundPrevOtherLogbooks, targetLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)

            }

            // ! OPTION 4
            if (isLogbookIdSame &&
                !isTransactionDateSame &&
                foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 4')

                // [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                // console.log('first')
                // 2. Replace previous date section data with no 1
                // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                // console.log('second')

                // [B] HANDLING TARGET DATE SECTION
                // 3. Get transactions from target date section and sort it
                const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('third')

                // 4. Replace target date section data with no 3
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }

                // [C] JOINING [A] AND [B]

                // 5. Get previous section date, override 2 date section and sort it
                const removeTwoDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate && section.customDate !== customPrevDate)
                const overrideDateSections = [...removeTwoDateSections, replacedTargetDateSection]

                // 6. Sort new transactions date sections
                sortedLogbookTransactions = overrideDateSections.sort(sortLogbookTransactions)
                console.log('forth')

                // 7. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('sixth')
                // console.log(logbookToBeReplaced)

                // 8. Final Override
                groupSortedToBeReplaced = [...foundPrevOtherLogbooks, targetLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)

            }


            // ! OPTION 3
            if (isLogbookIdSame &&
                !isTransactionDateSame &&
                foundTargetDateSection.length &&
                foundPrevOtherTransactionsData.length) {

                console.log('OPT 3')

                // [A] HANDLING PREVIOUS DATE SECTION
                // 1. Remove transaction from previous date section and sort it
                const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('first')
                // 2. Replace previous date section data with no 1
                const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
                console.log('second')

                // [B] HANDLING TARGET DATE SECTION
                // 3. Get transactions from target date section and sort it
                const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
                const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
                console.log('third')

                // 4. Replace target date section data with no 3
                const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }

                // [C] JOINING [A] AND [B]

                // 5. Get previous section date, override 2 date section and sort it
                const removeTwoDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate && section.customDate !== customPrevDate)
                const overrideDateSections = [...removeTwoDateSections, replacedPrevDateSection, replacedTargetDateSection]

                // 6. Sort new transactions date sections
                sortedLogbookTransactions = overrideDateSections.sort(sortLogbookTransactions)
                console.log('forth')

                // 7. Replace initial logbook transactions with new section
                targetLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('sixth')
                // console.log(logbookToBeReplaced)

                // 8. Final Override
                groupSortedToBeReplaced = [...foundPrevOtherLogbooks, targetLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)

            }

            // ! OPTION 2
            if (isLogbookIdSame &&
                !isTransactionDateSame &&
                !foundTargetDateSection.length &&
                !foundPrevOtherTransactionsData.length) {

                console.log('OPT 2')

                mergeLogbookTransactions = [...foundPrevOtherDateSection, newDateSection]

                sortedLogbookTransactions = mergeLogbookTransactions.sort(sortLogbookTransactions)

                targetLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('sixth')
                console.log(targetLogbookToBeReplaced)

                // Rebuild new sorted transactions
                groupSortedToBeReplaced = [...foundPrevOtherLogbooks, targetLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)


            }



            // ! OPTION 1
            if (isLogbookIdSame &&
                !isTransactionDateSame &&
                !foundTargetDateSection.length &&
                foundPrevOtherTransactionsData.length) {

                console.log('OPT 1')

                // ! New date && same logbook && has prevTransactionsData remains
                // Sort new inserted transactions
                const prevSortedDateSectionTransactions = foundPrevOtherTransactionsData.sort(sortTransactions)
                console.log('forth')

                // Replace initial transactions data with sorted transactions
                const newPrevDateSection = { ...foundPrevDateSection[0], data: prevSortedDateSectionTransactions }
                console.log('fifth')

                // Replace initial logbook transactions with new section
                mergeLogbookTransactions = [...foundPrevOtherDateSection, newPrevDateSection, newDateSection]
                sortedLogbookTransactions = mergeLogbookTransactions.sort(sortLogbookTransactions)
                // console.log(foundOtherDateSection)
                targetLogbookToBeReplaced = { ...foundPrevLogbook[0], transactions: sortedLogbookTransactions }
                console.log('sixth')
                console.log(targetLogbookToBeReplaced)

                // Rebuild new sorted transactions
                groupSortedToBeReplaced = [...foundPrevOtherLogbooks, targetLogbookToBeReplaced]
                console.log(groupSortedToBeReplaced)


            }


            return {
                ...state,
                groupSorted: groupSortedToBeReplaced,
                sortedTransactionsPatchCounter: state.sortedTransactionsPatchCounter + 1,
                logbookToOpen: action.payload.logbookToOpen
            }


        case ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_TRANSACTION:

            const deleteTransaction = action.payload.deleteTransaction;
            const customDeleteDate = `${new Date(deleteTransaction.details.date).getFullYear()}/${('0' + (new Date(deleteTransaction.details.date).getMonth() + 1)).slice(-2)}/${('0' + new Date(deleteTransaction.details.date).getDate()).slice(-2)}`


            // Get logboook section
            const foundPrevDelLogbook = state.groupSorted.filter((logbook) => logbook.logbook_id === deleteTransaction.logbook_id)
            const foundPrevDelOtherLogbooks = state.groupSorted.filter((logbook) => logbook.logbook_id !== deleteTransaction.logbook_id)
            console.log('first')

            // Check date and Get date section
            // Prev Date Section
            const foundPrevDelDateSection = foundPrevDelLogbook[0].transactions.filter((dateSection) => dateSection.customDate === customDeleteDate)
            const foundPrevDelOtherDateSection = foundPrevDelLogbook[0].transactions.filter((dateSection) => dateSection.customDate !== customDeleteDate)
            // Prev Transactions Data
            const foundPrevDelOtherTransactionsData = foundPrevDelDateSection[0].data.filter((transaction) => transaction.transaction_id !== deleteTransaction.transaction_id)

            if (foundPrevDelOtherTransactionsData.length) {
                console.log('if1')

                // [A] HANDLING PREVIOUS DATA
                // 1. Remove transaction from previous date section, sort it, and put it back in date section
                const sortedDelTransactionsData = foundPrevDelOtherTransactionsData.sort(sortTransactions)
                const newDateSection = { ...foundPrevDelDateSection[0], data: sortedDelTransactionsData }
                // 2. Join [1] with other date section in same logbook, sort it
                const mergeLogbookTransactions = [...foundPrevDelOtherDateSection, newDateSection]
                const sortedLogbookTransactions = mergeLogbookTransactions.sort(sortLogbookTransactions)
                const logbookToBeReplaced = { ...foundPrevDelLogbook[0], transactions: sortedLogbookTransactions }
                // 3. Join [2] with other logbook
                groupSortedToBeReplaced = [...foundPrevDelOtherLogbooks, logbookToBeReplaced]
                console.log(groupSortedToBeReplaced)

            }


            if (!foundPrevDelOtherTransactionsData.length) {
                console.log('if2')

                // [A] HANDLING PREVIOUS DATA
                // 1. Remove transaction from previous date section, sort it, and put it back in date section
                // const sortedDelTransactionsData = foundPrevDelOtherTransactionsData.sort(sortTransactions)
                // const newDateSection = { ...foundPrevDelDateSection[0], data: sortedDelTransactionsData }
                // 2. Join [1] with other date section in same logbook, sort it
                // const mergeLogbookTransactions = [...foundPrevDelOtherDateSection, newDateSection]
                const sortedLogbookTransactions = foundPrevDelOtherDateSection.sort(sortLogbookTransactions)
                const logbookToBeReplaced = { ...foundPrevDelLogbook[0], transactions: sortedLogbookTransactions }
                // 3. Join [2] with other logbook
                groupSortedToBeReplaced = [...foundPrevDelOtherLogbooks, logbookToBeReplaced]
                console.log(groupSortedToBeReplaced)

            }



            return {
                ...state,
                groupSorted: groupSortedToBeReplaced,
                sortedTransactionsDeleteCounter: state.sortedTransactionsDeleteCounter + 1,
                logbookToOpen: action.payload.logbookToOpen
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

        // Insert Logbook
        // case ACTIONS.LOGBOOKS.INSERT:
        //     return { ...state, logbooks: [...state.logbooks, action.payload] }

        // Clear Logbooks
        // case ACTIONS.LOGBOOKS.SET:
        //     return { ...state, logbooks: null }

        // ! Categories
        // Set Categories
        // case ACTIONS.CATEGORIES.SET:
        //     return { ...state, categories: action.payload }

        // Clear Categories
        // case ACTIONS.CATEGORIES.SET:
        //     return { ...state, categories: null }

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
                language: action.payload.language,
                locale: action.payload.locale
            }

        // Set App Currency
        case ACTIONS.APP_SETTINGS.CURRENCY.SET:
            return {
                ...state,
                currency: action.payload
            }

        // Push Screen Hidden
        case ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH:
            return {
                ...state,
                screenHidden: [...state.screenHidden, action.payload]
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