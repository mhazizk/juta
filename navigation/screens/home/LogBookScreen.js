import { forwardRef, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { Text, View, Dimensions, FlatList, Animated, findNodeHandle, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator, SectionList } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import formatCurrency from "../../../assets/formatCurrency";
import { ButtonPrimary } from "../../../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intl from 'intl';
import 'intl/locale-data/jsonp/en';
import { ACTIONS, globalTransactions, initialTransactions } from "../../../modules/GlobalReducer";
import { useGlobalAppSettings, useGlobalLoading, useGlobalSortedTransactions, useGlobalTransactions } from "../../../modules/GlobalContext";
import { setSortedTransactions } from "../../../modules/FetchData";


const { width, height } = Dimensions.get('screen');


const Transactions = ({ logbook_id, transactions, categories, onPress }) => {

    // ! useState Section //
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { appSettings, setAppSettings } = useGlobalAppSettings();
    const [transactionsDate, setTransactionsDate] = useState(null);
    const [groupSortedTransactions, setGroupSortedTransactions] = useState(null);
    const [date, setDate] = useState(null);

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
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 3:
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 4:
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 5:
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 6:
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) === 7:
                        return new Date(data).toLocaleDateString(appSettings.language.locale, { weekday: 'long' })
                    case (todayYear === transactionsYear) && (todayMonth === transactionMonth) && (todayDate - transactionDate) > 7 && (todayDate - transactionDate) <= 31:
                        return `${new Date(data).toLocaleDateString(appSettings.language.locale, { month: 'long' })} ${new Date(data).getDate()}`
                    default:
                        return (
                            `${new Date(data).toLocaleDateString(appSettings.language.locale, { month: 'long' })}, ${new Date(data).toLocaleDateString(appSettings.language.locale, { dateStyle: 'short' })}`
                        )
                }
            }
        )
    }, [date, transactions])

    // console.log(groupByCategory)

    return (
        <>
            {transactions &&
                <SectionList
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
                                    </Text>

                                    {/* Sum Amount */}
                                    <View style={[{ padding: 8, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' }, { backgroundColor: '#ddd' }]}>
                                        <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>Rp</Text>
                                        <Text style={{ ...globalStyles.lightTheme.textSecondary }}>
                                            {formatCurrency({ amount: sumAmount(section.data), locale: 'IDR' })}
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
                                    <TouchableNativeFeedback onPress={() => onPress(item)}>
                                        <View style={globalStyles.lightTheme.listContainer}>
                                            <View style={{ paddingRight: 16 }}>
                                                <IonIcons name={findCategoryIconNameById(item.details.category_id)} size={18} />
                                            </View>
                                            <View style={globalStyles.lightTheme.listItem}>
                                                <Text style={globalStyles.lightTheme.textPrimary}>{findCategoryNameById(item.details.category_id)}</Text>
                                                {/* <Text>{new Date(item.details.date).toLocaleDateString()}</Text> */}
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ ...globalStyles.lightTheme.textSecondary, fontSize: 14, marginRight: 4 }}>Rp</Text>
                                                    <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 18 }}>{formatCurrency({ amount: item.details.amount, locale: 'IDR' })}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                }
                            </>
                        )
                    }}

                />}


            {!transactions.length &&
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='documents' size={48} color='#bbb' style={{ padding: 16 }} />
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>No Transactions</Text>
                </View>}
        </>
    )
}


const LogBookScreen = ({ navigation }) => {

    // ! useState Section //
    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const [logbooks, setLogbooks] = useState(null);
    const [categories, setCategories] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [data, setData] = useState(null)
    const [selectedLogbooks, setSelectedLogbooks] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(null);


    // ! useEffect Section
    useEffect(() => {

        dispatchLoading({
            type: ACTIONS.LOADING.SET,
            payload: true
        })

        // logbooksToBeSelected();


    }, [])


    useEffect(() => {

    }, [sortedTransactions.groupSorted])

    useEffect(() => {
    }, [rawTransactions.logbooks])


    useEffect(() => {
    }, [rawTransactions.categories])

    useEffect(() => {
    }, [transactions])

    useEffect(() => {
    }, [data])

    useEffect(() => {

        filterTransactions();

    }, [selectedLogbooks])

    useEffect(() => {

        if (filteredTransactions) {
            dispatchLoading({
                type: ACTIONS.LOADING.SET,
                payload: false
            })
        }
    }, [filteredTransactions])

    useEffect(() => {

        logbooksToBeSelected();

    }, [rawTransactions, rawTransactions.transactions, sortedTransactions])

    useEffect(() => {

    }, [isLoading])


    // ! Function Section //
    const logbooksToBeSelected = () => {
        try {
            if (rawTransactions.logbooks && sortedTransactions && rawTransactions.categories) {

                // set data to be passed in modal
                setData(rawTransactions.logbooks.map((logbook) => ({
                    name: logbook.logbook_name,
                    logbook_id: logbook.logbook_id,
                    key: logbook.logbook_id
                })))

                // set initial selected logbook
                setSelectedLogbooks({
                    name: rawTransactions.logbooks[0].logbook_name,
                    logbook_id: rawTransactions.logbooks[0].logbook_id,
                    key: rawTransactions.logbooks[0].logbook_id
                })

            }
        } catch (error) {
            console.log(error)
        }

    }

    const filterTransactions = useMemo(() => {
        return (
            () => {
                if (selectedLogbooks && sortedTransactions) {
                    const filtered = sortedTransactions.groupSorted.filter((logbook) => { return logbook.logbook_id === selectedLogbooks.logbook_id });
                    setFilteredTransactions(filtered[0].transactions.map((transaction) => transaction));
                }
            }
        )
    })

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
                                        setSelectedLogbooks(item);
                                    },
                                    default: { name: selectedLogbooks?.name }
                                })}>
                            <View style={[{ height: 48, paddingLeft: 16, flexDirection: 'row', borderRadius: 8, justifyContent: 'space-between', alignItems: 'center' }, { backgroundColor: '#ddd' }]}>
                                <Text
                                    numberOfLines={1}
                                    style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>
                                    {selectedLogbooks?.name[0].toUpperCase() + selectedLogbooks?.name.substring(1)}
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


                {/* Transaction Render */}
                {!isLoading.status && filteredTransactions &&
                    <Transactions
                        logbook_id={selectedLogbooks.logbook_id}
                        transactions={filteredTransactions}
                        categories={rawTransactions.categories}
                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item })}
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