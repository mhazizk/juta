import { StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";

const UserScreen = ({ navigation }) => {

    const checkmark = require('../../../assets/checkmark.png')
    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                <UserHeaderComponent />
                {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Cash Log Settings</Text>
                </View> */}

                {/* // ! My Profile */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('Profile Screen')}>
                    <View style={[globalStyles.lightTheme.listContainer, globalTheme.lightTheme.listContainer]}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='person' size={18} style={{ paddingRight: 16 }} />
                        <View style={[globalStyles.lightTheme.listItem, globalTheme.lightTheme.listItem]}>
                            <Text style={[globalStyles.lightTheme.textPrimary, globalTheme.lightTheme.textPrimary]}>My Profile</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>


                {/* // ! My Logbooks */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('My Logbooks Screen')}>
                    <View style={[globalStyles.lightTheme.listContainer, globalTheme.lightTheme.listContainer]}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='book' size={18} style={{ paddingRight: 16 }} />
                        <View style={[globalStyles.lightTheme.listItem, globalTheme.lightTheme.listItem]}>
                            <Text style={[globalStyles.lightTheme.textPrimary, globalTheme.lightTheme.textPrimary]}>My Logbooks</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! My Categories */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('My Categories Screen')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='pricetags' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>My Categories</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Settings */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('Settings Screen')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='build' size={20} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Settings</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! About */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('About Screen')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='information-circle' size={20} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>About</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Developer */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('Developer Screen')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='settings' size={20} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Developer</Text>
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