import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { Text, View } from "react-native"
import BottomTab from "./BottomTab";
import ActionScreen from "./screens/ActionScreen";
import RecordDetailsScreen from "./screens/home/RecordDetailsScreen";
import ModalScreen from "./screens/ModalScreen";


const Stack = createStackNavigator();
const screens = {
    bottomTab: 'Bottom Tab',
    modalScreen: 'Modal Screen',
    recordDetailsScreen: 'Record Details Screen',
    actionScreen: 'Action Screen'
}
const RootStack = () => {
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
                }}
                name={screens.recordDetailsScreen} component={RecordDetailsScreen} />
        </Stack.Navigator>
    )
}

export default RootStack;