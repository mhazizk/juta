import { useEffect, useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../../assets/themes/globalStyles";
import { getCategoriesFromStorage, getLogbooksFromStorage, getTransactionsFromStorage, setSortedTransactions } from "../../modules/FetchData";
import { useGlobalAppSettings, useGlobalLoading, useGlobalSortedTransactions, useGlobalTransactions, useGlobalUserAccount } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";
import { asyncSecureStorage, asyncStorage, STORAGE_ACTIONS } from "../../modules/Storage";

const SplashScreen = ({ navigation }) => {

    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();


    useEffect(() => {

        setTimeout(
            () => {

                loadInitialState()
                    .then(() => {
                        dispatchAppSettings({
                            type: ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
                            payload: 'Splash Screen'
                        })

                        navigation.navigate('Bottom Tab')
                    })

            }
            , 100)


    }, [])

    useEffect(() => {


    }, [isLoading])


    useEffect(() => {

        if (sortedTransactions.sortedTransactionsInitCounter) {

            dispatchAppSettings({
                type: ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
                payload: 'Splash Screen'
            })

            navigation.navigate('Bottom Tab')
        }

    }, [sortedTransactions.sortedTransactionsInitCounter])


    const loadInitialState = async () => {

        // Initial load app settings
        const loadAppSettings = await asyncStorage({ action: STORAGE_ACTIONS.GET, key: 'appSettings' })

        if (!loadAppSettings) {
            dispatchAppSettings({
                type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
                payload: {
                    theme: { name: 'Light Theme', id: 'light' },
                    fontSize: 'medium',
                    language: 'english',
                    locale: 'us-EN',
                    currency: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
                    screenHidden: []
                }
            })
        }

        // Load Account from Storage
        const loadAccount = await asyncSecureStorage({ action: STORAGE_ACTIONS.GET, key: 'account' })

        if (loadAccount) {
            dispatchUserAccount({
                type: ACTIONS.MULTI_ACTIONS.SET_INIT_USER_ACCOUNT,
                payload: loadAccount
            })
        }

        // .then((item) => {
        //         dispatchUserAccount({
        //             type: ACTIONS.MULTI_ACTIONS.SET_INIT_USER_ACCOUNT,
        //             payload: {
        //                 profile: {
        //                     nickname: 'haziz',
        //                     avatar: null
        //                 },
        //                 account: {
        //                     verification: true,
        //                     user_id: '637208d545a0d121607a402e',
        //                     token: item,
        //                     email: 'jack@gmail.com'
        //                 }
        //             }
        //         })
        //     })


        // Initial load raw transactions
        // if (!rawTransactions) {
        //     Promise.all([getTransactionsFromStorage(), getCategoriesFromStorage(), getLogbooksFromStorage()])
        //         .then((array) => {
        //             console.log('loaded')
        //             return (
        //                 dispatchRawTransactions({
        //                     type: ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS,
        //                     payload: {
        //                         transactions: array[0],
        //                         categories: array[1],
        //                         logbooks: array[2]
        //                     }
        //                 })
        //             )
        //         }
        //         )
        // }

        // Initial load sorted Transactions
        // if (!sortedTransactions.groupSorted) {
        //     getSortedTransactions();
        // }


    }



    // const dispatchInitSortedTransactions = () => {
    const getSortedTransactions = useMemo(() => {
        return (
            async () => {
                try {

                    dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
                        payload: await setSortedTransactions()
                    })


                } catch (error) {
                    console.log(error)
                }
            }
        )
    }, [])
    // }



    return (
        <>
            <View style={{ ...globalStyles.lightTheme.view, backgroundColor: 'maroon', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator
                    size={48}
                    color='#000'
                />

                {/* App Version */}
                <View style={{ position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <Text>Cash Log</Text>
                    <Text>v.1.0.0</Text>
                </View>
            </View>
        </>
    )
}

export default SplashScreen;