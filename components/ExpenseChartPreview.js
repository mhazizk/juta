import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { VictoryChart, VictoryGroup, VictoryLine, VictoryTheme } from 'victory-native';
import { globalStyles, globalTheme } from "../assets/globalStyles";


const ExpenseChartPreview = ({ route, navigation }) => {

    const [chartData, setChartData] = useState({
        data: [
            { date: 1, amount: 13000 },
            { date: 2, amount: 16500 },
            { date: 3, amount: 14250 },
            { date: 4, amount: 19000 },
            { date: 5, amount: 49000 }
        ]
    })

    useEffect(() => {
        // refresh
    }, [])


    return (
        <>
            {/* //! Summary Section */}
            <TouchableNativeFeedback onPress={() => { navigation.navigate('Analytics Screen') }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', zIndex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 18 }}>
                                Rp
                            </Text>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 32, fontWeight: 'bold' }}>
                                1.500.000
                            </Text>
                        </View>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 18 }}>
                            Total Expense this Month
                        </Text>
                    </View>
                    {/* <IonIcons name='analytics' color='black' size={36} /> */}

                    <View style={{ position: 'absolute', zIndex: 0 }}>
                        <VictoryGroup theme={VictoryTheme.grayscale} >
                            <VictoryLine data={chartData.data} animate={{ duration: 100 }} interpolation='natural' x='date' y='amount' style={{ data: { stroke: '#ccc' } }} />
                        </VictoryGroup>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </>
    )
}

export default ExpenseChartPreview;