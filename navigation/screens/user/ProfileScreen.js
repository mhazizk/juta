import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { useGlobalAppSettings, useGlobalUserAccount } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { ListItem } from "../../../components/List";


const ProfileScreen = ({ item, navigation }) => {

    const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
    const { appSettings, dispatchSettings } = useGlobalAppSettings();

    return (
        <>{userAccount &&
            <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                <UserHeaderComponent />
                {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}

                {/* // ! Profile */}
                <ListItem
                    pressable
                    leftLabel='Change Avatar'
                    iconLeftName='person'
                    onPress={() => alert('Coming soon')}
                />

                {/* // ! Change Nick Name */}
                <ListItem
                    pressable
                    leftLabel='Change Nick Name'
                    rightLabel={userAccount.profile.nickname}
                    iconLeftName='create'
                    onPress={() => navigation.navigate('Modal Screen', {
                        title: 'Change Nick Name',
                        modalType: 'textInput',
                        default: userAccount.profile.nickname,
                        selected: (item) => { dispatchUserAccount({ type: ACTIONS.USER_ACCOUNT.NICKNAME.SET, payload: item }) }
                    })}
                />


            </View>}
        </>
    )
}



export default ProfileScreen;