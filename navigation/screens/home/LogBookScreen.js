import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { Text, View, Dimensions, FlatList, findNodeHandle, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator, SectionList } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import formatCurrency from "../../../assets/formatCurrency";
import { ButtonPrimary } from "../../../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intl from 'intl';
import 'intl/locale-data/jsonp/en';
import { ACTIONS, globalTransactions, initialTransactions } from "../../../modules/GlobalReducer";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLoading, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalTransactions } from "../../../modules/GlobalContext";
import { setSortedTransactions } from "../../../modules/FetchData";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
// import Swipeable from 'react-native-gesture-handler/Swipeable';


const { width, height } = Dimensions.get('screen');


const Transactions = ({ logbook, transactions, categories, onPress, checkListMode }) => {

    // ! useState Section //
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { appSettings, setAppSettings } = useGlobalAppSettings();
    const [transactionsDate, setTransactionsDate] = useState(null);
    const [groupSortedTransactions, setGroupSortedTransactions] = useState(null);
    const [date, setDate] = useState(null);
    const [checkList, setCheckList] = useState(null);
    const [enableChecklistMode, setEnableCheckListMode] = useState(false);

    // ! useEffect Section //
    useEffect(() => {
        // if (transactions) {
        // }
        setDate(new Date().toLocaleDateString())
        // console.log(sortedTransactions)
    }, [])

    useEffect(() => {
        // if (transactions) {
        //     setSortedTransactions(transactions.sort(sortTransactions))
        // }

    }, [transactions])

    useEffect(() => {
        // if (sortedTransactions) {
        //     groupSorted()
        // }
        // console.log(sortedTransactions)
    }, [sortedTransactions])

    useEffect(() => {
        // refresh
    }, [transactionsDate])

    useEffect(() => {
        // refresh
    }, [date])

    useEffect(() => {
        // refresh
        // console.log(groupSortedTransactions)
    }, [groupSortedTransactions])

    useEffect(() => {

        // checkListMode({ mode: enableChecklistMode, length: 0 })

    }, [enableChecklistMode])

    useEffect(() => {
        // console.log(checkList)
        // if (checkList) {
        //     checkListMode({ mode: enableChecklistMode, length: checkList.length })
        // }
    }, [checkList])





    // ! Function Section //

    // Find Category Icon Name by Id
    const findCategoryIconNameById = useMemo(() => {
        return ((id) => {
            const filteredExpenseCategory = categories.expense.filter((category) => { return category.id === id })
            const filteredIncomeCategory = categories.income.filter((category) => { return category.id === id })

            if (filteredExpenseCategory.length) {
                return filteredExpenseCategory.map((item => item.icon.name));
            } else {
                return filteredIncomeCategory.map((item) => item.icon.name);
            }
        })
    }, [categories, transactions])

    // Find Category Name by Id
    const findCategoryNameById = useMemo(() => {
        return (
            (id) => {
                const filteredExpenseCategory = categories.expense.filter((category) => { return category.id === id })
                const filteredIncomeCategory = categories.income.filter((category) => { return category.id === id })

                if (filteredExpenseCategory.length) {
                    const mapped = filteredExpenseCategory.map((item => item.name));
                    // console.log(mapped[0])
                    return mapped[0][0].toUpperCase() + mapped[0].substring(1);
                } else {
                    const mapped = filteredIncomeCategory.map((item) => item.name);
                    return mapped[0][0].toUpperCase() + mapped[0].substring(1);
                }
            })
    }, [categories, transactions])


    // Sum Amount in Section
    const sumAmount = useMemo(() => {
        return (
            (data) => {
                if (data) {
                    let sum = [];
                    data.forEach((transaction) => sum.push(transaction.details.amount))
                    return sum.reduce((prev, curr) => prev + curr, 0)
                }
            }
        )
    }, [transactions])


    // Relative Date
    const checkDate = useMemo(() => {
        return (
            (data) => {
                const todayYear = new Date(date).getFullYear();
                const transactionsYear = new Date(data).getFullYear();
                const todayDate = new Date(date).getDate();
                const todayMonth = new Date(date).getMonth();
                const transactionDate = new Date(data).getDate();
                const transactionMonth = new Date(data).getMonth();

                switch (true) {
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 0:
                        return 'Today'
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 1:
                        return 'Yesterday'
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 2:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 3:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 4:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 5:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 6:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 7:
                        return new Date(data).toLocaleDateString(appSettings.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) > 7 && (todayDate - transactionDate) <= 31:
                        return `${new Date(data).toLocaleDateString(appSettings.locale, { month: 'long' })} ${new Date(data).getDate()}`
                    default:
                        return (
                            `${new Date(data).toLocaleDateString(appSettings.locale, { month: 'long' })}, ${new Date(data).toLocaleDateString(appSettings.locale, { day: '2-digit', year: 'numeric' })}`
                        )
                }
            }
        )
    }, [date, transactions])



    // console.log(groupByCategory)

    return (
        <>

            {/* CheckList Mode */}
            {enableChecklistMode &&
                <View style={[{ zIndex: 1000, position: 'absolute', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 0 }, { backgroundColor: '#ddd' }]}>
                    <Text style={{ ...globalStyles.lightTheme.textPrimary }}>{!checkList || !checkList.length ? 'Nothing' : `${checkList.length} item(s)`} selected</Text>

                    <View style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>

                        {/* // ! Clear Selection */}
                        <TouchableOpacity
                            onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                        >
                            <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <IonIcons name="close-circle" size={20} style={{ paddingRight: 8 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Clear Selection</Text>
                            </View>
                        </TouchableOpacity>

                        {/* // ! Delete Selection */}
                        {/* <TouchableOpacity
                            onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                        >
                            <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <IonIcons name="trash" size={20} style={{ paddingRight: 8 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Delete Selection</Text>
                            </View>
                        </TouchableOpacity> */}

                        {/* // ! Move Selection */}
                        {/* <TouchableOpacity
                            onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                        >
                            <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <IonIcons name="book" size={20} style={{ paddingRight: 8 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Move To Book</Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>}


            {transactions &&
                <SectionList
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={7}
                    updateCellsBatchingPeriod={1000}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    // removeClippedSubviews
                    sections={transactions}
                    keyExtractor={(item, index) => index.toString()}
                    stickySectionHeadersEnabled
                    renderSectionHeader={({ section }) => (
                        <>
                            {transactions &&
                                <View style={[{ paddingTop: 16, paddingBottom: 8, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' }, { backgroundColor: '#fff' }]}>

                                    {/* Date Title */}
                                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>
                                        {checkDate(section.title)}
                                        {/* {section.customDate} */}
                                    </Text>

                                    {/* Sum Amount */}
                                    <View style={[{ padding: 8, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' }, { backgroundColor: '#ddd' }]}>
                                        <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>{logbook.logbook_currency.symbol}</Text>
                                        <Text style={{ ...globalStyles.lightTheme.textSecondary }}>
                                            {formatCurrency({ amount: sumAmount(section.data), currency: appSettings.currency.name })}
                                        </Text>
                                    </View>
                                </View>}
                        </>
                    )}
                    renderItem={({ item }) => {
                        return (
                            <>
                                {/* <Text>{item.details.amount}</Text> */}
                                {transactions &&
                                    <TouchableNativeFeedback
                                        delayPressIn={0}
                                        onPress={
                                            !enableChecklistMode ?
                                                () => onPress(item) :
                                                () => !checkList ? setCheckList([item.transaction_id]) :
                                                    checkList?.some((checked) => checked === item.transaction_id) ?
                                                        setCheckList(checkList?.filter((checked) => checked !== item.transaction_id)) :
                                                        setCheckList([...checkList, item.transaction_id])
                                            // () => console.log(item.transaction_id)

                                        }
                                        onLongPress={() => {
                                            setEnableCheckListMode(!enableChecklistMode);
                                            setCheckList(null)
                                        }}
                                        delayLongPress={200}
                                    >
                                        <View style={globalStyles.lightTheme.listContainer}>
                                            <View style={globalStyles.lightTheme.listItem}>

                                                {enableChecklistMode &&
                                                    <View style={{
                                                        backgroundColor: checkList?.some((checked) => checked === item.transaction_id) ? '#000' : 'transparent',
                                                        height: 20,
                                                        width: 20,
                                                        borderColor: checkList?.some((checked) => checked === item.transaction_id) ? 'transparent' : '#bbb',
                                                        borderWidth: 1,
                                                        borderRadius: 8,
                                                        marginRight: 16,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <IonIcons name={checkList?.some((checked) => checked === item.transaction_id) ? 'checkmark-sharp' : undefined} size={16} color='#fff' />
                                                    </View>}
                                                <View style={{ paddingRight: 16 }}>
                                                    <IonIcons name={findCategoryIconNameById(item.details.category_id)} size={18} />
                                                </View>

                                                <View style={globalStyles.lightTheme.listItem}>
                                                    {/* With Notes On */}
                                                    <View style={{ flex: 1, paddingRight: 16 }}>
                                                        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center', paddingRight: 16 }}>
                                                            <Text style={[{ marginRight: 8 }, { ...globalStyles.lightTheme.textPrimary }]}>{findCategoryNameById(item.details.category_id)}</Text>
                                                            <IonIcons name="ellipse" color='#ddd' size={8} />
                                                            {item.details.date &&
                                                                <Text numberOfLines={1} style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, marginLeft: 6 }}>{new Date(item.details.date).toLocaleTimeString(appSettings.locale, { hour: '2-digit', minute: '2-digit' })}</Text>}
                                                        </View>
                                                        {item.details.notes &&
                                                            <Text numberOfLines={1} style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, marginRight: 4 }}>{item.details.notes}</Text>}
                                                    </View>


                                                    {/* <Text>{new Date(item.details.date).toLocaleDateString()}</Text> */}
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, marginRight: 4 }}>{logbook.logbook_currency.symbol}</Text>
                                                        <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 18 }}>{formatCurrency({ amount: item.details.amount, currency: appSettings.currency.name })}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                }
                            </>
                        )
                    }}

                />}


            {
                !transactions.length &&
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='documents' size={48} color='#bbb' style={{ padding: 16 }} />
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>No Transactions</Text>
                </View>
            }
        </>
    )
}


