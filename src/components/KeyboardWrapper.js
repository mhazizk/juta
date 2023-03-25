import { KeyboardAvoidingView, Platform } from "react-native";
import { useGlobalTheme } from "../reducers/GlobalContext";
import { useHeaderHeight } from "@react-navigation/elements";
import Constants from "expo-constants";
import { useEffect } from "react";

const KeyboardViewWrapper = ({ isTextInput = false, children }) => {
  const { globalTheme } = useGlobalTheme();
  const headerHeight = useHeaderHeight();
  let offset =
    Platform.OS === "android" ? headerHeight + Constants.statusBarHeight : 0;

  return (
    <>
      {isTextInput && (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={offset}
          style={{
            // width: "100%",
            // alignItems: "center",
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
