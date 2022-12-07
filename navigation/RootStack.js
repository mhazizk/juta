import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import BottomTab from "./BottomTab";
import ActionScreen from "./screens/ActionScreen";
import ModalScreen from "./screens/ModalScreen";
import IonIcons from 'react-native-vector-icons/Ionicons';
import TransactionPreviewScreen from "./screens/home/TransactionPreviewScreen";
import EditTransactionDetailsScreen from "./screens/home/EditTransactionDetailsScreen";
import { useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalUserAccount, useGlobalAppSettings, useGlobalTransactions, useGlobalSortedTransactions, useGlobalLoading } from "../modules/GlobalContext";
import { ACTIONS } from "../modules/GlobalReducer";
import userCategories from "../database/userCategories";
import userLogBooks from "../database/userLogBooks";
import { getCategoriesFromStorage, getLogbooksFromStorage, getTransactionsFromStorage, setSortedTransactions } from "../modules/FetchData";
import userTransactions from "../database/userTransactions";
import NewTransactionDetailsScreen from "./screens/home/NewTransactionDetailsScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SplashScreen from "./screens/SplashScreen";
import MyLogbooksScreen from "./screens/user/MyLogbooksScreen";
import MyCategoriesScreen from "./screens/user/MyCategoriesScreen";
import EditLogbookScreen from "./screens/user/EditLogbookScreen";
import LogbookPreviewScren from "./screens/user/LogbookPreviewScreen";


const Stack = createStackNavigator();

const screens = {
    bottomTab: 'Bottom Tab',
    modalScreen: 'Modal Screen',
    transactionDetailsScreen: 'Transaction Details Screen',
    newTransactionDetailsScreen: 'New Transaction Details Screen',
    transactionPreviewScreen: 'Transaction Preview Screen',
    actionScreen: 'Action Screen',
    loadingScreen: 'Loading Screen',
    splashScreen: 'Splash Screen',
    myLogbooksScreen: 'My Logbooks Screen',
    editLogbookScreen: 'Edit Logbook Screen',
    logbookPreviewScreen: 'Logbook Preview Screen',
    myCategoriesScreen: 'My Categories Screen'
}
const RootStack = ({ navigation }) => {

    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();

    // ! useEffect for state
    useEffect(() => {

        dispatchLoading({
            type: ACTIONS.LOADING.SET,
            payload: true
        })

    }, [])


    useEffect(() => {
        // refresh
        // if (sortedTransactions.groupSorted) {
        //     getSortedTransactions();
        // }

    }, [sortedTransactions])


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

    // const dispatchInitSortedTransactions = useMemo(() => {
    //     return (
    //         () => {
    //             return dispatchInitSortedTransactions({
    //                 type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
    //                 payload: setSortedTransactions()
    //             });
    //         }
    //     )
    // }, [])

    // Get Transaction File from storage
    const getFileFromStorage = async () => {
        try {
            const json = await AsyncStorage.getItem('trx');
            if (json != null) {
                const parsed = JSON.parse(json);
                dispatchRawTransactions({
                    type: ACTIONS.TRANSACTIONS.SET,
                    payload: parsed
                })
            }
        } catch (error) {
            alert(error)
        }
    }


    return (
        <Stack.Navigator
            initialRouteName={screens.splashScreen}

            screenOptions={{
                headerShown: false
            }}

        >
            {/* // ! Bottom Tab */}
            <Stack.Screen name={screens.bottomTab}
                options={{
                    title: 'New Transaction',
                    headerLeft: (leftHeader) => (
                        <>
                        </>
                    )

                }}
                component={BottomTab} />

            {/* // ! Modal Screen */}
            <Stack.Screen
                options={{
                    presentation: 'transparentModal',
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }}
                name={screens.modalScreen}
                component={ModalScreen} />

            {/* // ! Action Screen */}
            <Stack.Screen
                options={{
                    presentation: 'transparentModal',
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }}
                name={screens.actionScreen}
                component={ActionScreen} />

            {/* // ! Transaction Preview Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    // title:'New Transaction',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    // {/* <TouchableOpacity onPress={()=>navigation.pop(1)} style={{paddingHorizontal:11}}>
                    //     <IonIcons name='close' size={24} style={{ margin: 3 }} />
                    // </TouchableOpacity> */}
                    // </>)
                }}
                name={screens.transactionPreviewScreen} component={TransactionPreviewScreen} />

            {/* // ! Transaction Details Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    // title:'New Transaction',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    // {/* <TouchableOpacity onPress={()=>navigation.pop(1)} style={{paddingHorizontal:11}}>
                    //     <IonIcons name='close' size={24} style={{ margin: 3 }} />
                    // </TouchableOpacity> */}
                    // </>)
                }}
                name={screens.transactionDetailsScreen} component={EditTransactionDetailsScreen} />

            {/* // ! New Transaction Details Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'New Transaction',
                    headerLeft: (leftHeader) => (
                        <>
                        </>
                    )
                }}
                name={screens.newTransactionDetailsScreen} component={NewTransactionDetailsScreen} />

            {/* // ! My Logbooks Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'My Logbooks',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    //     </>
                    // )
                }}
                name={screens.myLogbooksScreen} component={MyLogbooksScreen} />

            {/* // ! Edit Logbook Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Logbook Preview',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    //     </>
                    // )
                }}
                name={screens.logbookPreviewScreen} component={LogbookPreviewScren} />

            {/* // ! Edit Logbook Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Edit Logbook',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    //     </>
                    // )
                }}
                name={screens.editLogbookScreen} component={EditLogbookScreen} />

            {/* // ! My Categories Screen */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'My Categories',
                    // headerLeft: (leftHeader) => (
                    //     <>
                    //     </>
                    // )
                }}
                name={screens.myCategoriesScreen} component={MyCategoriesScreen} />

            {/* // ! Action Screen */}
            <Stack.Screen
                options={{
                    gestureEnabled: false,
                    presentation: 'transparentModal',
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }}
                name={screens.loadingScreen}
                component={LoadingScreen} />


            {/* // ! Splash Screen */}
            {!appSettings?.screenHidden?.some((screen) => screen === 'Splash Screen') &&
                <Stack.Screen
                    options={{
                        gestureEnabled: false,
                        presentation: 'transparentModal',
                        headerShown: false,
                        cardOverlayEnabled: true,
                        cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                    }}
                    name={screens.splashScreen}
                    component={SplashScreen} />}

        </Stack.Navigator>
    )
}

export default RootStack;