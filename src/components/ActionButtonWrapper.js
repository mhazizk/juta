import { View, Text, Platform } from "react-native";

const ActionButtonWrapper = ({ paddingHorizontal = null, children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: Platform.OS === "ios" ? 32 : 24,
        paddingHorizontal: paddingHorizontal || 48,
      }}
    >
      {children}
    </View>
  );
};

export default ActionButtonWrapper;
