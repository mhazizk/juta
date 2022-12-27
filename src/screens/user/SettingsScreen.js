import {
  Image, StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";
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

        {/* // ! Account */}
        <ListItem
          pressable
          leftLabel="Account"
          iconLeftName="key"
          iconPack="IonIcons"
          onPress={() => navigation.navigate("Account Screen")}
        />

        {/* // ! Personalization */}
        <ListItem
          pressable
          leftLabel="Personalization"
          iconLeftName="brush"
          iconPack="IonIcons"
          onPress={() => navigation.navigate("Personalization Screen")}
        />

        {/* // ! Developer */}
        <ListItem
          pressable
          leftLabel="Developer"
          iconLeftName="cog"
          iconPack="IonIcons"
          onPress={() => navigation.navigate("Developer Screen")}
        />
      </View>
    </>
  );
};

export default SettingsScreen;
