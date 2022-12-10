import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableNativeFeedback, TouchableHighlight, View, TouchableOpacity } from "react-native";
import { VictoryBar, VictoryChart, VictoryLine, VictoryTheme, VictoryZoomContainer } from "victory-native"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../assets/themes/globalStyles";

const ChartComponent = () => {

    const [chartFilter, setChartFilter] = useState({
        expenseFilter: 'week',
        incomeFilter: 'week'
    })

    const [chartData, setChartData] = useState({
        data1: [
            { date: 1, amount: 13000 },
            { date: 2, amount: 16500 },
            { date: 3, amount: 14250 },
            { date: 4, amount: 19000 }
        ],
        data2: [
            { date: 1, amount: 1000 },
            { date: 2, amount: 14220 },
            { date: 3, amount: 15400 },
            { date: 4, amount: 33000 }
        ]
    })

    useEffect(() => {
        // refresh
    }, [chartFilter])

    useEffect(() => {
        // refresh
    }, [])

    const dataA = [
        { date: 1668690952000, amount: 13000 },
        { date: 2, amount: 16500 },
        { date: 3, amount: 14250 },
        { date: 4, amount: 19000 }
    ];
    const dataB = [
        { date: 1, amount: 1000 },
        { date: 2, amount: 14220 },
        { date: 3, amount: 15400 },
        { date: 4, amount: 33000 }
    ];
    const dataC = [
        { date: 1, amount: 122000 },
        { date: 2, amount: 560020 },
        { date: 3, amount: 457400 },
        { date: 4, amount: 664000 }
    ]
    const dataD = [
        { date: 1, amount: 322000 },
        { date: 2, amount: 760020 },
        { date: 3, amount: 357400 },
        { date: 4, amount: 564000 }
    ]
    const dataE = [
        { date: 1, amount: 232000 },
        { date: 2, amount: 650020 },
        { date: 3, amount: 597400 },
        { date: 4, amount: 964000 }
    ]
    const dataF = [
        { date: 1, amount: 832000 },
        { date: 2, amount: 950020 },
        { date: 3, amount: 1097400 },
        { date: 4, amount: 1264000 }
    ]

    console.log(new Date(1668690952000).getDate())
    console.log(Date.now())

    const getDate = (epoch) => {
        return new Date(epoch).getDate();
    }
    
    return (
        <>
            <View style={{ paddingHorizontal: 0 }}>

                {/* //! Title Section */}
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 16, paddingRight: 4 }}>Rp</Text>
                    <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24, fontWeight: 'bold' }}>6000</Text>
                </View>

                {/* //! Chart Section */}
                <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 16, paddingBottom: 16 }}>Total expenses this {chartFilter.expenseFilter}</Text>
                <View style={{ alignItems: 'center' }}>
                    <VictoryChart
                        width={350}
                        padding={{ top: 16, bottom: 50, left: 55, right: 16 }}
                        // animate={{ duration: 1000 }}
                        theme={VictoryTheme.grayscale} >
                        {/* <VictoryBar data={chartData.data1} interpolation='natural' x='date' y='amount' style={{ data: { fill: '#ddd' } }} /> */}
                        <VictoryLine data={chartData.data1} interpolation='natural' x='date' y='amount' />
                        {/* <VictoryLine data={chartData.data2} interpolation='natural' x='date' y='amount' style={{ data: { stroke: '#999' } }} /> */}
                    </VictoryChart>
                </View>

                {/* // ! Chart Filter Section */}
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>

                    {/* Weekly */}
                    <TouchableOpacity onPress={() => { setChartFilter({ ...chartFilter, 'expenseFilter': 'week' }); setChartData({ data1: dataA, data2: dataB }) }}>
                        <View style={{ alignItems: 'center', flex: 0, backgroundColor: `${chartFilter.expenseFilter === 'week' ? '#000' : '#fff'}`, height: 48, width: 100, justifyContent: 'center', borderRadius: 16 }}>
                            <Text style={{ fontSize: 16, color: `${chartFilter.expenseFilter === 'week' ? '#fff' : '#000'}` }}>Week</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Monthly */}
                    <TouchableOpacity onPress={() => { setChartFilter({ ...chartFilter, 'expenseFilter': 'month' }); setChartData({ data1: dataC, data2: dataD }) }}>
                        <View style={{ alignItems: 'center', flex: 0, backgroundColor: `${chartFilter.expenseFilter === 'month' ? '#000' : '#fff'}`, height: 48, width: 100, justifyContent: 'center', borderRadius: 16 }}>
                            <Text style={{ fontSize: 16, color: `${chartFilter.expenseFilter === 'month' ? '#fff' : '#000'}` }}>Month</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Yearly */}
                    <TouchableOpacity onPress={() => { setChartFilter({ ...chartFilter, 'expenseFilter': 'year' }); setChartData({ data1: dataE, data2: dataF }) }}>
                        <View style={{ alignItems: 'center', flex: 0, backgroundColor: `${chartFilter.expenseFilter === 'year' ? '#000' : '#fff'}`, height: 48, width: 100, justifyContent: 'center', borderRadius: 16 }}>
                            <Text style={{ fontSize: 16, color: `${chartFilter.expenseFilter === 'year' ? '#fff' : '#000'}` }}>Year</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default ChartComponent;