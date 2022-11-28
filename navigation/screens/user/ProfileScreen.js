import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/globalStyles";
import { useGlobalUserAccount } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";


const ProfileScreen = ({ item, navigation }) => {

    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

    return (
        <>{userAccount &&
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                <UserHeaderComponent />
                <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View>

                {/* // ! Profile */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='person' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Change Avatar</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Change Nick Name */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('Modal Screen', {
                    title: 'Change Nick Name',
                    modalType: 'textInput',
                    default: userAccount.profile.nickname,
                    selected: (item) => { dispatchUserAccount({ type: ACTIONS.USER_ACCOUNT.NICKNAME.SET, payload: item }) }
                })}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='create' size={18} style={{ paddingRight: 16 }} />
                        <View style={globalStyles.lightTheme.listItem}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Change Nick Name</Text>
                            <Text style={globalStyles.lightTheme.textSecondary}>{userAccount.profile.nickname}</Text>
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


export default ProfileScreen;