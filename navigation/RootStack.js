import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native"
import BottomTab from "./BottomTab";
import ModalScreen from "./screens/ModalScreen";


const Stack = createStackNavigator();
const screens = {
    bottomTab: 'Bottom Tab',
    modalScreen: 'Modal Screen'
}
const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={screens.bottomTab}
            
            screenOptions={{
                presentation:'transparentModal',
                headerShown:false,
                cardOverlayEnabled: true,
                // cardStyle: { backgroundColor: 'transparent' },
                // cardStyleInterpolator: ({ current: { progress } }) => ({
                //     cardStyle: {
                //         opacity: progress.interpolate({
                //             inputRange: [0, 0.5, 0.9, 1],
                //             outputRange: [0, 0.25, 0.7, 1],
                //         }),
                //     },
                //     overlayStyle: {
                //         opacity: progress.interpolate({
                //             inputRange: [0, 1],
                //             outputRange: [0, 0.5],
                //             extrapolate: 'clamp',
                //         }),
                //     },
                // }),
            }}
            
        >
            <Stack.Screen name={screens.bottomTab} component={BottomTab} />
            <Stack.Screen name={screens.modalScreen} component={ModalScreen} />
        </Stack.Navigator>
    )
}

export default RootStack;