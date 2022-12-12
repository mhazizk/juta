import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings } from "../../../modules/GlobalContext";
import { ListItem } from "../../../components/List";


const AboutScreen = ({ item, navigation }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    return (
        <>
            <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                <UserHeaderComponent />
                {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>About Cash Log</Text>
                </View> */}

                {/* // ! Made by */}
                <ListItem
                    leftLabel='Made by'
                    rightLabel='Haziz'
                    iconLeftName='information-circle'
                    onPress={() => alert('Thank you for using Cash Log App.\nI hope this app helps you alot.\nHappy logging !')}
                />

                {/* // ! Contact */}
                <ListItem
                    leftLabel='Contact Me'
                    iconLeftName='mail'
                    onPress={() => alert('OTW')}
                />

                {/* // ! App Version */}
                <ListItem
                    leftLabel='App Version'
                    rightLabel='v.1.0.0'
                    iconLeftName='phone-portrait'
                    onPress={() => alert('OTW')}
                />

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


export default AboutScreen;