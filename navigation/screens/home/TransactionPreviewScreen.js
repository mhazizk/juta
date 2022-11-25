import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ButtonPrimary, ButtonSecondary, ButtonSwitch } from '../../../components/Button';
import 'intl/locale-data/jsonp/en';
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const TransactionPreviewScreen = ({ route, navigation }) => {

    const [theme, setTheme] = useState({
        theme: 'lightTheme',
        fontSize: 'medium'
    })


    const [date, setDate] = useState(new Date())

    const [logbookData, setLogBookData] = useState(
        {
            logbook_list: ['private', 'school', 'business'],
            logbook_selected: {
                "logbook_id": "63720932e2f8048280ea8af4",
                "logbook_name": "private"
            }
        })

    const [category, setCategory] = useState(
        {
            category_list: ['food and drink', 'transportation', 'gadget', 'property', 'laptop', 'house bill', 'electric bill', 'water bill', 'internet', 'school'],
            category_selected: {
                "category_id": "",
                "category_name": "food and drink"
            }
        })

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setTransaction({ ...transaction.details.date, details: { ...transaction.details, date: new Date(currentDate).getTime() } });
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const [transaction, setTransaction] = useState();


    useEffect(() => {
        setTransaction(route?.params?.transaction)
    }, [])

    useEffect(() => {
        // refresh
        // console.log(transaction.details)
    }, [transaction])


    return (
        <>{transaction &&
            <View style={{ ...globalStyles.lightTheme.view, height: '100%' }}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                    {/* // ! Amount Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <View style={{ ...globalStyles.lightTheme.view, flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>Rp</Text>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, height: 36, fontSize: 36 }}>{Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}</Text>
                        </View>
                        <View style={{ ...globalStyles.lightTheme.view, flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, paddingTop: 8 }}>{transaction.details.in_out === 1 ? 'Income' : 'Expense'}</Text>
                        </View>
                    </View>
                    {/* </ScrollView> */}

                    {/* // ! Details */}
                    <View style={{ ...globalStyles.lightTheme.view, paddingHorizontal: 16 }}>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>{transaction.details.in_out[0].toUpperCase() + transaction.details.in_out.substring(1)} Details</Text>
                    </View>

                    {/* // ! Type Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                        <FontAwesome5 name='coins' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Type</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                            {/* // ! Type State */}
                            <Text style={globalStyles.lightTheme.textPrimary}>{transaction.details.type[0].toUpperCase() + transaction.details.type.substring(1)}</Text>

                        </View>
                    </View>


                    {/* // ! Date Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='calendar' size={18} style={{ paddingRight: 16 }} />
                        {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Date</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                            {/* // ! Today Button */}
                            <Text style={globalStyles.lightTheme.textPrimary}>{new Date(transaction.details.date).toDateString()}</Text>

                        </View>
                    </View>


                    {/* // ! Log Book Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='book' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>From Book</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                            {/* // ! Book Picker */}
                            <Text style={globalStyles.lightTheme.textPrimary}>{logbookData.logbook_selected.logbook_name[0].toUpperCase() + logbookData.logbook_selected.logbook_name.substring(1)}</Text>

                        </View>
                    </View>


                    {/* // ! Category Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='pricetags' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Category</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                            {/* // ! Category Picker */}
                            <Text style={globalStyles.lightTheme.textPrimary}>{category.category_selected.category_name[0].toUpperCase() + category.category_selected.category_name.substring(1)}</Text>

                        </View>
                    </View>

                    {/* // ! Notes Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='document-text' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Notes</Text>

                        {/* // ! Container */}
                        {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                        {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                        {/* // ! Notes Input */}
                        <Text style={globalStyles.lightTheme.textPrimary}>{transaction.details.notes ? transaction.details.notes : 'No notes'}</Text>
                        {/* </View> */}
                    </View>


                    {/* // ! Line Separator */}
                    <View style={{ borderColor: '#bbb', borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                    {/* // ! Action Button */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                        {/* // ! Edit Button */}
                        <View style={{ paddingRight: 8 }}>
                            <ButtonSecondary label='Edit' width={150} onPress={() => navigation.navigate('Transaction Details Screen', { transaction: transaction })} theme={theme.theme} />
                        </View>

                        {/* // ! Delete Button */}
                        <View style={{ paddingLeft: 8 }}>
                            <ButtonSecondary label='Delete' width={150} onPress={() => navigation.navigate('Transaction Details Screen')} theme={theme.theme} />
                        </View>

                        {/* // ! Save Button */}
                        {/* <View style={{ paddingLeft: 8 }}>
                            <ButtonPrimary label='Save' width={150} onPress={() => navigation.goBack()} theme={theme.theme} />
                        </View> */}
                    </View>


                </ScrollView>
            </View >}
        </>
    )
}

export default TransactionPreviewScreen;