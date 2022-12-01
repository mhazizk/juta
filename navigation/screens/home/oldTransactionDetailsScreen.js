import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ButtonPrimary, ButtonSecondary, ButtonSwitch } from '../../../components/Button';
import 'intl/locale-data/jsonp/en';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const oldTransactionDetailsScreen = ({ route, navigation }) => {

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


    const [transaction, setTransaction] = useState({
        "details": {
            "in_out": true,
            "amount": 0,
            "type": 'cash',
            "date": 1668417842643,
            "notes": ''
        },
        "_timestamps": {
            "created_at": 1668417842641,
            "updated_at": 1668417842641
        },
        "_id": "63720ad4e2f8048280ea8b00",
        "logbook_id": "63720932e2f8048280ea8af4",
        "record_id": "63720932e2f8048280ea8af5",
    })


    useEffect(() => {
        route?.params?.amount ?
            setTransaction({
                ...transaction,
                details: {
                    ...transaction.details,
                    amount: route?.params?.amount,
                }
            }) : null
    }, [])

    useEffect(() => {
        // refresh
        console.log(transaction.details)
    }, [transaction])


    return (
        <>
            <View style={{ ...globalStyles.lightTheme.view, height: '100%' }}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                    {/* // ! Amount Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>Rp</Text>
                        <TextInput
                            maxLength={20}
                            textAlign='center'
                            returnKeyType='done'
                            keyboardType='number-pad'
                            placeholder={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}
                            style={{ ...globalStyles.lightTheme.textPrimary, height: 36, fontSize: 36 }}
                            onChangeText={(string) => {
                                const float =
                                    string ?
                                        parseFloat(parseFloat(string.replace(/,/g, '')).toFixed(2)) : 0
                                setTransaction({
                                    ...transaction,
                                    details: {
                                        ...transaction.details,
                                        amount: float
                                    }
                                })
                            }}
                            clearButtonMode='while-editing'
                            defaultValue={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}
                            value={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}
                        />
                    </View>
                    {/* </ScrollView> */}

                    {/* // ! Details */}
                    <View style={{ ...globalStyles.lightTheme.view, paddingHorizontal: 16 }}>
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>Details</Text>
                    </View>

                    {/* // ! Type Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 16 }}>
                    <FontAwesome5 name='coins' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Type</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                            {/* // ! Cash Button */}
                            <ButtonSwitch
                                label='Cash'
                                theme={theme.theme}
                                condition={transaction.details.type === 'cash'}
                                onPress={() => setTransaction({ ...transaction, details: { ...transaction.details, type: 'cash' } })}
                            />

                            {/* //! OR */}
                            <View>
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1, padding: 8 }}>or</Text>
                            </View>

                            {/* // ! Loan Button */}
                            <ButtonSwitch
                                label='Loan'
                                theme={theme.theme}
                                condition={transaction.details.type === 'loan'}
                                onPress={() => setTransaction({ ...transaction, details: { ...transaction.details, type: 'loan' } })}
                            />
                        </View>
                    </View>


                    {/* // ! Date Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='calendar' size={18} style={{ paddingRight: 16 }} />

                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Date</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                            {/* // ! Today Button */}
                            <ButtonSwitch
                                label='Today'
                                theme={theme.theme}
                                condition={new Date(transaction.details.date).getDate() === new Date().getDate()}
                                onPress={() => setTransaction({ ...transaction, details: { ...transaction.details, date: Date.now() } })}
                            />



                            {/* //! OR */}
                            <View>
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 0, padding: 8 }}>or</Text>
                            </View>

                            {/* // ! Pick Date Button */}
                            <ButtonSwitch
                                label={transaction.details.date ? new Date(transaction.details.date).toLocaleDateString() : 'Pick Date'}
                                theme={theme.theme}
                                onPress={showDatepicker}
                                condition={new Date(transaction.details.date).getDate() !== new Date().getDate()}
                            />
                        </View>
                    </View>


                    {/* // ! Log Book Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='book' size={18} style={{ paddingRight: 16 }} />

                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>From Book</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                            {/* // ! Book Picker */}
                            <ButtonPrimary
                                label={logbookData.logbook_selected.logbook_name ? logbookData.logbook_selected.logbook_name[0].toUpperCase() + logbookData.logbook_selected.logbook_name.substring(1) : 'Select Log Book'}
                                width={150}
                                theme={theme.theme}
                                onPress={() => navigation.navigate(
                                    'Modal Screen',
                                    {
                                        title: 'Log Books',
                                        props: logbookData.logbook_list,
                                        selectedList: (item) => { setLogBookData({ ...logbookData, logbook_selected: { ...logbookData.logbook_selected, logbook_name: item } }) },
                                        default: logbookData.logbook_selected.logbook_name
                                    })}
                            />
                        </View>
                    </View>


                    {/* // ! Category Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='pricetags' size={18} style={{ paddingRight: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Category</Text>

                        {/* // ! Container */}
                        <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                            {/* // ! Category Picker */}
                            <ButtonPrimary
                                label={category.category_selected.category_name ? category.category_selected.category_name[0].toUpperCase() + category.category_selected.category_name.substring(1) : 'Select Category'}
                                width={150}
                                theme={theme.theme}
                                onPress={() => navigation.navigate(
                                    'Modal Screen', {
                                    title: 'Category',
                                    props: category.category_list,
                                    selectedList: (item) => { setCategory({ ...category, category_selected: { ...category.category_selected, category_name: item } }) },
                                    default: category.category_selected.category_name
                                })}
                            />
                        </View>
                    </View>

                    {/* // ! Notes Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 16 }}>
                        <IonIcons name='document-text' size={18} style={{ paddingRight: 16 }} />

                        <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Notes</Text>

                        {/* // ! Container */}
                        {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                        {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                        {/* // ! Notes Input */}
                        <View style={{ flexDirection: 'row', flex: 1, backgroundColor: '#eee', borderWidth: 0, borderRadius: 8, height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
                            <TextInput
                                textAlign='left'
                                returnKeyType='done'
                                keyboardType='default'
                                placeholder='Add additional notes ...'
                                style={{ ...globalStyles.lightTheme.textPrimary, flex: 5, height: 48, borderRadius: 8, fontSize: 16 }}
                                onChangeText={(string) => {
                                    setTransaction({
                                        ...transaction,
                                        details: {
                                            ...transaction.details,
                                            notes: string
                                        }
                                    })
                                }}
                                clearButtonMode='while-editing'
                                defaultValue={transaction.details.notes}
                                value={transaction.details.notes}
                            />

                        </View>
                        {/* </View> */}
                    </View>


                    {/* // ! Line Separator */}
                    <View style={{ borderColor: '#bbb', borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                    {/* // ! Action Button */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                        {/* // ! Cancel Button */}
                        <View style={{ paddingRight: 8 }}>
                            <ButtonSecondary label='Cancel' width={150} onPress={() => navigation.navigate('Bottom Tab')} theme={theme.theme} />
                        </View>

                        {/* // ! Save Button */}
                        <View style={{ paddingLeft: 8 }}>
                            <ButtonPrimary label='Save' width={150} onPress={() => navigation.goBack()} theme={theme.theme} />
                        </View>
                    </View>


                </ScrollView>
            </View>
        </>
    )
}

export default oldTransactionDetailsScreen;