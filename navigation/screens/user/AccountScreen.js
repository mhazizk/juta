import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalUserAccount } from "../../../modules/GlobalContext";


const AccountScreen = ({ item, navigation }) => {

    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

    const checkmark = require('../../../assets/checkmark.png');

    return (
        <>
            {userAccount &&
                <View style={{ height: '100%', backgroundColor: '#fff' }}>
                    <UserHeaderComponent />
                    <View style={{ backgroundColor: '#fff', padding: 16 }}>
                        <Text style={{ fontSize: 32, color: '#bbb' }}>Account</Text>
                    </View>

                    {/* // ! Change Email */}
                    <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                        <View style={styles.flatListView}>
                            {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                            <IonIcons name='mail' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Change Email</Text>
                                <Text style={globalStyles.lightTheme.textSecondary}>{userAccount.account.email}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Change Password */}
                    <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                        <View style={styles.flatListView}>
                            {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                            <IonIcons name='key' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Change Password</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Data */}
                    <TouchableNativeFeedback onPress={() => navigation.push('Data Screen')}>
                        <View style={styles.flatListView}>
                            {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                            <IonIcons name='cube' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Data</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

                    {/* // ! Verification */}
                    <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                        <View style={styles.flatListView}>
                            <View style={{ paddingRight: 16 }}>
                                <Image source={checkmark} style={{ width: 18, height: 18 }} />
                            </View>
                            {/* <IonIcons name='key-outline' size={18} /> */}
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Verification</Text>
                                <Text style={globalStyles.lightTheme.textSecondary}>
                                    {userAccount.account.verification ? 'Verified' : 'Not Verified'}
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


export default AccountScreen;