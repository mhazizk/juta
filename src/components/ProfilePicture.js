import { Dimensions, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import { Image } from "expo-image";

const ProfilePicture = ({ size = 64, onPress }) => {
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
              height: size,
              width: size,
              borderRadius: size / 2,
              borderWidth: size / 24,
            }}
          >
            {userAccount.photoURL && (
              <Image
                source={{ uri: userAccount.photoURL }}
                cachePolicy="memory-disk"
                style={{
                  borderRadius: size / 2,
                  height: size,
                  width: size,
                }}
              />
            )}
            <IonIcons
              name="person"
              size={size / 3}
              color={globalTheme.colors.primary}
              style={{
                display: !userAccount.photoURL ? "flex" : "none",
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ProfilePicture;