const LogBookScreen = ({ route, navigation }) => {

    // ! useState Section //
    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { categories, dispatchCategories } = useGlobalCategories();

    // const [logbooks, setLogbooks] = useState(null);
    // const [categories, setCategories] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [data, setData] = useState(null)
    const [selectedLogbook, setSelectedLogbooks] = useState(null);
    const [selectedLogbooksCurrency, setSelectedLogbookCurrency] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(null);
    const [checkListMode, setCheckListMode] = useState({ mode: false, length: 0 });
    const [counter, setCounter] = useState({
        logbookDeleteCounter: 0,
        logbookPatchCounter: 0
    })
    const isFocused = useIsFocused();

    // ! useFocusEffect Section
    // useIsFocused(
    //     useCallback(() => {
    //         console.log('first')
    //         // logbooksToBeSelected();

    //     }, [
    //         logbooks.logbookPatchCounter,
    //         logbooks.logbookDeleteCounter,
    //         logbooks.logbookInsertCounter,
    //         sortedTransactions.sortedLogbookDeleteCounter,
    //         sortedTransactions.sortedLogbookInsertCounter,
    //         sortedTransactions.sortedTransactionsInsertCounter,
    //         sortedTransactions.sortedTransactionsDeleteCounter,
    //         sortedTransactions.sortedTransactionsPatchCounter,
    //     ]
    //     ))


    // ! useEffect Section
    useEffect(() => {

        dispatchLoading({
            type: ACTIONS.LOADING.SET,
            payload: true
        })

        logbooksToBeSelected();

    }, [])

    useEffect(() => {

        // if (!isFocused) {
        //     dispatchLoading({
        //         type: ACTIONS.LOADING.SET,
        //         payload: true
        //     })
        //     setSelectedLogbooks(null);
        // }

        if (isFocused &&
            logbooks.logbookPatchCounter > counter.logbookPatchCounter ||
            logbooks.logbookDeleteCounter > counter.logbookDeleteCounter) {

            logbooksToBeSelected();
            // TODO set dispatch logbookToOpen to null to prevent stuck in logbook screen after modifying logbook
        }

        // if (counter.logbookDeleteCounter || counter.logbookPatchCounter) {
        //     setData(logbooks.logbooks.map((logbook) => ({
        //         name: logbook.logbook_name,
        //         logbook_id: logbook.logbook_id,
        //         logbook_currency: logbook.logbook_currency,
        //         key: logbook.logbook_id
        //     })))
        // }


    }, [isFocused, counter])


    // useEffect(() => {

    //     logbooksToBeSelected();
    // }, [sortedTransactions])


    useEffect(() => {
    }, [transactions])

    useEffect(() => {
    }, [data])

    useEffect(() => {

        filterTransactions();

    }, [selectedLogbook])

    // useEffect(() => {

    //     // set data to be passed in modal
    //     console.log(logbooks.logbooks)

    // }, [
    //     logbooks.logbookPatchCounter,
    //     logbooks.logbookDeleteCounter,
    //     logbooks.logbookInsertCounter,
    // ])

    useEffect(() => {

        if (filteredTransactions) {
            dispatchLoading({
                type: ACTIONS.LOADING.SET,
                payload: false
            })
        }
    }, [filteredTransactions])

    useEffect(() => {

        console.log('rendered')
        logbooksToBeSelected();

    }, [
        sortedTransactions.sortedLogbookDeleteCounter,
        sortedTransactions.sortedLogbookInsertCounter,
        sortedTransactions.sortedTransactionsInsertCounter,
        sortedTransactions.sortedTransactionsDeleteCounter,
        sortedTransactions.sortedTransactionsDeleteCounter,
        sortedTransactions.logbookToOpen,
    ])

    useEffect(() => {

    }, [isLoading])

    useEffect(() => {
        // console.log(checkListMode)
    }, [checkListMode])


    // ! Function Section //
    const logbooksToBeSelected = useMemo(() => {
        return (
            () => {
                try {
                    if (categories.categories && sortedTransactions && logbooks.logbooks) {

                        // set data to be passed in modal
                        setData(logbooks.logbooks.map((logbook) => ({
                            name: logbook.logbook_name,
                            logbook_id: logbook.logbook_id,
                            logbook_currency: logbook.logbook_currency,
                            key: logbook.logbook_id
                        })))

                        setCounter({
                            logbookDeleteCounter: logbooks.logbookDeleteCounter,
                            logbookPatchCounter: logbooks.logbookPatchCounter
                        })

                        !sortedTransactions?.logbookToOpen ?
                            setSelectedLogbooks({
                                name: logbooks.logbooks[0].logbook_name,
                                logbook_id: logbooks.logbooks[0].logbook_id,
                                logbook_currency: logbooks.logbooks[0].logbook_currency,
                                key: logbooks.logbooks[0].logbook_id
                            })
                            :
                            // set initial selected logbook
                            setSelectedLogbooks(sortedTransactions.logbookToOpen)

                        // set initial selected logbook
                    }
                } catch (error) {
                    console.log(error)
                }

            }
        )

    })

    const filterTransactions = useMemo(() => {
        return (
            () => {
                if (selectedLogbook && sortedTransactions) {
                    const filtered = sortedTransactions.groupSorted.filter((logbook) => { return logbook.logbook_id === selectedLogbook.logbook_id });
                    setFilteredTransactions(filtered[0].transactions.map((transaction) => transaction));
                }
            }
        )
    }, [selectedLogbook, sortedTransactions.logbookToOpen])

    const countTransactions = (filtered) => {
        let array = [];
        filtered.forEach((section) => section.data.forEach((transaction) => array.push(transaction.transaction_id)))
        return array.length
    }


    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>

                {/* Header */}
                {!isLoading.status && filteredTransactions &&
                    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 }]}>
                        <TouchableOpacity
                            style={{ flexShrink: 1, flexGrow: 1, maxWidth: '70%' }}
                            onPress={() => navigation.navigate(
                                'Modal Screen',
                                {
                                    title: 'Log Books',
                                    props: data,
                                    modalType: 'list',
                                    selected: (item) => {
                                        // navigation.navigate('Loading Screen', {
                                        //     loadingType: 'switchLogBook'
                                        // })
                                        setSelectedLogbooks(item);
                                    },
                                    default: { name: selectedLogbook?.name }
                                })}>
                            <View style={[{ height: 48, paddingLeft: 16, flexDirection: 'row', borderRadius: 8, justifyContent: 'space-between', alignItems: 'center' }, { backgroundColor: '#ddd' }]}>
                                <Text
                                    numberOfLines={1}
                                    style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>
                                    {selectedLogbook?.name[0].toUpperCase() + selectedLogbook?.name.substring(1)}
                                </Text>
                                <IonIcons name='chevron-down' size={18} style={{ flexShrink: 0, paddingHorizontal: 16 }} />
                            </View>
                        </TouchableOpacity>

                        {/* Number of Transactions */}
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text numberOfLines={1} style={{ ...globalStyles.lightTheme.textSecondary }}>
                                {!filteredTransactions.length ? 'No' : countTransactions(filteredTransactions)} Transactions
                            </Text>
                        </View>
                    </View>}

                {/* CheckList Mode */}
                {/* {checkListMode.mode &&
                    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 }]}>
                        <Text style={{ ...globalStyles.lightTheme.textSecondary }}>{checkListMode.length} selected</Text>
                    </View>} */}


                {/* Transaction Render */}
                {!isLoading.status && filteredTransactions &&
                    <Transactions
                        logbook={selectedLogbook}
                        transactions={filteredTransactions}
                        categories={categories.categories}
                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item, selectedLogbook: selectedLogbook })}
                        checkListMode={(item) => setCheckListMode(item)}
                    />}

                {/* Loading data indicator */}
                {isLoading.status &&
                    <View style={{ backgroundColor: '#fff', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                        <ActivityIndicator size={48} color='#000' style={{ padding: 16 }} />
                        <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Loading ...</Text>
                    </View>}

            </View>


        </>
    )
}

export default LogBookScreen;