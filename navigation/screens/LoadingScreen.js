import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, ToastAndroid, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useGlobalAppSettings, useGlobalCategories, useGlobalLoading, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalTransactions } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";
import { convertAndSaveTransctions, setSortedTransactions } from "../../modules/FetchData";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoadingScreen = ({ route, navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { categories, dispatchCategories } = useGlobalCategories();

    const [initial, setInitial] = useState(null);

    useEffect(() => {

        // console.log({ onLoad: route.params.initialRawTransactionsLength })
        console.log(route?.params)

        // ! Transaction Timeout
        setTimeout(
            () => {

                // ! New Insert Transaction Method
                if (route?.params?.transaction && route?.params?.loadingType === 'insertTransaction') {
                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_TRANSACTION,
                        payload: {
                            transaction: route?.params?.transaction,
                            logbookToOpen: route?.params?.logbookToOpen
                        }
                    })
                }

                // ! New Patch Transaction Method
                if (route?.params?.patchTransaction && route?.params?.prevTransaction && route?.params?.loadingType === 'patchTransaction') {
                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_TRANSACTION,
                        payload: {
                            prevTransaction: route?.params?.prevTransaction,
                            patchTransaction: route?.params?.patchTransaction,
                            logbookToOpen: route?.params?.logbookToOpen
                        }
                    })
                }

                // ! New Delete One Transaction Method
                if (route?.params?.deleteTransaction && route?.params?.loadingType === 'deleteOneTransaction') {
                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_TRANSACTION,
                        payload: {
                            deleteTransaction: route?.params?.deleteTransaction,
                            logbookToOpen: route?.params?.logbookToOpen
                        }
                    })
                }

                // ! New Patch Logbook Method
                if (route?.params?.patchLogbook &&
                    logbooks.logbookPatchCounter === route?.params?.initialLogbookPatchCounter &&
                    route?.params?.loadingType === 'patchLogbook') {
                    console.log('mulai dispatch')
                    dispatchLogbooks({
                        type: ACTIONS.LOGBOOKS.PATCH,
                        payload: route?.params?.patchLogbook
                    })
                }

                // ! New Delete One Logbook Method
                if (route?.params?.deleteLogbook &&
                    logbooks.logbookDeleteCounter === route?.params?.initialLogbookDeleteCounter &&
                    route?.params?.loadingType === 'deleteOneLogbook') {
                    console.log('mulai dispatch')
                    dispatchLogbooks({
                        type: ACTIONS.LOGBOOKS.DELETE_ONE,
                        payload: route?.params?.deleteLogbook
                    })

                }



                // ! Switch LogBook Timeout
                if (route?.params?.loadingType === 'switchLogBook') {
                    setTimeout(
                        () => {
                            navigation.navigate('Bottom Tab')
                        }
                        , 1000)

                }

            }

            , 100)

    }, [])

    // useEffect(() => {
    //     if (!isLoading.status) {
    //         navigation.navigate('Bottom Tab')
    //     }
    // }, [isLoading.status])

    // ! New Insert Transaction Method
    useEffect(() => {
        if (sortedTransactions.sortedTransactionsInsertCounter > route?.params?.initialSortedTransactionsInsertCounter
            && route?.params?.loadingType === 'insertTransaction') {
            navigation.navigate('Bottom Tab')
            // convertAndSaveTransctions(sortedTransactions);
        }
    }, [sortedTransactions.sortedTransactionsInsertCounter])


    // ! New Patch Sorted Transaction Method
    useEffect(() => {

        // console.log(rawTransactions.transactionsPatchedInSession > route?.params?.initialTransactionsPatchedLength)
        if (sortedTransactions.sortedTransactionsPatchCounter > route?.params?.initialSortedTransactionsPatchCounter
            && route?.params?.loadingType === 'patchTransaction') {
            // console.log(route?.params?.logbookToOpen)
            navigation.navigate('Bottom Tab')
        }

    }, [sortedTransactions.sortedTransactionsPatchCounter])


    // ! New Patch Logbook Method
    useEffect(() => {

        // console.log({ counter: logbooks.logbookPatchCounter })
        if (logbooks.logbookPatchCounter > route?.params?.initialLogbookPatchCounter
            && route?.params?.loadingType === 'patchLogbook') {
            navigation.navigate('Logbook Preview Screen', {
                logbook: route?.params?.patchLogbook
            })
        }

    }, [logbooks.logbookPatchCounter])


    // ! New Delete One Transaction Method
    useEffect(() => {
        if (sortedTransactions.sortedTransactionsDeleteCounter > route?.params?.initialSortedTransactionsDeleteCounter
            && route?.params?.loadingType === 'deleteOneTransaction') {
            // console.log('render 4')
            // dispatchSortedTransactions({
            //     type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_TRANSACTION,
            //     payload: { deleteTransaction: route?.params?.deleteTransaction }
            // })
            navigation.navigate('Bottom Tab')
        }
    }, [sortedTransactions.sortedTransactionsDeleteCounter])


    // ! New Delete One Logbook Method (Logbook Reducer)
    useEffect(() => {

        // console.log({ counter: logbooks.logbookPatchCounter })
        if (logbooks.logbookDeleteCounter > route?.params?.initialLogbookDeleteCounter
            && route?.params?.loadingType === 'deleteOneLogbook') {
            dispatchSortedTransactions({
                type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_LOGBOOK,
                payload: route?.params?.deleteLogbook
            })
        }

    }, [logbooks.logbookDeleteCounter])

    // ! New Delete One Logbook Method (Sorted Transactions Reducer)
    useEffect(() => {

        if (sortedTransactions.sortedLogbookDeleteCounter > route?.params?.initialSortedLogbookDeleteCounter
            && route?.params?.loadingType === 'deleteOneLogbook') {
            navigation.navigate('My Logbooks Screen')

        }

    }, [sortedTransactions.sortedLogbookDeleteCounter])


    // ! Save Async Storage && dispatch Sorted Transactions
    const saveAndLoad = async () => {
        console.log('render 3')
        dispatchSortedTransactions({
            type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
            payload: await setSortedTransactions(rawTransactions.transactions)
        })
        await AsyncStorage.setItem('transactions', JSON.stringify(rawTransactions.transactions))
    }


    return (

        <>
            {/* // ! Transparent Overlay */}
            {/* <TouchableOpacity onPress={() => navigation.pop(1)} style={{ flex: 1, backgroundColor: 'transparent' }}> */}
            {/* {isLoading && */}
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
            {/* } */}
            {/* </TouchableOpacity> */}

            {/* // ! Content card */}
            {/* {isLoading && */}
            <View
                style={{
                    ...globalStyles.lightTheme.view,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxHeight: '50%',
                    paddingVertical: 24,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                    // flex:1
                }}>
                <ActivityIndicator size={48} color='#000' style={{ paddingBottom: 16 }} />
                <View >
                    <Text style={{ ...globalStyles.lightTheme.textPrimary }}>{route?.params?.label}</Text>
                </View>
            </View>
            {/* } */}
        </>
    )
}

export default LoadingScreen;