import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import BottomTab from "./BottomTab";
import ActionScreen from "./screens/ActionScreen";
import ModalScreen from "./screens/ModalScreen";
import IonIcons from 'react-native-vector-icons/Ionicons';
import TransactionPreviewScreen from "./screens/home/TransactionPreviewScreen";
import TransactionDetailsScreen from "./screens/home/TransactionDetailsScreen";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalUserAccount, useGlobalAppSettings as useGlobalAppSettings, useGlobalTransactions } from "../modules/GlobalContext";
import { ACTIONS } from "../modules/GlobalReducer";
import userCategories from "../database/userCategories";
import userLogBooks from "../database/userLogBooks";
import { SetInitialAppSettings, SetInitialTransactions, SetInitialUserAccount } from "../modules/FetchData";


const Stack = createStackNavigator();

const screens = {
    bottomTab: 'Bottom Tab',
    modalScreen: 'Modal Screen',
    transactionDetailsScreen: 'Transaction Details Screen',
    transactionPreviewScreen: 'Transaction Preview Screen',
    actionScreen: 'Action Screen'
}
const RootStack = ({ navigation }) => {

    const { state, dispatch } = useGlobalTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

    // ! useEffect for state
    useEffect(() => {
        dispatchAppSettings({
            type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
            payload: {
                theme: 'light',
                fontSize: 'medium',
                language: 'english',
                currency: 'IDR'
            }
        })
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

        dispatch({
            type: ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS,
            payload: {
                // transactions: getFileFromStorage(),
                categories: userCategories,
                logbooks: userLogBooks,
            }
        })

        getFileFromStorage();

    }, [])


    // Get Transaction File from storage
    const getFileFromStorage = async () => {
        try {
            const json = await AsyncStorage.getItem('trx');
            if (json != null) {
                const parsed = JSON.parse(json);
                dispatch({
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
            initialRouteName={screens.bottomTab}

            screenOptions={{
                headerShown: false
            }}

        >
            <Stack.Screen name={screens.bottomTab} component={BottomTab} />
            <Stack.Screen
                options={{
                    presentation: 'transparentModal',
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }}
                name={screens.modalScreen}
                component={ModalScreen} />
            <Stack.Screen
                options={{
                    presentation: 'transparentModal',
                    headerShown: false,
                    cardOverlayEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }}
                name={screens.actionScreen}
                component={ActionScreen} />
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
                name={screens.transactionDetailsScreen} component={TransactionDetailsScreen} />
        </Stack.Navigator>
    )
}

export default RootStack;