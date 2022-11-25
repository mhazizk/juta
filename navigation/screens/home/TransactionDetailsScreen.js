import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ButtonPrimary, ButtonSecondary, ButtonSwitch } from '../../../components/Button';
import 'intl/locale-data/jsonp/en';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import userCategories from "../../../database/userCategories";
import userLogBooks from "../../../database/userLogBooks";

const NewTransactionDetailsScreen = ({ route, navigation }) => {


    // ! useState Section //

    // Loading State
    const [isLoading, setLoading] = useState(false)


    // Theme State
    const [theme, setTheme] = useState({
        theme: 'lightTheme',
        fontSize: 'medium'
    })

    // Transaction State
    const [transaction, setTransaction] = useState()


    // Logbook State
    const [selectedLogbook, setSelectedLogbook] = useState(
        {
            "logbook_id": "",
            "name": ""
        })

    // Category State
    const [selectedCategory, setSelectedCategory] = useState(
        {
            "name": "",
            "icon": { "name": "", "pack": "" }
        }
    )

    // Loaded User Logbooks
    const [loadedLogbooks, setLoadedLogbooks] = useState();

    // Date State for Date Picker
    const [date, setDate] = useState(new Date())


    // ! useEffect Section //

    useEffect(() => {
        // setLoading(true);
        route?.params?.transaction ?
            setTransaction(route?.params?.transaction) :
            setTransaction({
                "details": {
                    "in_out": 'expense',
                    "amount": 0,
                    "type": null,
                    "date": null,
                    "notes": null,
                    "category_id": null,
                },
                "_timestamps": {
                    "created_at": null,
                    "updated_at": null
                },
                "_id": null,
                "logbook_id": null,
                "transaction_id": null,
            },
            )

        // getFile();

        insertNameInUserLogBook();

        // console.log(transaction)
    }, [])

    useEffect(() => {
        // refresh
        console.log(transaction)
        // findCategoryNameById();
    }, [transaction])

    useEffect(() => {
        // refresh
        console.log('rendered')
    }, [selectedCategory])

    useEffect(() => {
        // refresh
    }, [selectedLogbook])

    useEffect(() => {
        // console.log(loadedLogbooks)
    }, [loadedLogbooks])


    // ! useRef State //
    const inputNotes = useRef(null);


    // ! Function Section //

    // Set Date in Date Picker
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setTransaction({ ...transaction.details.date, details: { ...transaction.details, date: new Date(currentDate).getTime() } });
    };

    // Date Picker
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    // Date Picker
    const showDatepicker = () => {
        showMode('date');
    };


    // Insert 'name' variable into User Logbooks
    const insertNameInUserLogBook = () => {
        const inserted = userLogBooks.map((logbook) => ({ ...logbook, name: logbook.logbook_name }));
        setLoadedLogbooks(inserted);
    }

    // Find Category Name by Id
    const findCategoryNameById = () => {
        const id = transaction.details.category_id;
        const foundExpenseCategory = userCategories.expense.filter((category) => { return category.id === id });
        const foundIncomeCategory = userCategories.income.filter((category) => { return category.id === id });

        if (foundExpenseCategory.length) {
            setSelectedCategory(foundExpenseCategory[0]);
        } else {
            setSelectedCategory(foundIncomeCategory[0]);
        }

        setLoading(false)
    }

    // Save Transaction File locally
    const saveFile = async () => {
        try {
            await AsyncStorage.setItem('trx', JSON.stringify(transaction))
        } catch (error) {
            alert(error)
        }
    }

    // Get Transaction File from storage
    // const getFile = async () => {
    //     try {
    //         const json = await AsyncStorage.getItem('trx');
    //         if (json != null) {
    //             setTransaction(JSON.parse(json))
    //             findCategoryNameById();
    //         }
    //     } catch (error) {
    //         alert(error)
    //     }
    // }


    return (
        <>
            {transaction && <View style={[{ ...globalStyles.lightTheme.view, height: '100%' }, { ...globalTheme.lightTheme.view }]}>
                <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                    {/* // ! Amount Section */}
                    <View style={{ ...globalStyles.lightTheme.view, flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={[{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }, { color: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ccc' }]}>Rp</Text>
                        <TextInput
                            maxLength={20}
                            textAlign='center'
                            returnKeyType='done'
                            keyboardType='number-pad'
                            placeholder={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}
                            style={[{ ...globalStyles.lightTheme.textPrimary, height: 36, fontSize: 36 }, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}
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

                    {/* // ! Details Section */}
                    <View style={[{ ...globalStyles.lightTheme.listContainer, justifyContent: 'space-between' }]}>
                        <View style={{ ...globalStyles.lightTheme.view }}>
                            <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>{transaction.details.in_out[0].toUpperCase() + transaction.details.in_out.substring(1)} Details</Text>
                        </View>
                    </View>

                    {/* // ! Transaction Type Section */}
                    <TouchableNativeFeedback onPress={() => navigation.navigate(
                        'Modal Screen',
                        {
                            title: 'Transaction',
                            props: [{ name: 'expense' }, { name: 'income' }],
                            selectedList: (item) => {
                                setTransaction({
                                    ...transaction,
                                    details: {
                                        ...transaction.details,
                                        in_out: item.name,
                                        type: null,
                                    }
                                });
                                setSelectedCategory();
                            },
                            default: { name: transaction.details.in_out }
                        })}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <IonIcons name='swap-horizontal-sharp' size={18} style={{ paddingRight: 16 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Transaction</Text>

                                {/* // ! Container */}
                                <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ddd' }]}>

                                    {/* // ! Transaction Picker */}
                                    <Text
                                        style={[globalStyles.lightTheme.textPrimary, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}>
                                        {transaction.details.in_out[0].toUpperCase() + transaction.details.in_out.substring(1)}
                                    </Text>

                                </View>
                                <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} />
                            </View>
                        </View>
                    </TouchableNativeFeedback>


                    {/* // ! Type Section */}
                    <TouchableNativeFeedback onPress={() => navigation.navigate(
                        'Modal Screen',
                        {
                            title: 'Type',
                            props: transaction?.details?.in_out === 'expense' ? [{ name: 'cash' }, { name: 'loan' }] : [{ name: 'cash' }],
                            selectedList: (item) => { setTransaction({ ...transaction, details: { ...transaction.details, type: item.name } }) },
                            default: { name: transaction.details.type }
                        })}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome5 name='coins' size={18} style={{ paddingRight: 16 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Type</Text>

                                {/* // ! Container */}
                                <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ddd' }]}>

                                    {/* // ! Type Picker */}
                                    <Text
                                        style={[globalStyles.lightTheme.textPrimary, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}>
                                        {!transaction?.details?.type ? 'Pick type' : transaction?.details?.type[0].toUpperCase() + transaction?.details?.type?.substring(1)}
                                    </Text>

                                </View>
                                <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} />
                            </View>
                        </View>
                    </TouchableNativeFeedback>


                    {/* // ! Date Section */}
                    <TouchableNativeFeedback onPress={showDatepicker}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <IonIcons name='calendar' size={18} style={{ paddingRight: 16 }} />
                                {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Date</Text>

                                {/* // ! Container */}
                                <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ddd' }]}>

                                    {/* // ! Date Picker */}
                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}>
                                        {!transaction?.details?.date ? 'Pick date' : new Date(transaction.details.date).toDateString()}
                                    </Text>

                                </View>
                                <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} />

                            </View>
                        </View>
                    </TouchableNativeFeedback>


                    {/* // ! Log Book Section */}
                    <TouchableNativeFeedback onPress={() => navigation.navigate(
                        'Modal Screen',
                        {
                            title: 'Log Books',
                            props: loadedLogbooks,
                            selectedList: (item) => {
                                setSelectedLogbook({ name: item.name, logbook_id: item.logbook_id });
                                setTransaction({
                                    ...transaction,
                                    logbook_id:
                                        item.logbook_id
                                });
                            },
                            default: { name: selectedLogbook?.name }
                        })}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <IonIcons name='book' size={18} style={{ paddingRight: 16 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>From Book</Text>

                                {/* // ! Container */}
                                <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ddd' }]}>

                                    {/* // ! Book Picker */}
                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}>
                                        {!selectedLogbook?.name ? 'Pick Logbook' : selectedLogbook?.name[0].toUpperCase() + selectedLogbook?.name?.substring(1)}
                                    </Text>

                                </View>
                                <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} />

                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Category Section */}
                    <TouchableNativeFeedback
                        onPress={() => navigation.navigate(
                            'Modal Screen', {
                            title: 'Category',
                            props: transaction.details.in_out === 'expense' ? userCategories.expense : userCategories.income,
                            selectedList: (item) => {
                                setSelectedCategory(item);
                                setTransaction({
                                    ...transaction,
                                    details: {
                                        ...transaction.details,
                                        category_id: item.id
                                    }
                                })
                            },
                            default: selectedCategory
                        })}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <IonIcons name='pricetags' size={18} style={{ paddingRight: 16 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Category</Text>

                                {/* // ! Container */}
                                <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: transaction.details.in_out === 'income' ? '#c3f4f4' : '#ddd' }]}>

                                    {/* // ! Category Picker */}
                                    <IonIcons name={selectedCategory?.icon.name} size={18} style={{ display: selectedCategory?.icon.pack === 'ion_icons' ? 'flex' : 'none', paddingRight: 8 }} />

                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: transaction.details.in_out === 'income' ? '#00695c' : '#000' }]}>
                                        {selectedCategory?.name ? selectedCategory?.name[0].toUpperCase() + selectedCategory?.name.substring(1) : 'Pick category'}
                                    </Text>

                                </View>
                                <IonIcons name='chevron-forward' size={18} style={{ paddingLeft: 16 }} />

                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Notes Section */}
                    <TouchableNativeFeedback onPress={() => inputNotes.current.focus()}>
                        <View style={globalStyles.lightTheme.listContainer}>
                            <View style={{ ...globalStyles.lightTheme.listItem, flexDirection: 'row', alignItems: 'center' }}>
                                <IonIcons name='document-text' size={18} style={{ paddingRight: 16 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>Notes</Text>

                                {/* // ! Container */}
                                {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                                {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                                {/* // ! Notes Input */}
                                <TextInput
                                    ref={inputNotes}
                                    textAlign='right'
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

                                {/* </View> */}
                                {/* <IonIcons name='pencil' size={18} style={{ paddingLeft: 16 }} /> */}
                            </View>

                        </View>
                    </TouchableNativeFeedback>

                </ScrollView>

                {/* // ! Line Separator */}
                <View style={{ borderColor: '#bbb', borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                    {/* // ! Cancel Button */}
                    <View style={{ paddingRight: 8 }}>
                        <ButtonSecondary label='Cancel' width={150} onPress={() => navigation.goBack()} theme={theme.theme} />
                    </View>

                    {/* // ! Save Button */}
                    <View style={{ paddingLeft: 8 }}>
                        <ButtonPrimary label='Save' width={150} onPress={() => saveFile() && navigation.goBack()} theme={theme.theme} />
                    </View>
                </View>

            </View >}
        </>
    )
}

export default NewTransactionDetailsScreen;