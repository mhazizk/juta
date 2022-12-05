import { useEffect, useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../../assets/globalStyles";
import { getCategoriesFromStorage, getLogbooksFromStorage, getTransactionsFromStorage, setSortedTransactions } from "../../modules/FetchData";
import { useGlobalAppSettings, useGlobalLoading, useGlobalSortedTransactions, useGlobalTransactions, useGlobalUserAccount } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";

const SplashScreen = ({ navigation }) => {

    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();


    useEffect(() => {

        setTimeout(
            () => {

                loadInitialState();

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


    const loadInitialState = () => {

        // Initial load sorted Transactions
        if (!sortedTransactions.groupSorted) {
            getSortedTransactions();
        }

        // Initial load app settings
        if (!appSettings) {
            dispatchAppSettings({
                type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
                payload: {
                    theme: 'light',
                    fontSize: 'medium',
                    language: 'english',
                    currency: 'IDR',
                    screenHidden: []
                    // screenHidden: navigation.state.routeName
                }
            })
        }

        // Initial load user account
        if (!userAccount) {
            dispatchUserAccount({
                type: ACTIONS.MULTI_ACTIONS.SET_INIT_USER_ACCOUNT,
                payload: {
                    profile: {
                        nickname: 'Jack',
                        avatar: null
                    },
                    account: {
                        verification: true,
                        token: 'token123456',
                        email: 'jack@gmail.com'
                    }
                }
            })
        }

        // Initial load raw transactions
        if (!rawTransactions) {
            Promise.all([getTransactionsFromStorage(), getCategoriesFromStorage(), getLogbooksFromStorage()])
                .then((array) => {
                    console.log('loaded')
                    return (
                        dispatchRawTransactions({
                            type: ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS,
                            payload: {
                                transactions: array[0],
                                categories: array[1],
                                logbooks: array[2]
                            }
                        })
                    )
                }
                )
        }

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
    }, [rawTransactions])
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