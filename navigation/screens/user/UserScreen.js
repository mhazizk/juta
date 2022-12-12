import { StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks } from "../../../modules/GlobalContext";
import { TextPrimary } from "../../../components/Text";
import { ListItem } from "../../../components/List";

const UserScreen = ({ navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
    const { categories, dispatchCategories } = useGlobalCategories();

    return (
        <>
            <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                <UserHeaderComponent />

                {/* // ! My Profile */}
                <ListItem
                    pressable
                    leftLabel='Profile'
                    iconLeftName='person'
                    onPress={() => navigation.navigate('Profile Screen')}
                />

                {/* // ! My Logbooks */}
                <ListItem
                    pressable
                    leftLabel='My Logbooks'
                    rightLabel={`${logbooks?.logbooks?.length} logbook(s)`}
                    iconLeftName='book'
                    onPress={() => navigation.navigate('My Logbooks Screen')}
                />

                {/* // ! My Categories */}
                <ListItem
                    pressable
                    leftLabel='My Categories'
                    rightLabel={`${categories?.categories.expense?.length + categories?.categories.income?.length} categories`}
                    iconLeftName='pricetags'
                    onPress={() => navigation.navigate('My Categories Screen')}
                />


                {/* // ! Settings */}
                <ListItem
                    pressable
                    leftLabel='Settings'
                    iconLeftName='build'
                    onPress={() => navigation.navigate('Settings Screen')}
                />


                {/* // ! About */}
                <ListItem
                    pressable
                    leftLabel='About'
                    iconLeftName='information-circle'
                    onPress={() => navigation.navigate('About Screen')}
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
        justifyContent: 'flex-start',
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

export default UserScreen;