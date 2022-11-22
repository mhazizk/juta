import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import APP_SETTINGS from "../../../config/appSettings";
import { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";


const PersonalizationScreen = ({ item, navigation }) => {

    const [modalVisible, setModalVisible] = useState({
        appTheme: false,
        fontSize: false,
        language: false
    })

    useEffect(() => {
        // refresh
        console.log(modalVisible)
    }, [modalVisible.appTheme])


    return (
        <>
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
                        props: APP_SETTINGS.THEME.OPTIONS
                    }
                    )}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='contrast' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Theme</Text>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>{APP_SETTINGS.THEME.USER[0].toUpperCase() + APP_SETTINGS.THEME.USER.substring(1)} Theme</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Font Size */}
                <TouchableNativeFeedback
                    onPress={() => navigation.navigate(
                        'Modal Screen', {
                        title: 'Font Size',
                        props: APP_SETTINGS.FONT_SIZE.OPTIONS
                    })}
                >
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='text' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Font Size</Text>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>{APP_SETTINGS.FONT_SIZE.USER[0].toUpperCase() + APP_SETTINGS.FONT_SIZE.USER.substring(1)}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Language */}
                <TouchableNativeFeedback
                    onPress={() => navigation.navigate(
                        'Modal Screen', {
                        title: 'Language',
                        props: APP_SETTINGS.LANGUAGE.OPTIONS
                    })}
                >
                    <View style={styles.flatListView}>
                        <IonIcons name='language' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Language</Text>
                            <Text style={{ ...globalStyles.lightTheme.textSecondary, color: '#bbb' }}>{APP_SETTINGS.LANGUAGE.USER[0].toUpperCase() + APP_SETTINGS.LANGUAGE.USER.substring(1)}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

            </View>
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