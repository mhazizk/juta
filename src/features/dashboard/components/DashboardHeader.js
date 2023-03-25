import { Dimensions, Image, View } from "react-native";
import ProfilePicture from "../../../components/ProfilePicture";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";

const DashboardHeader = ({ onPress }) => {
  const { userAccount } = useGlobalUserAccount();
  const { globalTheme } = useGlobalTheme();
  const checkmark = require("../../../../src/assets/img/checkmark.png");
  const getHours = new Date(Date.now()).getHours();
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // width: "100%",
          paddingVertical: 16,
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            zIndex: 2,
            width: "100%",
            flexDirection: "column",
          }}
        >
          <TextPrimary
            label={
              getHours <= 4
                ? "Good Night"
                : 4 < getHours && getHours <= 10
                ? "Good Morning"
                : 10 < getHours && getHours <= 15
                ? "Good Afternoon"
                : 15 < getHours && getHours <= 21
                ? "Good Evening"
                : 21 < getHours && getHours <= 24
                ? "Good Night"
                : "Good Day"
            }
            style={{ color: globalTheme.colors.textHeader }}
          />
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {userAccount?.displayName && (
              <TextPrimary
                label={userAccount?.displayName}
                style={{
                  fontWeight: "bold",
                  fontSize: 36,
                  color: globalTheme.colors.textHeader,
                }}
              />
            )}
            {userAccount?.subscription?.plan === "premium" && (
              <Image
                source={checkmark}
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 4,
                }}
              />
            )}
          </View>
        </View>
        <ProfilePicture size={54} onPress={() => onPress()} />
      </View>
    </>
  );
};

export default DashboardHeader;
