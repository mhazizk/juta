import { useEffect, useMemo, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ButtonIconDanger, ButtonPrimary, ButtonSecondary, ButtonSwitch } from '../../../components/Button';
import 'intl/locale-data/jsonp/en';
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import categories from "../../../database/userCategories";
import logbooks from "../../../database/userLogBooks";
import { useGlobalAppSettings, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalTransactions } from "../../../modules/GlobalContext";
import { TextPrimary, TextSecondary } from "../../../components/Text";

const TransactionPreviewScreen = ({ route, navigation }) => {

    // ! Global State Section //
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const [category, setCategory] = useState();


    // ! useState Section //

    // Theme State
    const [theme, setTheme] = useState({
        theme: 'lightTheme',
        fontSize: 'medium'
    })

    // Transaction State
    const [transaction, setTransaction] = useState(null);

    // Selected Logbook State
    const [selectedLogbook, setSelectedLogbook] = useState(null)

    const [logbookToOpen, setLogbookToOpen] = useState(null);

    // logbook_id : null
    // logbook_name: null

    // Selected Category State
    const [selectedCategory, setSelectedCategory] = useState(null)


    // ! UseEffect Section //

    useEffect(() => {
        setTransaction(route?.params?.transaction)
    }, [])

    useEffect(() => {
        // refresh
        // console.log(transaction.details)
        findCategoryById();
        // findLogbookNamebyId();
    }, [transaction])

    useEffect(() => {
        // refresh
    }, [selectedCategory])

    useEffect(() => {
        // refresh
    }, [selectedLogbook])

    useEffect(() => {

    }, [logbookToOpen])

    useEffect(() => {

    }, [category])

    // ! Function Section //
    // Find Category
    const findCategoryById = () => {
        if (transaction) {
            const id = transaction.details.category_id;
            const foundExpenseCategory = categories.expense.filter((category) => { return category.id === id });
            const foundIncomeCategory = categories.income.filter((category) => { return category.id === id });

            if (foundExpenseCategory.length) {
                setSelectedCategory(foundExpenseCategory[0]);
            } else {
                setSelectedCategory(foundIncomeCategory[0]);
            }
        }
    }

    // Find Category Name by Id
    const findCategoryNameById = useMemo(() => {
        return (
            () => {
                if (transaction) {
                    const id = transaction.details.category_id;
                    const foundExpenseCategory = categories.expense.filter((category) => { return category.id === id });
                    const foundIncomeCategory = categories.income.filter((category) => { return category.id === id });

                    if (foundExpenseCategory.length) {
                        setSelectedCategory(foundExpenseCategory[0]);
                    } else {
                        setSelectedCategory(foundIncomeCategory[0]);
                    }
                }

            })
    }, [transaction])

    // Find Category Icon Name by Id
    const findCategoryIconNameById = useMemo(() => {
        return (() => {
            if (transaction) {
                const filteredExpenseCategory = categories.expense.filter((category) => { return category.id === transaction.details.category_id })
                const filteredIncomeCategory = categories.income.filter((category) => { return category.id === transaction.details.category_id })

                if (filteredExpenseCategory.length) {
                    return setSelectedCategory(filteredExpenseCategory[0])
                    // return filteredExpenseCategory.map((item => item.icon.name));
                } else {
                    return setSelectedCategory(filteredIncomeCategory[0])
                    // return filteredIncomeCategory.map((item) => item.icon.name);
                }
            }
        })
    }, [transaction])



    // Find Log Book Name by Id
    // const findLogbookNamebyId = useMemo(() => {
    //     return (
    //         () => {
    //             if (transaction) {
    //                 const found = logbooks.logbooks.filter((logbook) => { return logbook.logbook_id === transaction.logbook_id })
    //                 setSelectedLogbook({ logbook_id: found[0].logbook_id, name: found[0].logbook_name, logbook_currency: found[0].logbook_currency })
    //                 // setLogbookToOpen({ logbook_id: found[0].logbook_id, name: found[0].logbook_name })
    //             }
    //         }
    //     )
    // })


    return (
        <>
            {transaction && selectedCategory &&
                <View style={{ backgroundColor: appSettings.theme.style.colors.background, height: '100%' }}>
                    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                        {/* // ! Amount Section */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <TextSecondary
                                    label={route?.params?.selectedLogbook?.logbook_currency.symbol}
                                    style={{ paddingRight: 8 }}
                                />
                                <TextPrimary
                                    label={Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.details.amount)}
                                    style={{ height: 36, fontSize: 36 }}
                                />
                            </View>
                            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextSecondary
                                    label={transaction.details.in_out === 1 ? 'Income' : 'Expense'}
                                    style={{ paddingTop: 8 }}
                                />
                            </View>
                        </View>
                        {/* </ScrollView> */}

                        {/* // ! Details */}
                        <View style={{ paddingHorizontal: 16 }}>
                            <TextPrimary
                                label={`${transaction.details.in_out[0].toUpperCase() + transaction.details.in_out.substring(1)} Details`}
                                style={{ fontSize: 24 }}
                            />
                        </View>

                        {/* // ! Type Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <FontAwesome5 name='coins' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Type'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Container */}
                            <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                {/* // ! Type State */}
                                <TextPrimary
                                    label={transaction.details.type[0].toUpperCase() + transaction.details.type.substring(1)}
                                />

                            </View>
                        </View>


                        {/* // ! Date Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='calendar' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                            <TextPrimary
                                label='Date'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Container */}
                            <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                {/* // ! Today Button */}
                                <TextPrimary
                                    label={new Date(transaction.details.date).toDateString()}
                                />
                            </View>
                        </View>


                        {/* // ! Log Book Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='book' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='From Book'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Container */}
                            {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 2, alignItems: 'center', justifyContent: 'center' }]}> */}

                            {/* // ! Book Picker */}
                            <TextPrimary
                                label={route?.params?.selectedLogbook?.name[0]?.toUpperCase() + route?.params?.selectedLogbook?.name?.substring(1)}
                                style={{ flex: 2, textAlign: 'right' }}
                                numberOfLines={1}
                            />
                            {/* </View> */}
                        </View>


                        {/* // ! Category Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='pricetags' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Category'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Container */}
                            <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>


                                {/* // ! Category Picker */}
                                <IonIcons name={selectedCategory.icon.name} size={18} style={{ paddingRight: 8 }} color={appSettings.theme.style.colors.foreground} />
                                <TextPrimary
                                    label={selectedCategory.name[0].toUpperCase() + selectedCategory.name.substring(1)}
                                />
                            </View>
                        </View>

                        {/* // ! Notes Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', minHeight: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='document-text' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Notes'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Container */}
                            {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                            {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                            {/* // ! Notes Input */}
                            <TextPrimary
                                label={transaction.details.notes ? transaction.details.notes : 'No notes'}
                                style={{ flex: 1, textAlign: 'right' }}
                            />
                            {/* </View> */}
                        </View>


                        {/* // ! Line Separator */}
                        <View style={{ borderColor: '#bbb', borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                        {/* // ! Action Button */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                            {/* // ! Edit Button */}
                            <View style={{ paddingRight: 8 }}>
                                <ButtonSecondary
                                    label='Edit'
                                    width={150}
                                    onPress={() => navigation.navigate('Transaction Details Screen', {
                                        transaction: transaction,
                                        selectedLogbook: route?.params?.selectedLogbook,
                                        selectedCategory: selectedCategory
                                    })}
                                    theme={theme.theme} />
                            </View>

                            {/* // ! Delete Button */}
                            <View style={{ paddingLeft: 8 }}>
                                <ButtonSecondary
                                    label='Delete'
                                    type='danger'
                                    width={150}
                                    theme={theme.theme}
                                    onPress={() => Alert.alert(
                                        'Delete Transaction',
                                        'Are you sure you want to delete this transaction ?',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                }, style: 'cancel'
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    // navigation.navigate('Loading Screen', {
                                                    //     label: 'Deleting Transaction ...',
                                                    //     loadingType: 'deleteOneTransaction',
                                                    //     transaction_id: transaction.transaction_id,
                                                    //     initialTransactionsDeleteCounter: rawTransactions.transactionsDeleteCounter,
                                                    //     initialSortedTransactionsDeleteCounter: sortedTransactions.sortedTransactionsDeleteCounter
                                                    // })
                                                    navigation.navigate('Loading Screen', {
                                                        label: 'Deleting Transaction ...',
                                                        loadingType: 'deleteOneTransaction',
                                                        deleteTransaction: transaction,
                                                        logbookToOpen: selectedLogbook,
                                                        initialSortedTransactionsDeleteCounter: sortedTransactions.sortedTransactionsDeleteCounter
                                                    })
                                                }
                                            }], { cancelable: false }
                                    )}
                                />
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