import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { VictoryChart, VictoryGroup, VictoryLine, VictoryTheme } from 'victory-native';
import globalStyles from "../assets/globalStyles";


const IncomeChartPreview = ({ route, navigation }) => {

    const [chartData, setChartData] = useState({
        data: [
            { date: 1, amount: 1000 },
            { date: 2, amount: 2000 },
            { date: 3, amount: 3000 },
            { date: 4, amount: 8000 },
            { date: 5, amount: 10000 }
        ]
    })

    useEffect(() => {
        // refresh
    }, [])


    return (
        <>
            {/* //! Summary Section */}
            <TouchableNativeFeedback onPress={() => { alert('Feature in Progress ...') }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', zIndex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 18 }}>
                                Rp
                            </Text>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 32, fontWeight: 'bold' }}>
                                25.500.000
                            </Text>
                        </View>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 18 }}>
                            Total Income this Month
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

export default IncomeChartPreview;