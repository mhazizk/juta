import { Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../../../assets/globalStyles";
import { useGlobalAppSettings, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalUserAccount } from "../../../modules/GlobalContext";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useEffect } from "react";
import { ACTIONS } from "../../../modules/GlobalReducer";


const MyLogbooksScreen = ({ navigation }) => {

    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    useEffect(() => {

    }, [logbooks.logbooks])


    return (
        <>
            <View style={{ backgroundColor: '#fff', height: '100%' }}>
                <FlatList
                    data={logbooks.logbooks}
                    keyExtractor={(item) => item.logbook_id}
                    style={{ flex: 1 }}
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
                                        name='book'
                                        size={18}
                                        style={{ paddingRight: 16 }} />
                                    <View style={globalStyles.lightTheme.listItem}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>{item?.logbook_name[0].toUpperCase() + item?.logbook_name.substring(1)}</Text>
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
                                        <Text style={globalStyles.lightTheme.textPrimary}>Add New Logbook</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                />
            </View>
        </>
    )
}

export default MyLogbooksScreen;