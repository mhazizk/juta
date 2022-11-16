import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
    const [records, setRecords] = useState([
        { record_id: 1, name: 'haziz', amount: 1000 },
        { record_id: 2, name: 'fariz', amount: 5000 },
        { record_id: 3, name: 'joko', amount: 4232 },
        { record_id: 5, name: 'toms', amount: 484 },
        { record_id: 6, name: 'toms', amount: 484 },
        { record_id: 7, name: 'toms', amount: 484 },
        { record_id: 8, name: 'toms', amount: 484 },
        { record_id: 9, name: 'toms', amount: 484 },
        { record_id: 10, name: 'toms', amount: 484 },
        { record_id: 11, name: 'toms', amount: 484 },
        { record_id: 12, name: 'toms', amount: 484 },
        { record_id: 13, name: 'toms', amount: 484 },
        { record_id: 14, name: 'toms', amount: 484 }
    ])

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


            {/* // ! Records Section */}
            <FlatList
                data={records}
                keyExtractor={(item) => item.record_id}
                ListHeaderComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 28, opacity: 0.3 }}>Today</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: '#d1d1d1', height: 28, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, borderRadius: 8 }}>
                            <Text style={{ fontSize: 14, color: '#fff', marginRight: 4 }}>Rp</Text>
                            <Text style={{ fontSize: 22, color: '#fff' }}>6000</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <>
                        <TouchableNativeFeedback onPress={() => { navigation.push('Record Details Screen', item) }}>
                            <View style={styles.flatListView}>
                                <Image source={checkmark} style={{ width: 18, height: 18 }} />
                                <View style={styles.flatListViewUnderscore}>
                                    <Text style={styles.flatListViewText}>{item.name}</Text>
                                    <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                        <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                        <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>{item.amount}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </>
                )}
            />
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
    },
    flatListView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        height: 48
    },
    flatListViewUnderscore: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        paddingVertical: 0,
        paddingLeft: 4,
        borderColor: '#d9d9d9',
        borderBottomWidth: 0.5,
        minHeight: 46,
        textAlignVertical: 'center'
    },
    flatListViewText: {
        display: 'flex',
        color: '#000',
        textAlignVertical: 'center',
        fontSize: 18,
        textAlignVertical: 'center'
    }
})

export default HomeScreen;