import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native";
import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";

const LogBookScreen = ({ route, navigation }) => {

    const logBooks = {
        logBook1: 'personal',
        logBook2: 'secret',
        logBook3: 'business'
    }

    const [records, setRecords] = useState([
        { record_id: 1, name: 'haziz', amount: 1000 },
        { record_id: 2, name: 'fariz', amount: 5000.42 },
        { record_id: 3, name: 'joko', amount: 4232 },
        { record_id: 5, name: 'toms', amount: 48459824 },
        { record_id: 6, name: 'toms', amount: 44285984 },
        { record_id: 7, name: 'toms', amount: 481414 },
        { record_id: 8, name: 'toms', amount: 4842155 },
        { record_id: 9, name: 'toms', amount: 4009231584 },
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
                style={globalStyles.lightTheme.view}
                data={records}
                keyExtractor={(item) => item.record_id}
                ListHeaderComponent={
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingHorizontal: 16 }}>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 28 }}>Today</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: '#d1d1d1', height: 28, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, borderRadius: 8 }}>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, color: '#000', marginRight: 4 }}>Rp</Text>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#000', fontSize: 22 }}>6000</Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <>
                        <TouchableNativeFeedback onPress={() => { navigation.navigate('Record Details Screen', item) }}>
                            <View style={globalStyles.lightTheme.listContainer}>
                                <View style={{ paddingRight: 16 }}>
                                    <Image source={checkmark} style={{ width: 18, height: 18 }} />
                                </View>
                                <View style={globalStyles.lightTheme.listItem}>
                                    <Text style={globalStyles.lightTheme.textPrimary}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, marginRight: 4 }}>Rp</Text>
                                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 18 }}>{formatCurrency({ amount: item.amount, locale: 'IDR' })}</Text>
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


export default LogBookScreen;