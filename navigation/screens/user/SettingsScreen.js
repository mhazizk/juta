import { StyleSheet, Text, TouchableNativeFeedback, View, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { ListItem } from "../../../components/List";
import { useGlobalAppSettings } from "../../../modules/GlobalContext";

const SettingsScreen = ({ navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    return (
        <>
            <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                <UserHeaderComponent />
                {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Cash Log Settings</Text>
                </View> */}

                {/* // ! Account */}
                <ListItem
                    pressable
                    leftLabel='Account'
                    iconLeftName='key'
                    onPress={() => navigation.navigate('Account Screen')}
                    />

                {/* // ! Personalization */}
                <ListItem
                    pressable
                    leftLabel='Personalization'
                    iconLeftName='brush'
                    onPress={() => navigation.navigate('Personalization Screen')}
                    />

                {/* // ! Developer */}
                <ListItem
                    pressable
                    leftLabel='Developer'
                    iconLeftName='cog'
                    onPress={() => navigation.navigate('Developer Screen')}
                />


            </View>
        </>
    )
}


export default SettingsScreen;