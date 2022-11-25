import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Text, View, Dimensions, FlatList, Animated, findNodeHandle, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import userCategories from "../../../database/userCategories";
import userLogBooks from "../../../database/userLogBooks";
import userTransactions from "../../../database/userTransactions";
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import formatCurrency from "../../../assets/formatCurrency";
import { ButtonPrimary } from "../../../components/Button";

const { width, height } = Dimensions.get('screen');


const Transactions = ({ logbook_id, transactions, categories, onPress }) => {
    // ! Function Section //
    // Find Category Icon Name by Id
    const findCategoryIconName = useMemo(() => {
        return ((id) => {
            const filteredExpenseCategory = categories.expense.filter((category) => { return category.id === id })
            const filteredIncomeCategory = categories.income.filter((category) => { return category.id === id })

            if (filteredExpenseCategory.length) {
                return filteredExpenseCategory.map((item => item.icon.name));
            } else {
                return filteredIncomeCategory.map((item) => item.icon.name);
            }
        })
    }, [transactions])

    // Find Category Name by Id
    const findCategoryName = useMemo(() => {
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
    }, [transactions])


    return (
        <>

            <Animated.FlatList
                data={transactions}
                keyExtractor={(item) => item.transaction_id}
                renderItem={({ item }) => {
                    return (
                        <>
                            {transactions?.length &&
                                <TouchableNativeFeedback onPress={() => onPress(item)}>
                                    <View style={globalStyles.lightTheme.listContainer}>
                                        <View style={{ paddingRight: 16 }}>
                                            <IonIcons name={findCategoryIconName(item.details.category_id)} size={18} />
                                        </View>
                                        <View style={globalStyles.lightTheme.listItem}>
                                            <Text style={globalStyles.lightTheme.textPrimary}>{findCategoryName(item.details.category_id)}</Text>
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

            {!transactions?.length &&
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='documents' size={48} color='#bbb' style={{padding:16}} />
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>No Transactions</Text>
                </View>}
        </>
    )
}

const TheLogBookScreen = ({ navigation }) => {

    // ! useState Section //
    const [logbooks, setLogbooks] = useState(null);
    const [categories, setCategories] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [data, setData] = useState(null)
    const [selectedLogbooks, setSelectedLogbooks] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(null);


    // ! useEffect Section
    useEffect(() => {
        setLogbooks(userLogBooks);
        setCategories(userCategories);
        setTransactions(userTransactions);
    }, [])

    useEffect(() => {
        // refresh
        // console.log(logbooks?.length)
        // console.log(logbooks)
    }, [logbooks])


    useEffect(() => {
        // refresh
        // console.log(categories)
    }, [categories])

    useEffect(() => {
        // refresh
        // console.log(transactions?.length)
        logbooksToBeSelected()
    }, [transactions])

    useEffect(() => {
        // refresh

        // console.log(data)
    }, [data])

    useEffect(() => {
        // refresh
        // console.log(selectedLogbooks)
        filterTransactions();
    }, [selectedLogbooks])

    useEffect(() => {
        // refresh
    }, [filteredTransactions])


    // ! Function Section //
    const logbooksToBeSelected = () => {
        try {
            if (logbooks && transactions && categories) {

                // set data to be passed in modal
                setData(logbooks.map((logbook) => ({
                    name: logbook.logbook_name,
                    logbook_id: logbook.logbook_id,
                    key: logbook.logbook_id
                })))

                // set initial selected logbook
                setSelectedLogbooks({
                    name: logbooks[0].logbook_name,
                    logbook_id: logbooks[0].logbook_id,
                    key: logbooks[0].logbook_id
                })
            }
        } catch (error) {
            console.log(error)
        }

    }

    const filterTransactions = () => {
        if (selectedLogbooks) {
            const filtered = transactions.filter((transaction) => { return transaction.logbook_id === selectedLogbooks.logbook_id });
            setFilteredTransactions(filtered.map((transaction) => transaction));
        }
    }


    const scrollX = useRef(new Animated.Value(0)).current

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
                                    selectedList: (item) => {
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

                {/* {logbooks && transactions && categories &&
                    <Tabs scrollX={scrollX} data={logbooks} />} */}


                {/* Horizontal LogBook Render */}
                {/* {selectedLogbooks &&
                    <Animated.FlatList
                        data={logbooks}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        keyExtractor={(item) => item.logbook_id}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ width, height }}>
                                    <Transaction
                                        logbook_id={item.logbook_id}
                                        transactions={transactions}
                                        categories={categories}
                                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item })}
                                    />
                                </View>
                            )
                        }}
                    />} */}

                {/* Transaction Render */}
                {filteredTransactions &&
                    <Transactions
                        logbook_id={selectedLogbooks.logbook_id}
                        transactions={filteredTransactions}
                        categories={categories}
                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item })}
                    />}
            </View>
        </>
    )
}

export default TheLogBookScreen;