import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import ExpenseChartPreview from './ExpenseChartPreview';
import IncomeChartPreview from './IncomeChartPreview';

const Tab = createMaterialTopTabNavigator();

const ChartTab = () => {

    const charts = {
        expenseChart: 'Expense Chart Preview Screen',
        incomeChart: 'Income Chart Preview Screen'
    }

    return (
        <Tab.Navigator
            initialRouteName={charts.expenseChart}
            screenOptions={{
                tabBarShowLabel:false,
                tabBarStyle:{display:'none'}
            }}>
            <Tab.Screen name={charts.expenseChart} component={ExpenseChartPreview} />
            <Tab.Screen name={charts.incomeChart} component={IncomeChartPreview} />
        </Tab.Navigator>
    )
}

export default ChartTab;