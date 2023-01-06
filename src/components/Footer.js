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
        <TextPrimary label="Cash Log" />
        <TextPrimary label="v.1.0.0" />
      </View>
    </>
  );
};

export default Footer;
