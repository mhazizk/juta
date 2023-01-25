import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";

const UserHeaderComponent = ({ navigation }) => {
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const checkmark = require("../assets/img/checkmark.png");
  // const statHeight = StatusBar.currentHeight;
  return (
    <>
      {userAccount && (
        <View
          style={{
            flexDirection: "column",
            backgroundColor: appSettings.theme.style.colors.background,
            // height: "40%",
            height: Dimensions.get("window").height * 0.4,
            // flex:1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderColor: appSettings.theme.style.colors.primary,
              height: 128,
              width: 128,
              borderRadius: 128 / 2,
              borderWidth: 3,
            }}
          >
            {userAccount.photoURL && (
              <Image
                source={{ uri: userAccount.photoURL }}
                style={{
                  borderRadius: 128 / 2,
                  height: 128,
                  width: 128,
                }}
              />
            )}
            <IonIcons
              name="person"
              size={64}
              color={appSettings.theme.style.colors.primary}
              style={{
                display: !userAccount.photoURL ? "flex" : "none",
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 8,
              alignItems: "baseline",
            }}
          >
            <TextPrimary label="Hi," style={{ fontSize: 32, marginRight: 8 }} />
            <TextPrimary
              label={userAccount.displayName}
              style={{ fontSize: 32, fontWeight: "bold", marginRight: 4 }}
            />
            <Image
              source={checkmark}
              style={{
                display:
                  userAccount?.subscription?.plan === "premium"
                    ? "flex"
                    : "none",
                height: 22,
                width: 22,
              }}
            />
          </View>
          <TextSecondary
            label={userAccount.email}
            style={{ fontWeight: "bold", marginRight: 4 }}
          />
        </View>
      )}
    </>
  );
};

export default UserHeaderComponent;
