import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native";
import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import userTransactions from "../../../database/userTransactions";
import userLogBooks from "../../../database/userLogBooks";
import IonIcons from 'react-native-vector-icons/Ionicons';
import userCategories from "../../../database/userCategories";

const LogBookScreen = ({ route, navigation }) => {

    // ! useState section //
    const [transactions, setTransactions] = useState();

    const [logbooks, setLogbooks] = useState()

    const [categories, setCategories] = useState()


    // ! useEffect Section //

    useEffect(() => {
        // refresh
        setTransactions(userTransactions);
        setCategories(userCategories);
        setLogbooks(userLogBooks);
    }, [])

    useEffect(() => {
        // refresh
        console.log(transactions)
    }, [transactions])

    useEffect(() => {
        // refresh
    }, [])

    const logBooks = {
        logBook1: 'personal',
        logBook2: 'secret',
        logBook3: 'business'
    }


    const checkmark = require('../../../assets/checkmark.png');


    const transactionsRender = ({ navigation }) => {
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
            {/* // ! Transactions Section */}
            <FlatList
                style={globalStyles.lightTheme.view}
                data={transactions}
                keyExtractor={(item) => item.record_id}

                // Header component
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
                        <TouchableNativeFeedback onPress={() => { navigation.navigate('Transaction Preview Screen', item) }}>
                            <View style={globalStyles.lightTheme.listContainer}>
                                <View style={{ paddingRight: 16 }}>
                                    <IonIcons />
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