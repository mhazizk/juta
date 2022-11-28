import { forwardRef, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { Text, View, Dimensions, FlatList, Animated, findNodeHandle, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import userCategories from "../../../database/userCategories";
import userLogBooks from "../../../database/userLogBooks";
import userTransactions from "../../../database/userTransactions";
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import formatCurrency from "../../../assets/formatCurrency";
import { ButtonPrimary } from "../../../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intl from 'intl';
import 'intl/locale-data/jsonp/en';
import { ACTIONS, globalTransactions, initialTransactions } from "../../../modules/GlobalReducer";
import { useGlobalTransactions } from "../../../modules/GlobalContext";


const { width, height } = Dimensions.get('screen');


const Transactions = ({ logbook_id, transactions, categories, onPress }) => {

    const [sortedTransactions, setSortedTransactions] = useState(null);
    const [transactionsDate, setTransactionsDate] = useState(null);

    useEffect(() => {
        // if (transactions) {
        //     setSortedTransactions(transactions.sort(sortTransactions))
        // }
    }, [])

    useEffect(() => {
        if (transactions) {
            setSortedTransactions(transactions.sort(sortTransactions))
        }

    }, [transactions])

    useEffect(() => {
        // console.log(sorted)
        getDateToArray();
    }, [sortedTransactions])

    useEffect(() => {
        // refresh
    }, [transactionsDate])


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
    }, [categories])

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
    }, [categories])

    // Sort Transactions by Date Descending
    const sortTransactions = useMemo(() => {
        return (
            (prevTransaction, currentTransaction) => {
                if (prevTransaction.details.date < currentTransaction.details.date) {
                    return 1;
                }
                if (prevTransaction.details.date > currentTransaction.details.date) {
                    return -1;
                }
                return 0;
            }
        )
    }, [transactions])

    // Map Transactions Date to Array
    const getDateToArray = useMemo(() => {
        return (
            () => {
                if (sortedTransactions) {
                    const arrDate = sortedTransactions.map((transaction) => { return transaction.details.date })
                    const localDate = arrDate.map((transaction) => { return new Date(transaction).toLocaleDateString() })
                    // console.log(localDate)
                    setTransactionsDate(localDate);
                }
            })
    }, [sortedTransactions])

    const getTransactionsByDate = useMemo(() => {
        return (
            (date) => {
                if (date) {
                    const found = sortedTransactions.filter((transaction) => new Date(transaction.details.date).toLocaleDateString() === date)
                    return found.map((transaction) => transaction)
                }
            }
        )
    }, [sortedTransactions])


    return (
        <>

            <Animated.FlatList
                data={transactionsDate}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    return (
                        <>
                            {transactionsDate &&
                                <View style={{ paddingHorizontal: 16 }}>
                                    <Text style={[{ ...globalStyles.lightTheme.textSecondary },]}>{item}</Text>
                                </View>}

                            <Animated.FlatList
                                data={getTransactionsByDate(item)}
                                keyExtractor={(item) => item.transaction_id}
                                renderItem={({ item }) => {
                                    return (
                                        <>
                                            {sortedTransactions &&
                                                <TouchableNativeFeedback onPress={() => onPress(item)}>
                                                    <View style={globalStyles.lightTheme.listContainer}>
                                                        <View style={{ paddingRight: 16 }}>
                                                            <IonIcons name={findCategoryIconNameById(item.details.category_id)} size={18} />
                                                        </View>
                                                        <View style={globalStyles.lightTheme.listItem}>
                                                            <Text style={globalStyles.lightTheme.textPrimary}>{findCategoryNameById(item.details.category_id)}</Text>
                                                            <Text>{new Date(item.details.date).toLocaleDateString()}</Text>
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
                            />
                        </>
                    )
                }}
            />

            {/* <Animated.FlatList
                data={transactions.sort(sortTransactions)}
                keyExtractor={(item) => item.transaction_id}
                renderItem={({ item }) => {
                    return (
                        <>
                            {sortedTransactions &&
                                <TouchableNativeFeedback onPress={() => onPress(item)}>
                                    <View style={globalStyles.lightTheme.listContainer}>
                                        <View style={{ paddingRight: 16 }}>
                                            <IonIcons name={findCategoryIconNameById(item.details.category_id)} size={18} />
                                        </View>
                                        <View style={globalStyles.lightTheme.listItem}>
                                            <Text style={globalStyles.lightTheme.textPrimary}>{findCategoryNameById(item.details.category_id)}</Text>
                                            <Text>{new Date(item.details.date).toLocaleDateString()}</Text>
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
            /> */}



            {!transactions?.length &&
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='documents' size={48} color='#bbb' style={{ padding: 16 }} />
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>No Transactions</Text>
                </View>}
        </>
    )
}


const LogBookScreen = ({ navigation }) => {

    // ! useState Section //
    const { state, dispatch } = useGlobalTransactions();
    const [logbooks, setLogbooks] = useState(null);
    const [categories, setCategories] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [data, setData] = useState(null)
    const [selectedLogbooks, setSelectedLogbooks] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(null);


    // ! useEffect Section
    useEffect(() => {
        // setLogbooks(userLogBooks);
        // setCategories(userCategories);
        // setTransactions(userTransactions);
    }, [])

    useEffect(() => {
        // refresh
        // console.log(logbooks?.length)
        // console.log(logbooks)
        // if (state.logbooks) {
        //     dispatch({
        //         type: ACTIONS.LOGBOOKS.SET,
        //         payload: logbooks
        //     })
        // }
    }, [state.logbooks])


    useEffect(() => {
        // refresh
        // console.log(categories)
        // if (state.categories) {
        //     dispatch({
        //         type: ACTIONS.CATEGORIES.SET,
        //         payload: categories
        //     })
        // }
    }, [state.categories])

    useEffect(() => {
        // refresh
        // console.log(transactions?.length)
        // logbooksToBeSelected()
        // dispatch({
        //     type: ACTIONS.TRANSACTIONS.SET,
        //     payload: transactions
        // })
        // saveFile();
    }, [transactions])

    useEffect(() => {
        // refresh

        // console.log(data)
    }, [data])

    useEffect(() => {
        // refresh
        // console.log(selectedLogbooks)
        // console.log(state.transactions)
        filterTransactions();
    }, [selectedLogbooks])

    useEffect(() => {
        // refresh
    }, [filteredTransactions])

    useEffect(() => {
        logbooksToBeSelected();
        console.log(state?.transactions?.length)
        console.log(state?.logbooks?.length)
        // console.log(state?.categories)
    }, [state])


    // ! Function Section //
    const logbooksToBeSelected = () => {
        try {
            if (state.logbooks && state.transactions && state.categories) {

                // set data to be passed in modal
                setData(state.logbooks.map((logbook) => ({
                    name: logbook.logbook_name,
                    logbook_id: logbook.logbook_id,
                    key: logbook.logbook_id
                })))

                // set initial selected logbook
                setSelectedLogbooks({
                    name: state.logbooks[0].logbook_name,
                    logbook_id: state.logbooks[0].logbook_id,
                    key: state.logbooks[0].logbook_id
                })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const filterTransactions = () => {
        if (selectedLogbooks && state.transactions) {
            const filtered = state.transactions.filter((transaction) => { return transaction.logbook_id === selectedLogbooks.logbook_id });
            setFilteredTransactions(filtered.map((transaction) => transaction));
        }
    }

    // Save Transaction File locally
    const saveFile = async () => {
        try {
            await AsyncStorage.setItem('trx', JSON.stringify(transactions))
        } catch (error) {
            alert(error)
        }
    }


    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>

                {/* Header */}
                {filteredTransactions &&
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
                                {!filteredTransactions.length ? 'No' : filteredTransactions.length} Transactions
                            </Text>
                        </View>
                    </View>}


                {/* Transaction Render */}
                {filteredTransactions &&
                    <Transactions
                        logbook_id={selectedLogbooks.logbook_id}
                        transactions={filteredTransactions}
                        categories={state.categories}
                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item })}
                    />}
            </View>
        </>
    )
}

export default LogBookScreen;