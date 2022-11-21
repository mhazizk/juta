import * as Localization from 'expo-localization';
import { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import { IntlProvider, FormattedRelative, useIntl } from 'react-intl';
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import 'intl/locale-data/jsonp/en';

const RecordDetailsScreen = ({ route, navigation }) => {


    const [date, setDate] = useState(new Date())
    const [picker, setPicker] = useState({
        open: false,
        value: null,

    })

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
            category_list: ['food', '🎨 transportation', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget', 'gadget'],
            category_selected: {
                "category_id": "",
                "category_name": "🎨  Food"
            }
        })

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setRecord({ ...record.details.date, details: { ...record.details, date: new Date(currentDate).getTime() } });
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

    const showTimepicker = () => {
        showMode('time');
    };


    const [record, setRecord] = useState({
        "details": {
            "in_out": true,
            "amount": 10000,
            "type": 'cash',
            "date": 1668417842643
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
        setRecord({
            ...record,
            details: {
                ...record.details,
                amount: route?.params.amount,
            }
        })
    }, [])

    useEffect(() => {
        // refresh
        console.log(record.details.date)
    }, [record])


    return (
        <>
            <View style={{ ...globalStyles.lightTheme.view, height: '100%' }}>
                <View>
                    <Button onPress={showDatepicker} title="Show date picker!" />
                    <Button onPress={showTimepicker} title="Show time picker!" />
                    <Text>selected: {date.toLocaleString()}</Text>
                </View>
                <View style={{ ...globalStyles.lightTheme.view, flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>Rp</Text>
                    <TextInput
                        maxLength={20}
                        returnKeyType='done'
                        keyboardType='number-pad'
                        placeholder={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(record.details.amount)}
                        style={{ ...globalStyles.lightTheme.textPrimary, height: 36, fontSize: 36 }}
                        onChangeText={(string) => {
                            const float =
                                string ?
                                    parseFloat(parseFloat(string.replace(/,/g, '')).toFixed(2)) : 0
                            setRecord({
                                ...record,
                                details: {
                                    ...record.details,
                                    amount: float
                                }
                            })
                        }}
                        clearButtonMode='while-editing'
                        defaultValue={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(record.details.amount)}
                        value={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(record.details.amount)}
                    />
                </View>
                <View style={{ ...globalStyles.lightTheme.view, paddingHorizontal: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>Details</Text>
                </View>

                {/* // ! Type Section */}
                <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', paddingTop: 8, paddingHorizontal: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, flex: 1 }}>Type</Text>

                    {/* // ! Buttons */}
                    <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                        {/* // ! Cash Button */}
                        <View style={[record.details.type === 'cash' ?
                            {
                                ...globalStyles.lightTheme.buttonPrimary,
                                height: 48,
                                width: 80,
                                margin: 4,
                                // borderColor: '#000',
                            } :
                            {
                                ...globalStyles.lightTheme.buttonSecondary,
                                height: 48,
                                width: 80,
                                margin: 4,
                                // borderColor: '#000',
                            },
                        [record.details.type === 'cash' ?
                            globalTheme.lightTheme.buttonPrimary :
                            globalTheme.lightTheme.buttonSecondary
                        ]]}>
                            <TouchableOpacity onPress={() => setRecord({ ...record, details: { ...record.details, type: 'cash' } })}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[
                                        globalStyles.lightTheme.textButtonPrimary,
                                        record.details.type === 'cash' ? globalTheme.lightTheme.textButtonPrimary : globalTheme.lightTheme.textButtonSecondary]}>Cash</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* //! OR */}
                        <View>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1, padding: 8 }}>or</Text>
                        </View>

                        {/* // ! Loan Button */}
                        <View style={[record.details.type === 'loan' ?
                            {
                                ...globalStyles.lightTheme.buttonPrimary,
                                height: 48,
                                width: 80,
                                margin: 4,
                                // borderColor: '#000',
                            } :
                            {
                                ...globalStyles.lightTheme.buttonSecondary,
                                height: 48,
                                width: 80,
                                margin: 4,
                                // borderColor: '#000',
                            },
                        [record.details.type === 'loan' ?
                            globalTheme.lightTheme.buttonPrimary :
                            globalTheme.lightTheme.buttonSecondary
                        ]]}>
                            <TouchableOpacity onPress={() => setRecord({ ...record, details: { ...record.details, type: 'loan' } })}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[
                                        globalStyles.lightTheme.textButtonPrimary,
                                        record.details.type === 'loan' ? globalTheme.lightTheme.textButtonPrimary : globalTheme.lightTheme.textButtonSecondary]}>Loan</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                {/* // ! Date Section */}
                <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', paddingTop: 8, paddingHorizontal: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, flex: 1 }}>Date</Text>

                    {/* // ! Buttons */}
                    <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                        {/* // ! Cash Button */}
                        <View style={[{
                            ...globalStyles.lightTheme.buttonSecondary
                        },
                        {
                            height: 48,
                            width: 80,
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            margin: 4,
                        }]}>
                            <TouchableOpacity onPress={() => setRecord({ ...record, details: { ...record.details, date: Date.now() } })}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...globalStyles.lightTheme.textButtonSecondary }}>Today</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                        {/* //! OR */}
                        <View>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 0, padding: 8 }}>or</Text>
                        </View>

                        {/* // ! Loan Button */}
                        <View style={[{
                            ...globalStyles.lightTheme.buttonPrimary
                        },
                        {
                            height: 48,
                            // width: 80,
                            borderColor: '#000',
                            borderWidth: 0,
                            borderRadius: 8,
                            paddingHorizontal: 14,
                            margin: 4,
                        }]}>
                            <TouchableOpacity onPress={showDatepicker}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>
                                        {record.details.date ? new Date(record.details.date).toLocaleDateString() : 'Pick Date'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                {/* // ! Log Book Section */}
                <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', paddingTop: 8, paddingHorizontal: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, flex: 1 }}>From Book</Text>

                    {/* // ! Buttons */}
                    <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                        {/* // ! Book Picker */}
                        <View style={[{
                            ...globalStyles.lightTheme.buttonPrimary
                        },
                        {
                            height: 48,
                            // width: 80,
                            borderColor: '#000',
                            borderWidth: 0,
                            borderRadius: 8,
                            margin: 4,
                            paddingHorizontal: 16
                        }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                    'Modal Screen', {
                                    title: 'Log Books',
                                    props: logbookData.logbook_list
                                }
                                )}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>{logbookData.logbook_selected.logbook_name ? logbookData.logbook_selected.logbook_name[0].toUpperCase() + logbookData.logbook_selected.logbook_name.substring(1) : 'Select Log Book'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                {/* // ! Category Section */}
                <View style={{ ...globalStyles.lightTheme.view, flexDirection: 'row', paddingTop: 8, paddingHorizontal: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, flex: 1 }}>Category</Text>

                    {/* // ! Buttons */}
                    <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                        {/* // ! Book Picker */}
                        <View style={[{
                            ...globalStyles.lightTheme.buttonPrimary
                        },
                        {
                            height: 48,
                            // width: 80,
                            borderColor: '#000',
                            borderWidth: 0,
                            borderRadius: 8,
                            margin: 4,
                            paddingHorizontal: 16
                        }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                    'Modal Screen', {
                                    title: 'Category',
                                    props: category.category_list
                                }
                                )}>
                                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>{category.category_selected.category_name ? category.category_selected.category_name[0].toUpperCase() + category.category_selected.category_name.substring(1) : 'Select Category'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>




                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>


                    {/* // ! Cancel Button */}
                    <View style={{
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 1,
                        borderRadius: 8,
                        margin: 4
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Log Book Screen')}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonSecondary }}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* // ! Save Button */}
                    <View style={{
                        ...globalStyles.lightTheme.buttonPrimary,
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 0,
                        borderRadius: 8,
                        margin: 4,
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Log Book Screen')}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>



            </View>
        </>
    )
}

export default RecordDetailsScreen;