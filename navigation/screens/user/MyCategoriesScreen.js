import { ScrollView, Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalUserAccount } from "../../../modules/GlobalContext";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useEffect } from "react";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { TextPrimary } from "../../../components/Text";
import { ListItem } from "../../../components/List";


const MyCategoriesScreen = ({ navigation }) => {

    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { categories, dispatchCategories } = useGlobalCategories();

    useEffect(() => {
        // console.log(categories.categories.expense)
    }, [categories.categories])

    const data = (item) => {
        if (item === 'expense') {
            return categories.categories.expense
        }
        if (item === 'income') {
            return categories.categories.income
        }
    }


    return (
        <>
            {/* <View style={{ backgroundColor: '#fff', height: '100%' }}> */}
            <FlatList
                data={['expense', 'income']}
                keyExtractor={(item) => item}
                // style={{ flexGrow: 0 }}
                // nestedScrollEnabled
                renderItem={({ item }) => (
                    <>
                        <FlatList
                            data={data(item)}
                            contentContainerStyle={{ backgroundColor: appSettings.theme.style.colors.background }}
                            keyExtractor={(item) => item.id}
                            ListHeaderComponent={() => {
                                return (
                                    <ListItem
                                        leftLabel={item[0].toUpperCase() + item.substring(1)}
                                    />
                                )
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <>
                                        <ListItem
                                            pressable
                                            leftLabel={item?.name[0].toUpperCase() + item?.name.substring(1)}
                                            iconLeftName={item.icon.name}
                                            iconRightName='chevron-forward'
                                            onPress={() => alert('test')}
                                        />
                                    </>
                                )
                            }}
                            ListFooterComponent={() => {
                                return (
                                    <>
                                        <ListItem
                                            pressable
                                            rightLabel='Add New Category'
                                            iconRightName='add'
                                        />
                                    </>
                                )
                            }}
                        />
                    </>
                )}
                ListFooterComponent={() => {
                    return (
                        <>
                            {/* <ListItem
                                leftLabel='Add New Categories'
                            />
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
                                <Text>Cek</Text>
                            </TouchableNativeFeedback> */}
                        </>
                    )
                }}
            />
        </>
    )
}

export default MyCategoriesScreen;