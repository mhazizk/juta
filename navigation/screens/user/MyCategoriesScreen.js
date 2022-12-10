import { ScrollView, Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalUserAccount } from "../../../modules/GlobalContext";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useEffect } from "react";
import { ACTIONS } from "../../../modules/GlobalReducer";


const MyCategoriesScreen = ({ navigation }) => {

    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { categories, dispatchCategories } = useGlobalCategories();

    useEffect(() => {

    }, [categories.categories])


    return (
        <>
            {/* <View style={{ backgroundColor: '#fff', height: '100%' }}> */}
            <View style={{ ...globalStyles.lightTheme.view, paddingTop: 16 }}>
                <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingLeft: 16 }}>
                    Expense
                </Text>
            </View>
            <FlatList
                data={['expense', 'income']}
                keyExtractor={(item) => item}
                // style={{ flexGrow: 0 }}
                // nestedScrollEnabled
                renderItem={({ item }) => (
                    <>
                        <FlatList
                            data={item === 'expense' ? categories.categories.expense : null}
                            keyExtractor={(expense) => expense.name}
                            renderItem={({ expense }) => {
                                return (
                                    <>
                                        <TouchableNativeFeedback
                                        >
                                            <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                                <IonIcons
                                                    name={expense?.icon?.name}
                                                    size={18}
                                                    color={expense?.icon?.color}
                                                    style={{ display: expense?.icon?.pack === 'ion_icons' ? 'flex' : 'none', paddingRight: 16 }} />
                                                <View style={globalStyles.lightTheme.listItem}>
                                                    <Text style={globalStyles.lightTheme.textPrimary}>{expense?.name[0].toUpperCase() + expense?.name.substring(1)}</Text>
                                                </View>
                                                <IonIcons
                                                    name='chevron-forward'
                                                    size={18}
                                                />
                                            </View>
                                        </TouchableNativeFeedback>
                                    </>
                                )
                            }}
                        />
                    </>
                )}
                ListFooterComponent={() => (
                    <>
                        {/* <TouchableNativeFeedback
                            onPress={() => navigation.navigate('Modal Screen', {
                                modalType: 'textInput',
                                title: 'Create New Log Book',
                                placeholder: 'Enter new log book name ...',
                                selected: (item) => {

                                    const newLogbook = {
                                        "_timestamps": {
                                            "created_at": Date.now(),
                                            "updated_at": Date.now()
                                        },
                                        "_id": Math.random * 10000,
                                        "user_id": userAccount.account.user_id,
                                        "username": null,
                                        "logbook_id": Math.random() * 10000,
                                        "logbook_name": item,
                                        "logbook_records": [],
                                        "logbook_categories": [],
                                        "__v": 0
                                    }

                                    dispatchLogbooks({
                                        type: ACTIONS.LOGBOOKS.INSERT,
                                        payload: newLogbook
                                    })

                                    dispatchSortedTransactions({
                                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_LOGBOOK,
                                        payload: {
                                            newLogbook: {
                                                logbook_id: newLogbook.logbook_id,
                                                transactions: []
                                            },
                                            logbookToOpen: {
                                                name: newLogbook.logbook_name,
                                                logbook_id: newLogbook.logbook_id
                                            }
                                        }
                                    })

                                }
                            })} >
                            <Text>Cek</Text>
                        </TouchableNativeFeedback> */}
                    </>
                )}
            />
        </>
    )
}

export default MyCategoriesScreen;