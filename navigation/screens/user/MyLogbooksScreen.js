import { Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../../../assets/globalStyles";
import { useGlobalAppSettings, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalUserAccount } from "../../../modules/GlobalContext";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { ACTIONS } from "../../../modules/GlobalReducer";


const MyLogbooksScreen = ({ navigation }) => {

    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const [loadedLogbooks, setLoadedLogbooks] = useState(null);


    useEffect(() => {
        sortingLogbooks()
    }, [])

    useEffect(() => {
        sortingLogbooks()
    }, [logbooks.logbooks])

    useEffect(() => {
        sortingLogbooks()
    }, [logbooks.logbookPatchCounter])

    useEffect(() => {

    }, [loadedLogbooks])

    const sortingLogbooks = () => {
        const sortedLogbooks = logbooks.logbooks.sort(sortLogbooks)
        setLoadedLogbooks(sortedLogbooks)
    }

    const sortLogbooks = (prev, curr) => {
        if (prev.logbook_name > curr.logbook_name) {
            return 1;
        }
        if (prev.logbook_name < curr.logbook_name) {
            return -1;
        }
        return 0;
    }
    return (
        <>
            {loadedLogbooks &&
                <View style={{ backgroundColor: '#fff', height: '100%' }}>
                    <FlatList
                        data={loadedLogbooks}
                        keyExtractor={(item) => item.logbook_id}
                        style={{ flex: 1 }}
                        renderItem={({ item }) => (
                            <>
                                <TouchableNativeFeedback
                                    onPress={() => {
                                        navigation.navigate('Logbook Preview Screen', {
                                            logbook: item,
                                        })
                                    }}
                                >
                                    <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                        <IonIcons
                                            name='book'
                                            size={18}
                                            style={{ paddingRight: 16 }} />
                                        <View style={globalStyles.lightTheme.listItem}>
                                            <Text style={globalStyles.lightTheme.textPrimary}>{item?.logbook_name[0]?.toUpperCase() + item?.logbook_name?.substring(1)}</Text>
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
                                                "logbook_currency": { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
                                                "logbook_type": "basic",
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
                                                        logbook_id: newLogbook.logbook_id,
                                                        logbook_currency: { name: 'IDR', symbol: 'Rp', isoCode: 'id' }
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
                </View>}
        </>
    )
}

export default MyLogbooksScreen;