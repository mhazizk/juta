import { forwardRef, useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, FlatList, Animated, findNodeHandle, TouchableNativeFeedback } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import userCategories from "../../../database/userCategories";
import userLogBooks from "../../../database/userLogBooks";
import userTransactions from "../../../database/userTransactions";
import IonIcons from 'react-native-vector-icons/Ionicons';
import formatCurrency from "../../../assets/formatCurrency";

const { width, height } = Dimensions.get('screen');



const Tabs = ({ scrollX, data }) => {
    return (
        <>
            <View style={[{ flexDirection: 'row', height: 48, width, alignItems: 'center', paddingHorizontal: 8 }, { ...globalTheme.lightTheme.view }]}>
                {data.map((item) => {
                    return <Tab key={item.logbook_id} item={item} />
                })}
            </View>
            <Indicator />
        </>
    )
}

const Indicator = () => {
    return (
        <>
            <View
                style={{
                    top: 44,
                    position: 'absolute',
                    height: 2,
                    width: 100,
                    backgroundColor: '#000'
                }}
            >
            </View>
        </>
    )
}


const Tab = forwardRef(({ item }, ref) => {
    return (
        <View ref={ref} style={{ paddingHorizontal: 8 }}>
            <Text>{item.logbook_name[0].toUpperCase() + item.logbook_name.substring(1)}</Text>
        </View>
    )
})

const Transaction = ({ logbook_id, transactions, categories, onPress }) => {
    const filteredTransaction = transactions.filter((transaction) => { return transaction.logbook_id === logbook_id })

    const findCategoryIconName = (id) => {
        const filteredExpenseCategory = categories.expense.filter((category) => { return category.id === id })
        const filteredIncomeCategory = categories.income.filter((category) => { return category.id === id })

        if (filteredExpenseCategory.length) {
            return filteredExpenseCategory.map((item => item.icon.name));
        } else {
            return filteredIncomeCategory.map((item) => item.icon.name);
        }
    }

    const findCategoryName = (id) => {
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
    }

    return (
        <>
            <Animated.FlatList
                data={filteredTransaction}
                keyExtractor={(item) => item.transaction_id}
                renderItem={({ item }) => {
                    return (
                        <>
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
                        </>
                    )
                }}
            />
        </>
    )
}

const NewLogBook = ({ navigation }) => {

    const [logbooks, setLogbooks] = useState();
    const [categories, setCategories] = useState();
    const [transactions, setTransactions] = useState();
    const [data, setData] = useState()


    const mergeToShowInScreen = () => {
        try {
            if (logbooks && transactions && categories) {
                setData(logbooks.map((logbook) => logbook.logbook_id))
                const filteredTrx = transactions.filter((transaction => { return logbooks.map((logbook) => { return logbook.logbook_id === transaction.logbook_id }) }))
                const checkFiltered = transactions.map((transaction) => { return logbooks.filter })
                console.log(filteredTrx)
                console.log(filteredTrx.length)
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        setLogbooks(userLogBooks);
        setCategories(userCategories);
        setTransactions(userTransactions);
        // mergeToShowInScreen()
    }, [])

    useEffect(() => {
        // refresh
        // console.log(logbooks?.length)
        // console.log(logbooks)
    }, [logbooks])

    useEffect(() => {
        // refresh
        // console.log(transactions?.length)
    }, [transactions])

    useEffect(() => {
        // refresh
        // console.log(categories)
    }, [categories])

    useEffect(() => {
        // refresh

        console.log(data)
    }, [data])

    const scrollX = useRef(new Animated.Value(0)).current

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                {logbooks && transactions && categories &&
                    <Tabs scrollX={scrollX} data={logbooks} />}

                {/* Horizontal LogBook Render */}
                {logbooks && transactions && categories &&
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
                                    {/* <Text>{item.logbook_id}</Text> */}
                                    <Transaction
                                        logbook_id={item.logbook_id}
                                        transactions={transactions}
                                        categories={categories}
                                        onPress={(item) => navigation.navigate('Transaction Preview Screen', { transaction: item })}
                                    />
                                </View>
                            )
                        }}
                    />}

                {/* Transaction Render */}
                {/* <Animated.FlatList
                    data={transactions}
                    keyExtractor={(item) => item.transaction_id}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <View>
                                    <Text>{item.details.amount}</Text>
                                </View>
                            </>
                        )
                    }}
                /> */}
            </View>
        </>
    )
}

export default NewLogBook;