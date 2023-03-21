import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";
import { Image } from "expo-image";

const UserHeaderComponent = ({ navigation, onPress }) => {
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const checkmark = require("../assets/img/checkmark.png");
  // const statHeight = StatusBar.currentHeight;
  return (
    <>
      {userAccount && (
        <View
          style={{
            flexDirection: "column",
            backgroundColor: globalTheme.colors.background,
            // height: "40%",
            height: Dimensions.get("window").height * 0.4,
            // flex:1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => onPress()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderColor: globalTheme.colors.primary,
              height: 128,
              width: 128,
              borderRadius: 128 / 2,
              borderWidth: 3,
            }}
          >
            {userAccount.photoURL && (
              <Image
                source={{ uri: userAccount.photoURL }}
                cachePolicy="memory-disk"
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
              color={globalTheme.colors.primary}
              style={{
                display: !userAccount.photoURL ? "flex" : "none",
              }}
            />
          </TouchableOpacity>
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
