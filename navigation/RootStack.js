import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import BottomTab from "./BottomTab";
import ActionScreen from "./screens/ActionScreen";
import ModalScreen from "./screens/ModalScreen";
import IonIcons from 'react-native-vector-icons/Ionicons';
import TransactionPreviewScreen from "./screens/home/TransactionPreviewScreen";
import TransactionDetailsScreen from "./screens/home/TransactionDetailsScreen";


const Stack = createStackNavigator();
const screens = {
    bottomTab: 'Bottom Tab',
    modalScreen: 'Modal Screen',
    transactionDetailsScreen: 'Transaction Details Screen',
    transactionPreviewScreen:'Transaction Preview Screen',
    actionScreen: 'Action Screen'
}
const RootStack = ({navigation}) => {
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