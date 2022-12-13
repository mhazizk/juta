import { useEffect, useMemo, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import Intl from 'intl';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ButtonPrimary, ButtonSecondary, ButtonSwitch } from '../../../components/Button';
import 'intl/locale-data/jsonp/en';
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import categories from "../../../database/userCategories";
import logbooks from "../../../database/userLogBooks";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalTransactions } from "../../../modules/GlobalContext";
import formatCurrency from "../../../modules/formatCurrency";
import CountryFlag from "react-native-country-flag";
import { TextPrimary } from "../../../components/Text";


const CategoryPreviewScreen = ({ route, navigation }) => {

    // ! Global State Section //
    const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { categories, dispatchCategories } = useGlobalCategories();

    // ! useState Section //

    // Theme State
    const [theme, setTheme] = useState({
        theme: 'lightTheme',
        fontSize: 'medium'
    })

    // Transaction State
    const [category, setCategory] = useState(null);

    // Selected Logbook State
    const [selectedLogbook, setSelectedLogbook] = useState(null)

    const [logbookToOpen, setLogbookToOpen] = useState(null);

    // logbook_id : null
    // logbook_name: null

    // Selected Category State
    const [selectedCategory, setSelectedCategory] = useState(null)


    // ! UseEffect Section //

    useEffect(() => {
        setCategory(route?.params?.category)
    }, [])

    useEffect(() => {
        setCategory(route?.params?.category)
    }, [route?.params?.category])

    useEffect(() => {
        // refresh
        console.log(category)
        // console.log(transaction.details)
        // findCategoryNameById();
        // findCategoryIconNameById();
        // findLogbookNamebyId();
    }, [category])


    useEffect(() => {
        // refresh
    }, [selectedCategory])

    useEffect(() => {
        // refresh
    }, [selectedLogbook])

    useEffect(() => {

    }, [logbookToOpen])

    useEffect(() => {

    }, [sortedTransactions])

    // ! Function Section //



    return (
        <>
            {category &&
                <View style={{ backgroundColor: appSettings.theme.style.colors.background, height: '100%' }}>
                    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>

                        {/* // ! Category Name Section */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingHorizontal: 16 }}>
                            <IonIcons name={category.icon.name} size={48} style={{ padding: 16 }} color={category.icon.color === 'default' ? appSettings.theme.style.colors.foreground : category.icon.color} />
                            <TextPrimary
                                label={route?.params?.category.name[0].toUpperCase() + route?.params?.category.name.substring(1)}
                                style={{ fontSize: 24 }}
                            />
                        </View>

                        {/* // ! Category Details */}
                        <View style={{ paddingHorizontal: 16 }}>
                            <TextPrimary
                                label='Category Details'
                                style={{ fontSize: 24 }}
                            />
                        </View>

                        {/* // ! Color Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='color-fill' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Color'
                                style={{ flex: 1 }}
                            />

                            {/* // ! Right Side */}
                            <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <View
                                    style={{ height: 26, width: 26, borderRadius: 26 / 2, backgroundColor: category.icon.color === 'default' ? appSettings.theme.style.colors.foreground : category.icon.color }}
                                />
                                {/* <TextPrimary
                                    label={category.icon.color}
                                    style={{ paddingLeft: 8 }}
                                /> */}
                            </View>
                        </View>


                        {/* // ! Balance Section */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='cash' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Balance'
                                style={{ flex: 1 }}
                            /> */}

                        {/* // ! Right Side */}
                        {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${formatCurrency({ amount: sumBalance(), currency: appSettings.currency.name })}`}
                                    style={{ paddingLeft: 8 }}
                                />
                            </View>
                        </View> */}


                        {/* // ! Total Transactions Section */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='book' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Transactions'
                                style={{ flex: 1 }}
                            /> */}

                        {/* // ! Right Side */}
                        {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${!countTransactions() ? 'No' : countTransactions()} transactions`}
                                    style={{ flex: 0 }}
                                    numberOfLines={1}
                                />

                            </View>
                        </View> */}



                        {/* // ! Line Separator */}
                        <View style={{ borderColor: appSettings.theme.style.colors.secondary, borderBottomWidth: 1, height: 0, width: '80%', alignSelf: 'center', paddingTop: 16 }}></View>

                        {/* // ! Action Button */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                            {/* // ! Edit Button */}
                            <View style={{ paddingRight: 8 }}>
                                <ButtonSecondary
                                    label='Edit'
                                    width={150}
                                    onPress={() => navigation.navigate('Edit Category Screen', {
                                        category: category,
                                        selectedCategory: selectedCategory
                                    })}
                                />
                                {/* <ButtonSecondary
                                    label='Edit'
                                    width={150}
                                    onPress={() => navigation.navigate('Modal Screen', {
                                        title: 'Pick Icon Color',
                                        default: { name: 'Default', color: appSettings.theme.style.colors.primary },
                                        modalType: 'pickColor',
                                        category: category,
                                        selectedCategory: selectedCategory
                                    })}
                                /> */}
                            </View>

                            {/* // ! Delete Button */}
                            <View style={{ paddingLeft: 8 }}>
                                <ButtonSecondary
                                    label='Delete'
                                    type='danger'
                                    width={150}
                                    onPress={() => Alert.alert(
                                        'Delete This Category ?',
                                        'All transactions assigned to this category will also be deleted. Deleted category and transactions can not be restored',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                }, style: 'cancel'
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    navigation.navigate('Loading Screen', {
                                                        label: 'Deleting Category ...',
                                                        loadingType: 'deleteCategory',
                                                        deleteCategory: category,
                                                        initialCategoryDeleteCounter: categories.categoryDeleteCounter,
                                                    })
                                                }
                                            }], { cancelable: false }
                                    )}
                                />
                            </View>

                        </View>


                    </ScrollView>
                </View >}
        </>
    )
}

export default CategoryPreviewScreen;