import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, ToastAndroid, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useGlobalAppSettings, useGlobalLoading, useGlobalSortedTransactions, useGlobalTransactions } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";
import { convertAndSaveTransctions, setSortedTransactions } from "../../modules/FetchData";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoadingScreen = ({ route, navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();

    const [initial, setInitial] = useState(null);

    useEffect(() => {

        // console.log({ onLoad: route.params.initialRawTransactionsLength })


        // ! Transaction Timeout
        setTimeout(
            () => {

                // ! Save New Transaction
                if (route?.params?.transaction && route?.params?.loadingType === 'saveNewTransaction') {
                    console.log('render 1')
                    dispatchRawTransactions({
                        type: ACTIONS.TRANSACTIONS.INSERT,
                        payload: route?.params?.transaction
                    })
                }

                // ! Save Edited Transaction
                if (route?.params?.transaction && route?.params?.loadingType === 'saveEditedTransaction') {
                    console.log('render 1')
                    dispatchRawTransactions({
                        type: ACTIONS.TRANSACTIONS.PATCH,
                        payload: route?.params?.transaction
                    })
                }

                // ! Delete One Transaction
                if (route?.params?.transaction_id && route?.params?.loadingType === 'deleteOneTransaction') {
                    console.log('render 1')
                    dispatchRawTransactions({
                        type: ACTIONS.TRANSACTIONS.DELETE_ONE,
                        payload: route?.params?.transaction_id
                    })
                }

                // ! New Insert Transaction Method
                if (route?.params?.transaction && route?.params?.loadingType === 'insertTransaction') {
                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT,
                        payload: route?.params?.transaction
                    })
                }

                // ! New Patch Transaction Method
                if (route?.params?.patchTransaction && route?.params?.prevTransaction && route?.params?.loadingType === 'patchTransaction') {
                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH,
                        payload: {
                            prevTransaction: route?.params?.prevTransaction,
                            patchTransaction: route?.params?.patchTransaction,
                        }
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
            console.log('render 4')
            navigation.navigate('Bottom Tab')
        }

    }, [sortedTransactions.sortedTransactionsPatchCounter])



    // ! Insert Transaction Method
    useEffect(() => {
        // console.log(rawTransactions.transactionsLength, route?.params?.initialRawTransactionsLength)
        // console.log({ check: rawTransactions.transactionsInsertCounter, init: route?.params?.initialTransactionsInsertCounter })
        if (rawTransactions.transactionsInsertCounter > route?.params?.initialTransactionsInsertCounter
            && route?.params?.loadingType === 'saveNewTransaction') {
            console.log('render 2')
            saveAndLoad()
        }
    }, [rawTransactions.transactionsInsertCounter])

    // ! Insert Sorted Transaction Method
    // useEffect(() => {

    //     if (sortedTransactions.sortedTransactionsInsertCounter > route?.params?.initialSortedTransactionsInsertCounter
    //         && route?.params?.loadingType === 'saveNewTransaction') {
    //         console.log('render 4')
    //         navigation.navigate('Bottom Tab')
    //     }

    // }, [sortedTransactions.sortedTransactionsInsertCounter])

    // ! Patch Transaction Method
    useEffect(() => {
        // console.log({ useeffect: rawTransactions.transactionsPatchedInSession })
        if (rawTransactions.transactionsPatchCounter > route?.params?.initialTransactionsPatchCounter
            && route?.params?.loadingType === 'saveEditedTransaction') {
            console.log('render 2')
            saveAndLoad()
        }
    }, [rawTransactions.transactionsPatchCounter])



    // ! Patch Sorted Transaction Method
    useEffect(() => {

        // console.log(rawTransactions.transactionsPatchedInSession > route?.params?.initialTransactionsPatchedLength)
        if (sortedTransactions.sortedTransactionsPatchCounter > route?.params?.initialSortedTransactionsPatchCounter
            && route?.params?.loadingType === 'saveEditedTransaction') {
            console.log('render 4')
            navigation.navigate('Bottom Tab')
        }

    }, [sortedTransactions.sortedTransactionsPatchCounter])


    // ! Delete One Transaction
    useEffect(() => {
        if (rawTransactions.transactionsDeleteCounter > route.params?.initialTransactionsDeleteCounter
            && route?.params?.loadingType === 'deleteOneTransaction') {
            console.log('render 2')
            saveAndLoad();
        }
    }, [rawTransactions.transactionsDeleteCounter])


    useEffect(() => {
        if (sortedTransactions.sortedTransactionsDeleteCounter > route.params?.initialSortedTransactionsDeleteCounter
            && route?.params?.loadingType === 'deleteOneTransaction') {
            console.log('render 4')
            navigation.navigate('Bottom Tab')
        }
    }, [sortedTransactions.sortedTransactionsDeleteCounter])


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