import * as Constants from "expo-constants";
import { View } from "react-native";
import { TextPrimary } from "./Text";

const Footer = () => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 16,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextPrimary label={Constants.default.expoConfig.name} />
        <TextPrimary label={Constants.default.expoConfig.version} />
      </View>
    </>
  );
};

export default Footer;
