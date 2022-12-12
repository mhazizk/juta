import { FlatList, Image, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { globalStyles } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks, useGlobalSortedTransactions, useGlobalTransactions, useGlobalUserAccount } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { useEffect, useRef, useState } from "react";
import APP_SETTINGS from "../../../config/appSettings";
import { TouchableOpacity } from "react-native-gesture-handler";
import CountryFlag from "react-native-country-flag";
import IonIcons from 'react-native-vector-icons/Ionicons';

// Image Import
import Onboarding from 'react-native-onboarding-swiper'
import colorOfTheYear2023 from '../../../assets/img/colorOfTheYear2023.png'
import colorOfTheYear2022 from '../../../assets/img/colorOfTheYear2022.png'
import doneSetup from '../../../assets/img/doneSetup.png'
import light from '../../../assets/img/light.png'
import dark from '../../../assets/img/dark.png'
import large from '../../../assets/img/large.png'
import medium from '../../../assets/img/medium.png'
import small from '../../../assets/img/small.png'
import { lightTheme } from "../../../assets/themes/lightTheme";
import { asyncStorage, STORAGE_ACTIONS } from "../../../modules/Storage";
import userCategories from "../../../database/userCategories";
import initialCategories from "../../../modules/InitialCategories";
import InitialSortedTransactions from "../../../modules/InitialSortedTransactions";

