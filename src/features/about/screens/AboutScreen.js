import { Image, Platform, View } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import JutaLogo from "../../../assets/icons/juta-app-icon.png";
import Constants from "expo-constants";
import { TextPrimary } from "../../../components/Text";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import * as Linking from "expo-linking";
import * as utils from "../../../utils";

const AboutScreen = ({ item, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <CustomScrollView>
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
          {/* // TAG : Rate */}
          <ListItem
            pressable
            leftLabel="Rate this app"
            iconLeftName="star"
            iconPack="IonIcons"
            onPress={() => {
              const os = utils.getDeviceOSName().toLowerCase();

              os === "android" &&
                Linking.openURL("market://details?id=app.juta");
              os === "ios" &&
                alert("Sorry, this feature is not available yet :(");
            }}
          />
          {/* // TAG : Feedback */}
          <ListItem
            pressable
            leftLabel="Write feedback"
            iconLeftName="chatbubble-ellipses"
            iconPack="IonIcons"
            onPress={() =>
              Linking.openURL(
                `mailto:mhazizk@gmail.com?subject=Feedback%20for%20Juta%20App%20%2D%20${utils.getDeviceOSName()}&body=Hi%20mhazizk%2C%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0ASent%20from%3A%20${utils.getDeviceName()}%0AOperating%20System%3A%20${utils.getDeviceOSName()}%0AApp%20Version%3A%20${
                  Constants.expoConfig.version
                }%0A`
              )
            }
          />
        </ListSection>
        <ListSection>
          {/* // TAG : Website */}
          <ListItem
            pressable
            leftLabel="Visit website"
            iconLeftName="globe"
            iconPack="IonIcons"
            onPress={() => Linking.openURL("https://juta-web.vercel.app")}
          />
          {/* // TAG : Twitter */}
          <ListItem
            pressable
            leftLabel="Visit twitter"
            iconLeftName="logo-twitter"
            iconPack="IonIcons"
            onPress={() => Linking.openURL("https://twitter.com/juta_app")}
          />
        </ListSection>
        <ListSection>
          {/* // TAG : Release notes */}
          <ListItem
            pressable
            leftLabel="Release notes"
            iconLeftName="logo-github"
            iconPack="IonIcons"
            onPress={() =>
              Linking.openURL("https://github.com/mhazizk/juta-release-notes")
            }
          />
        </ListSection>
        <ListSection>
          {/* // TAG : Open Source */}
          <ListItem
            pressable
            leftLabel="Open source libraries"
            iconLeftName="code"
            iconPack="IonIcons"
            onPress={() => alert("Library list will shown soon :)")}
          />
          <ListItem
            pressable
            leftLabel="Test new Error with attachment"
            iconLeftName="code"
            iconPack="IonIcons"
            onPress={() => {
              throw new Error("Test new Error with attachment");
            }}
          />
        </ListSection>
        <TextPrimary
          label={`© Juta ${new Date().getFullYear()}`}
          style={{
            textAlign: "center",
            padding: 16,
          }}
        />
      </CustomScrollView>
    </>
  );
};

export default AboutScreen;
