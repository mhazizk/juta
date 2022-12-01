import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View, StyleSheet, Image } from "react-native"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import Chart from "../../../components/Chart";
import ChartTab from "../../../components/ChartTab";
import TopExpenses from "../../../components/TopExpenses";

const DashboardScreen = ({ navigation }) => {

    const [date, setDate] = useState()

    const checkmark = require('../../../assets/checkmark.png');

    useEffect(() => {
        // in epoch time
        setDate(Date.now()) 
    }, [])

    // convert epoch number in date
    const getHours = new Date(date).getHours();
    // console.log(getHours)

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                {/* //! Header Section */}
                <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'column', paddingHorizontal: 16, }}>
                    <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>
                        {getHours <= 4 ? 'Good Night' :
                            4 < getHours && getHours <= 10 ? 'Good Morning'
                                : 10 < getHours && getHours <= 15 ? 'Good Afternoon'
                                    : 15 < getHours && getHours <= 21 ? 'Good Evening'
                                        : 21 < getHours && getHours <= 24 ? 'Good Night' : 'Good Day'
                        },
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 36, fontWeight: 'bold' }}>
                            Haziz
                        </Text>
                        <Image source={checkmark} style={{ width: 22, height: 22, marginLeft: 4 }} />
                    </View>
                </View>

                {/* //! Chart Section */}
                <TouchableNativeFeedback onPress={() => { alert('test') }}>
                    <View style={{ ...globalStyles.lightTheme.view, flex: 1, flexDirection: 'column' }}>
                        <ChartTab />
                    </View>
                </TouchableNativeFeedback>
                {/* <Chart /> */}


                {/* //! Top Expenses Section */}
                <View style={{ ...globalStyles.lightTheme.view, flex: 1, flexDirection: 'column' }}>
                    <View style={{ ...globalStyles.lightTheme.view, flex: 0, flexDirection: 'column', paddingHorizontal: 16, }}>
                        <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 24 }}>Top Expenses Category</Text>
                    </View>
                    <TopExpenses />
                </View>
            </View>
        </>
    )
}


export default DashboardScreen;