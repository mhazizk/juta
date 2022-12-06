import { ScrollView, Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../../../assets/globalStyles";
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
            <ScrollView>

                {/* <View style={{ backgroundColor: '#fff', height: '100%' }}> */}
                <View style={{...globalStyles.lightTheme.view, paddingTop:16}}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingLeft: 16 }}>
                        Expense
                    </Text>
                </View>
                <FlatList
                    data={categories.categories.expense}
                    keyExtractor={(item) => item.name}
                    style={{ flexGrow: 0 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                        <>
                            <TouchableNativeFeedback
                            // onPress={() => {
                            //     navigation.navigate('Modal Screen', {
                            //         modalType: 'action',
                            //         title: 'Logbook Option',
                            //         actions: {
                            //             delete: (item) => { },
                            //             changeName: (item) => { }
                            //         }
                            //     })
                            // }}
                            >
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <IonIcons
                                        name={item?.icon?.name}
                                        size={18}
                                        color={item?.icon?.color}
                                        style={{ display: item?.icon?.pack === 'ion_icons' ? 'flex' : 'none', paddingRight: 16 }} />
                                    <View style={globalStyles.lightTheme.listItem}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>{item?.name[0].toUpperCase() + item?.name.substring(1)}</Text>
                                    </View>
                                    <IonIcons
                                        name='chevron-forward'
                                        size={18}
                                    />
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                    ListFooterComponent={() => (
                        <>
                            <TouchableNativeFeedback
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
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <IonIcons
                                        name='add-circle'
                                        size={18}
                                        style={{ paddingRight: 16 }} />
                                    <View style={{ ...globalStyles.lightTheme.listItem }}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>Add New Category</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                />
                <View style={{...globalStyles.lightTheme.view, paddingTop:16}}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingLeft: 16 }}>
                        Income
                    </Text>
                </View>
                <FlatList
                    data={categories.categories.income}
                    keyExtractor={(item) => item.name}
                    style={{ flexGrow: 0 }}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                        <>
                            <TouchableNativeFeedback
                            // onPress={() => {
                            //     navigation.navigate('Modal Screen', {
                            //         modalType: 'action',
                            //         title: 'Logbook Option',
                            //         actions: {
                            //             delete: (item) => { },
                            //             changeName: (item) => { }
                            //         }
                            //     })
                            // }}
                            >
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <IonIcons
                                        name={item?.icon?.name}
                                        size={18}
                                        color={item?.icon?.color}
                                        style={{ display: item?.icon?.pack === 'ion_icons' ? 'flex' : 'none', paddingRight: 16 }} />
                                    <View style={globalStyles.lightTheme.listItem}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>{item?.name[0].toUpperCase() + item?.name.substring(1)}</Text>
                                    </View>
                                    <IonIcons
                                        name='chevron-forward'
                                        size={18}
                                    />
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                    ListFooterComponent={() => (
                        <>
                            <TouchableNativeFeedback
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
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <IonIcons
                                        name='add-circle'
                                        size={18}
                                        style={{ paddingRight: 16 }} />
                                    <View style={{ ...globalStyles.lightTheme.listItem }}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>Add New Category</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                />

                {/* </View> */}
            </ScrollView>
        </>
    )
}

export default MyCategoriesScreen;