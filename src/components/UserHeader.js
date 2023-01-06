import { Image, StyleSheet, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import { TextPrimary } from "./Text";

const UserHeaderComponent = ({ navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const checkmark = require("../assets/img/checkmark.png");
  return (
    <>
      {userAccount && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: appSettings.theme.style.colors.background,
            height: "40%",
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
            {/* <Image source={checkmark} style={{ height: 128, width: 128 }} /> */}
            <IonIcons
              name="person"
              size={64}
              color={appSettings.theme.style.colors.primary}
              style={{
                display: !userAccount.account.photoURL ? "flex" : "none",
              }}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <TextPrimary label="Hi," style={{ fontSize: 32, marginRight: 8 }} />
            <TextPrimary
              label={userAccount.account.displayName}
              style={{ fontSize: 32, fontWeight: "bold", marginRight: 4 }}
            />
            <Image
              source={checkmark}
              style={{
                display: userAccount.account.premium ? "flex" : "none",
                height: 22,
                width: 22,
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default UserHeaderComponent;
