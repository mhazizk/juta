import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import icons from 'react-native-vector-icons/Ionicons';
import RecordsSearchScreen from '../navigation/screens/search/RecordsSearchScreen';
import LogBookSearchScreen from '../navigation/screens/search/LogBookSearchScreen';
import CategorySearchScreen from '../navigation/screens/search/CategorySearchScreen';

const Tab = createMaterialTopTabNavigator();

const SearchResultTab = () => {


    const search = {
        recordsSearchResult: 'Records Search Screen',
        logBookSearchResult: 'LogBook Search Screen',
        categorySearchResult: 'Category Search Screen'
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: '#000' },
                
            }}>
            <Tab.Screen options={{title:'Records'}} name={search.recordsSearchResult} component={RecordsSearchScreen} />
            <Tab.Screen options={{title:'Log Books'}} name={search.logBookSearchResult} component={LogBookSearchScreen} />
            <Tab.Screen options={{title:'Categories'}} name={search.categorySearchResult} component={CategorySearchScreen} />
        </Tab.Navigator>
    )
}

export default SearchResultTab;