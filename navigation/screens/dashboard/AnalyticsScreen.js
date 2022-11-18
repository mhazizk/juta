import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableNativeFeedback, TouchableHighlight, View, TouchableOpacity } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons';
import ChartComponent from "../../../components/Chart";

const AnalyticsScreen = () => {

    return (
        <>
            <View style={{ paddingHorizontal: 16, backgroundColor:'#fff', height:'100%', paddingTop: 16 }}>
                <ChartComponent />
            </View>
        </>
    )
}

export default AnalyticsScreen;