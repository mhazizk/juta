import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import APP_SETTINGS from "../../../config/appSettings";
import { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalTransactions } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";


const PersonalizationScreen = ({ item, navigation }) => {

    const { state, dispatch } = useGlobalTransactions();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    const [appPersonalization, setPersonalization] = useState({
        appTheme: false,
        fontSize: false,
        language: false
    })



    return (
        <>
            {appSettings &&
                <View style={{ height: '100%', backgroundColor: '#fff' }}>
                    <UserHeaderComponent />
                    <View style={{ backgroundColor: '#fff', padding: 16 }}>
                        <Text style={{ fontSize: 32, color: '#bbb' }}>Personalization</Text>
                    </View>

                    {/* // ! App Theme */}
                    <TouchableNativeFeedback
                        onPress={() => navigation.navigate(
                            'Modal Screen', {
                            title: 'Theme',
                            modalType: 'list',
                            props: APP_SETTINGS.THEME.OPTIONS.map((theme) => theme),
                            default: appSettings.theme,
                            selected: (item) => dispatchAppSettings({ type: ACTIONS.APP_SETTINGS.THEME.SET, payload: item })
                        }
                        )}>
                        <View style={styles.flatListView}>
                            {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                            <IonIcons name='contrast' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Theme</Text>
                                <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>{appSettings.theme.name[0].toUpperCase() + appSettings.theme.name.substring(1)}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Font Size */}
                    <TouchableNativeFeedback
                        onPress={() => navigation.navigate(
                            'Modal Screen', {
                            title: 'Font Size',
                            modalType: 'list',
                            props: APP_SETTINGS.FONT_SIZE.OPTIONS.map((option) => { return { name: option } }),
                            selected: (item) => dispatchAppSettings({ type: ACTIONS.APP_SETTINGS.FONT_SIZE.SET, payload: item.name }),
                            default: { name: appSettings.fontSize }
                        })}
                    >
                        <View style={styles.flatListView}>
                            {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                            <IonIcons name='text' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Font Size</Text>
                                <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>{appSettings.fontSize[0].toUpperCase() + appSettings.fontSize.substring(1)}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Language */}
                    <TouchableNativeFeedback
                        onPress={() => navigation.navigate(
                            'Modal Screen', {
                            title: 'Language',
                            modalType: 'list',
                            props: APP_SETTINGS.LANGUAGE.OPTIONS.map(
                                (option) => { return { name: option.name, locale: option.locale } }),
                            selected: (item) =>
                                dispatchAppSettings(
                                    {
                                        type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
                                        payload: {
                                            language: item.name,
                                            locale: item.locale
                                        }
                                    })
                            ,
                            default: { name: appSettings.language }
                        })}
                    >
                        <View style={styles.flatListView}>
                            <IonIcons name='language' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Language</Text>
                                <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>
                                    {appSettings.language[0].toUpperCase() + appSettings.language.substring(1)}
                                </Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                </View>}
        </>
    )
}

const styles = new StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatListView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        height: 48
    },
    flatListViewUnderscore: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        paddingVertical: 0,
        paddingLeft: 16,
        borderColor: '#d9d9d9',
        borderBottomWidth: 0.5,
        minHeight: 46,
        textAlignVertical: 'center'
    },
    flatListViewText: {
        display: 'flex',
        color: '#000',
        textAlignVertical: 'center',
        fontSize: 18,
        textAlignVertical: 'center'
    }

})


export default PersonalizationScreen;