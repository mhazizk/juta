import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import UserHeaderComponent from "../../components/UserHeader";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import JutaLogo from "../../assets/icons/juta-app-icon.png";
import Constants from "expo-constants";
import { TextPrimary } from "../../components/Text";

const AboutScreen = ({ item, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* <UserHeaderComponent /> */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <Image
            source={JutaLogo}
            style={{
              height: 128,
              width: 128,
              marginBottom: 16,
            }}
          />
          <TextPrimary
            label={Constants.expoConfig.name}
            style={{
              fontSize: 24,
            }}
          />
          <TextPrimary label={Constants.expoConfig.version} />
          <TextPrimary label={Platform.constants.Manufacturer} />
          <TextPrimary label={Platform.constants.Model} />
          <TextPrimary
            label={
              Platform.OS[0].toUpperCase() +
              Platform.OS.substring(1).toLowerCase()
            }
          />
        </View>
        <ListSection>
          {/* // TAG : Open Source */}
          <ListItem
            pressable
            leftLabel="Open source libraries"
            iconLeftName="code"
            iconPack="IonIcons"
            onPress={() => alert("OTW")}
          />
        </ListSection>
      </View>
    </>
  );
};

export default AboutScreen;
