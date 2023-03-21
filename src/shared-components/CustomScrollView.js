import { ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { useGlobalTheme } from "../reducers/GlobalContext";

const CustomScrollView = ({
  enteringAnimation = null,
  children,
  nestedScrollEnabled = false,
  contentContainerStyle,
}) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <Animated.ScrollView
      entering={enteringAnimation}
      nestedScrollEnabled={nestedScrollEnabled}
      contentContainerStyle={[
        {
          minHeight: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: globalTheme.colors.background,
        },
        { ...contentContainerStyle },
      ]}
    >
      {children}
    </Animated.ScrollView>
  );
};

export default CustomScrollView;
