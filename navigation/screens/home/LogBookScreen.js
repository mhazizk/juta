import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native";

const LogBookScreen = ({ route, navigation }) => {

    const logBooks = {
        logBook1: 'personal',
        logBook2: 'secret',
        logBook3: 'business'
    }

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

    const checkmark = require('../../../assets/checkmark.png');


    const recordsRender = ({ navigation }) => {
        return (
            <>
                <Text>
                    {route.params?.logBookName ? route.params?.logBookName : 'No Log Book'}
                </Text>
            </>
        )
    }

    return (
        <>
            {/* // ! Records Section */}
            <FlatList
                style={{ backgroundColor: '#fff' }}
                data={records}
                keyExtractor={(item) => item.record_id}
                ListHeaderComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop:16,paddingHorizontal: 16, backgroundColor: '#fff' }}>
                        <Text style={{ fontSize: 28, opacity: 0.3 }}>Today</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: '#d1d1d1', height: 28, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, borderRadius: 8 }}>
                            <Text style={{ fontSize: 14, color: '#fff', marginRight: 4 }}>Rp</Text>
                            <Text style={{ fontSize: 22, color: '#fff' }}>6000</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <>
                        <TouchableNativeFeedback onPress={() => { navigation.navigate('Record Details Screen', item) }}>
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
        paddingLeft: 16,
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

export default LogBookScreen;