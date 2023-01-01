import {
  Image, StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";

const SettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <UserHeaderComponent />
        {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Cash Log Settings</Text>
                </View> */}

        {/* // TAG : Account */}
        <ListItem
          pressable
          leftLabel="Account"
          iconLeftName="key"
          iconPack="IonIcons"
          onPress={() => navigation.navigate(screenList.accountSettingsScreen)}
        />

        {/* // TAG : Currency */}
        <ListItem
          pressable
          leftLabel="Currency"
          iconLeftName="cash"
          iconPack="IonIcons"
          onPress={() => navigation.navigate(screenList.currencySettingsScreen)}
        />

        {/* // TAG : Personalization */}
        <ListItem
          pressable
          leftLabel="Personalization"
          iconLeftName="brush"
          iconPack="IonIcons"
          onPress={() => navigation.navigate(screenList.personalizationSettingsScreen)}
        />

        {/* // TAG : Developer */}
        <ListItem
          pressable
          leftLabel="Developer"
          iconLeftName="cog"
          iconPack="IonIcons"
          onPress={() => navigation.navigate(screenList.developerSettingsScreen)}
        />
      </View>
    </>
  );
};

export default SettingsScreen;
