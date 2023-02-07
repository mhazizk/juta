import { View, Text, ScrollView } from "react-native";
import { useGlobalTheme } from "../reducers/GlobalContext";

nestedScrollEnabled;
const CustomScrollView = ({
  children,
  nestedScrollEnabled = false,
  contentContainerStyle,
}) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <ScrollView
      nestedScrollEnabled={nestedScrollEnabled}
      contentContainerStyle={[
        {
          minHeight: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: globalTheme.colors.background,
        },
        { ...contentContainerStyle },
      ]}
    >
      {children}
    </ScrollView>
  );
};

export default CustomScrollView;
