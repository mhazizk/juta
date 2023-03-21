import { KeyboardAvoidingView, Platform } from "react-native";
import { useGlobalTheme } from "../reducers/GlobalContext";
import { useHeaderHeight } from "@react-navigation/elements";
import Constants from "expo-constants";

const KeyboardViewWrapper = ({ isTextInput, children }) => {
  const { globalTheme } = useGlobalTheme();
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset =
    Platform.OS === "android" ? headerHeight + Constants.statusBarHeight : 0;
  return (
    <>
      {isTextInput && (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            backgroundColor: globalTheme.colors.background,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          }}
        >
          {children}
        </KeyboardAvoidingView>
      )}
      {!isTextInput && children}
    </>
  );
};

export default KeyboardViewWrapper;
