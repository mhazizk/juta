import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import LogBookTab from '../../../components/LogBookTab';

const HomeScreen = ({ navigation }) => {

    const [recordAxios, setRecordAxios] = useState();
    const [sumRecordsByDate, setSumRecordsbyDate] = useState();

    const checkmark = require('../../../assets/checkmark.png');

    // const getRecords = async () => {
    //     try {
    //         const res = await axios.get('http://192.168.89.240:3003/admin/v1/m/users/')
    //         console.log(res)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        // getRecords();
        // flattenRecordsAmount();
    }, [])

    useEffect(() => {
        // refresh
        // console.log(sumRecordsByDate)
    }, [sumRecordsByDate])

    // const flattenRecordsAmount = () => {
    //     const flatten= [];
    //     if (records) {
    //         const amount = records.forEach((object) => { return setSumRecordsbyDate([...sumRecordsByDate, object.amount]) });
    //         // flatten.push(amount);
    //         // setSumRecordsbyDate(flatten);
    //     } else {
    //         console.log(flatten)
    //     }
    // }

    return (
        <>
            {/* //! Header Section */}
            <View style={{ ...styles.container, flexDirection: 'column' }}>
                <Text style={{ fontSize: 24 }}>
                    Good Morning,
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                        Haziz
                    </Text>
                    <Image source={checkmark} style={{ width: 22, height: 22, marginLeft: 4 }} />
                </View>
            </View>

            {/* //! Summary Section */}
            <TouchableNativeFeedback onPress={() => navigation.push('New Log Screen')}>
                <View style={{ flexDirection: 'column', alignItems: 'center', height: 300, justifyContent: 'center', backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={{ fontSize: 18, opacity: 0.3 }}>
                            Rp
                        </Text>
                        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
                            1.500.000
                        </Text>
                    </View>
                    <Text style={{ fontSize: 18, opacity: 0.3 }}>
                        Total Expense this week
                    </Text>
                    <IonIcons name='add-circle-outline' color='black' size={36} />
                </View>
            </TouchableNativeFeedback>

            {/* // ! Log Books Scroll View */}

            <LogBookTab />
        </>
    )
}

const styles = new StyleSheet.create({
    container: {
        // display: 'flex',
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    HeadContainer: {
        display: 'flex',
        flex: 1,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    scrollView: {
        backgroundColor: 'aqua'
    }
})

export default HomeScreen;