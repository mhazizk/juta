import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalUserAccount } from "../../../modules/GlobalContext";
import { ListItem } from "../../../components/List";
import { TextPrimary, TextSecondary } from "../../../components/Text";


const AccountScreen = ({ item, navigation }) => {

    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    const checkmark = require('../../../assets/img/checkmark.png');

    return (
        <>
            {userAccount &&
                <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                    <UserHeaderComponent />
                    {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                        <Text style={{ fontSize: 32, color: '#bbb' }}>Account</Text>
                    </View> */}

                    {/* // ! Change Email */}
                    <ListItem
                        leftLabel='Change Email'
                        rightLabel={userAccount.account.email}
                        iconLeftName='mail'
                        onPress={() => alert('Feature in progress ...')}
                    />

                    {/* // ! Change Password */}
                    <ListItem
                        leftLabel='Change Password'
                        iconLeftName='key'
                        onPress={() => alert('Feature in progress ...')}
                    />

                    {/* // ! Data */}
                    <ListItem
                        leftLabel='Data'
                        iconLeftName='cube'
                        onPress={() => navigation.push('Data Screen')}
                    />

                    {/* // ! Verification */}
                    <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                        <View style={appSettings.theme.style.list.listContainer}>
                            <View style={{ paddingRight: 16 }}>
                                <Image source={checkmark} style={{ width: 18, height: 18 }} />
                            </View>
                            <View style={{ ...appSettings.theme.style.list.listItem }}>
                                <TextPrimary label='Verification' />
                                <TextSecondary label={userAccount.account.verification ? 'Verified' : 'Not Verified'} />
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