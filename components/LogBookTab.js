import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LogBookScreen from '../navigation/screens/home/LogBookScreen';
import NewLogBookScreen from '../navigation/screens/home/NewLogBookScreen';
import NewLogScreen from '../navigation/screens/home/NewLogScreen';
import UserScreen from '../navigation/screens/user/UserScreen';
import icons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();

const LogBookTab = () => {


    const logBooks = {
        logBook1: 'logBook1',
        logBook2: 'logBook2',
        newLogBookScreen: 'New Log Book Screen'
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: '#000' },
                
            }}>
            <Tab.Screen name={logBooks.logBook1} component={LogBookScreen} />
            <Tab.Screen name={logBooks.logBook2} component={LogBookScreen} />
            <Tab.Screen options={{ title: 'Add' }} name={logBooks.newLogBookScreen} component={NewLogBookScreen} />
        </Tab.Navigator>
    )
}

export default LogBookTab;