const InitialSetupScreen = ({ navigation }) => {

    const { transactions, dispatchTransactions } = useGlobalTransactions();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { categories, dispatchCategories } = useGlobalCategories();
    const { sortedTransactions, dispatchSortedTransactions } = useGlobalSortedTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { userAccount, dispatchUSerAccount } = useGlobalUserAccount();
    const [selectedAppSettings, setSelectedAppSettings] = useState({
        theme: { name: 'Light Theme', id: 'light', style: lightTheme },
        fontSize: 'medium',
        language: 'english',
        locale: 'us-EN',
        currency: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
        screenHidden: ['Onboarding Screen', 'Initial Setup Screen']

    })
    const [newLogbook, setNewLogbook] = useState(
        {
            "_timestamps": {
                "created_at": null,
                "updated_at": null
            },
            "_id": '12234',
            "user_id": 'haziz1',
            "username": 'mhazizk',
            "logbook_currency": selectedAppSettings.currency,
            "logbook_type": "basic",
            "logbook_id": 'logbook1',
            "logbook_name": "",
            "logbook_records": [],
            "logbook_categories": [],
            "__v": 0
        },

    )


    const onboardingRef = useRef(null);

    useEffect(() => {

    }, [appSettings, newLogbook])

    const findImage = (data) => {
        switch (true) {

            // Theme Image
            case data === 'light':
                return light;
            case data === 'dark':
                return dark;
            case data === 'colorOfTheYear2022':
                return colorOfTheYear2022;
            case data === 'colorOfTheYear2023':
                return colorOfTheYear2023;

            // Font Size Image
            case data === 'small':
                return small;
            case data === 'medium':
                return medium;
            case data === 'large':
                return large;

            default:
                return light;
        }
    }

    const selectedColor = (data) => {
        switch (true) {
            case data === 'light':
                return '#000';
            case data === 'dark':
                return '#eee';
            case data === 'colorOfTheYear2022':
                return '#6463B1';
            case data === 'colorOfTheYear2023':
                return '#BC2649';

            default:
                return 'transparent';
        }
    }


    const finalizeSetup = async () => {

        // Check Logbook
        const logbookToDispatch =
        {
            "_timestamps": {
                "created_at": Date.now(),
                "updated_at": Date.now()
            },
            "_id": newLogbook.logbook_id,
            "user_id": newLogbook.user_id,
            "username": newLogbook.username,
            "logbook_currency": newLogbook.logbook_currency,
            "logbook_type": "basic",
            "logbook_id": newLogbook.logbook_id,
            "logbook_name": newLogbook.logbook_name || 'My Logbook',
            "logbook_records": [],
            "logbook_categories": [],
            "__v": 0
        }


        dispatchAppSettings({
            type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
            payload: selectedAppSettings
        })

        dispatchCategories({
            type: ACTIONS.CATEGORIES.SET,
            payload: userCategories
        })

        dispatchLogbooks({
            type: ACTIONS.LOGBOOKS.SET,
            payload: logbookToDispatch
        })

        dispatchSortedTransactions({
            type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INIT_SETUP,
            payload: [
                {
                    "logbook_id": newLogbook.logbook_id,
                    "transactions": []
                }
            ]
        })

        // dispatchSortedTransactions({
        // })

        // Save to storage
        const saveTransaction = await asyncStorage({ action: STORAGE_ACTIONS.SET, key: 'transactions', rawValue: [] })
        const saveCategories = await asyncStorage({ action: STORAGE_ACTIONS.SET, key: 'categories', rawValue: initialCategories })
        const saveSortedTransactions = await asyncStorage({ action: STORAGE_ACTIONS.SET, key: 'sortedTrasactions', rawValue: InitialSortedTransactions })
        const saveAppSettings = await asyncStorage({ action: STORAGE_ACTIONS.SET, key: 'appSettings', rawValue: selectedAppSettings })

        Promise.all([saveCategories, saveTransaction, saveSortedTransactions, saveAppSettings])
            .then(() => {
                return navigation.navigate('Bottom Tab')
            })
    }

    const pages = [
        // ! Select Theme
        {
            backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
            image: <Image />,
            title:
                <>
                    <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Theme</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                        <FlatList
                            data={APP_SETTINGS.THEME.OPTIONS}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setSelectedAppSettings({ ...selectedAppSettings, theme: item });
                                                setTimeout(() => onboardingRef.current.goNext(), 1000)
                                            }}>
                                            <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.theme.id === item.id ? selectedColor(item.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                        <Image source={findImage(item.id)} style={{ width: 80, height: 80 }} />
                                                    </View>
                                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000' }]}>{item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )
                            }}
                        />
                    </View>
                </>
            ,
            subtitle: '',
        },

        // ! Select Font Size
        {
            backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
            image: <Image />,
            title:
                <>
                    <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Font Size</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                        <FlatList
                            data={APP_SETTINGS.FONT_SIZE.OPTIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                return (
                                    <>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setSelectedAppSettings({ ...selectedAppSettings, fontSize: item })
                                                setTimeout(() => onboardingRef.current.goNext(), 1000)
                                            }}>
                                            <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.fontSize === item ? selectedColor(selectedAppSettings.theme.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                        <Image source={findImage(item)} style={{ width: 80, height: 80 }} />
                                                    </View>
                                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000', fontSize: item === 'small' ? 12 : item === 'medium' ? 16 : 32 }]}>{item[0].toUpperCase() + item.substring(1)}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )
                            }}
                        />
                    </View>
                </>
            ,
            subtitle: '',
        },

        // ! Select Currency
        {
            backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
            image: <Image />,
            title:
                <>
                    <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Default Currency</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                        <FlatList
                            data={APP_SETTINGS.CURRENCY.OPTIONS}
                            keyExtractor={(item) => item.isoCode}
                            renderItem={({ item }) => {
                                return (
                                    <>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() => {
                                                setSelectedAppSettings({ ...selectedAppSettings, currency: item })
                                                setTimeout(() => onboardingRef.current.goNext(), 1000)
                                            }}>
                                            <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.currency.isoCode === item.isoCode ? selectedColor(selectedAppSettings.theme.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                        <CountryFlag
                                                            isoCode={item.isoCode}
                                                            size={32}
                                                        />
                                                        {/* <Text style={{ fontSize: 24 }}>Rp</Text> */}
                                                    </View>
                                                    <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000' }]}>{item.name} / {item.symbol}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )
                            }}
                        />
                    </View>
                </>
            ,
            subtitle: '',
        },

        // ! Create First Logbook
        {
            backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
            image: <Image />,
            title:
                <>
                    <Text style={{ paddingHorizontal: 16, position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Create Your First Logbook</Text>
                    <Text style={{ paddingHorizontal: 16, position: 'absolute', top: '10%', textAlign: 'center', color: selectedColor(selectedAppSettings.theme.id), fontSize: 18 }}>Logbook is a book to save your transactions, just like ordinary book</Text>
                    <Text style={{ paddingHorizontal: 16, position: 'absolute', bottom: '5%', textAlign: 'center', color: selectedColor(selectedAppSettings.theme.id), fontSize: 18 }}>Don't worry, you can edit it later</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Modal Screen', {
                            title: 'New Logbook',
                            modalType: 'textInput',
                            placeholder: 'Enter new logbook name ...',
                            default: newLogbook.logbook_name || '',
                            selected: (item) => setNewLogbook({ ...newLogbook, logbook_name: item || 'My Logbook' })
                        })}
                        style={{ padding: 48 }}
                    >
                        <View style={{ flexDirection: 'column', alignItems: 'center', width: 200 }}>
                            <IonIcons
                                name="book"
                                size={80}
                            />
                            <Text style={{ fontSize: 24, color: '#000', textAlign: 'center' }}>{newLogbook.logbook_name || 'Create New Logbook'}</Text>
                            {/* <TextInput
                            placeholder="Type new logbook name ..."
                            textAlign='center'
                            style={{ ...globalStyles.lightTheme.textPrimary }}
                            onChangeText={(text) => setNewLogbook({ ...newLogbook, logbook_name: text })}
                            value={newLogbook.logbook_name}
                        /> */}
                        </View>
                    </TouchableOpacity>
                </>
            ,
            subtitle: '',
        },


        {
            backgroundColor: '#fff',
            image: <Image source={doneSetup} style={{ width: 250, height: 250 }} />,
            title: 'Everything is Set !',
            subtitle: 'Finish Setup and start using Cash Log App',
        },

    ]



    return (
        <>
            <Onboarding
                ref={onboardingRef}
                transitionAnimationDuration={250}
                showSkip={false}
                onDone={() => {
                    finalizeSetup()
                }}
                pages={pages}
            />
        </>
    )
}

export default InitialSetupScreen;