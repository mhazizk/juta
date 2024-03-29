import { useState } from "react";
import { TextInput, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { TextPrimary } from "./Text";

const CustomTextInput = ({
  title,
  editable = true,
  inputType = "default",
  inputQuery,
  inputRef,
  noMargin = false,
  //   secureTextEntry = false,
  maxLength = null,
  onChange,
  onClearText,
  onEndEditing,
  placeholder,
  returnKeyType,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  let keyboardInputType;
  let textContentType;

  switch (inputType) {
    case "email":
      keyboardInputType = "email-address";
      textContentType = "emailAddress";
      break;
    case "password":
      keyboardInputType = "default";
      textContentType = "oneTimeCode";
      break;
    case "displayName":
      keyboardInputType = "default";
      textContentType = "name";
      break;
    case "search":
      keyboardInputType = "default";
      textContentType = "none";
      break;
    default:
      keyboardInputType = "default";
      textContentType = "none";
      break;
  }

  const rightButton = () => {
    switch (true) {
      case inputQuery && inputType === "password" && !secureTextEntry:
        return (
          <IonIcons
            onPress={() => {
              setSecureTextEntry(true);
            }}
            name="eye"
            size={20}
            color={globalTheme.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );
      case inputQuery && inputType === "password" && secureTextEntry:
        return (
          <IonIcons
            onPress={() => {
              setSecureTextEntry(false);
            }}
            name="eye-off"
            size={20}
            color={globalTheme.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );

      case inputQuery && inputType === "search":
        return (
          <IonIcons
            onPress={() => {
              onChange("");
              onClearText();
            }}
            name="close-circle"
            size={20}
            color={globalTheme.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );

      default:
        return;
    }
  };

  const leftIcon = (inputType) => {
    let iconName = inputType;
    switch (true) {
      case iconName === "search":
        iconName = "search";
        break;
      case iconName === "email":
        iconName = "mail";
        break;
      case iconName === "password":
        iconName = "lock-closed";
        break;
      case iconName === "displayName":
        iconName = "person";
        break;

      default:
        break;
    }
    return (
      <IonIcons
        name={iconName}
        size={20}
        color={globalTheme.colors.primary}
        style={{ paddingHorizontal: 16 }}
      />
    );
  };

  return (
    <>
      <View>
        <View
          style={{
            // flex: 1,
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            flexDirection: "row",
            borderColor: globalTheme.colors.primary,
            justifyContent: "space-between",
            borderRadius: 16,
            borderWidth: 1,
            backgroundColor: globalTheme.colors.background,
            marginVertical: noMargin ? 0 : 8,
          }}
        >
          {leftIcon(inputType)}
          <TextInput
            editable={editable}
            ref={inputRef}
            textContentType={textContentType}
            keyboardType={keyboardInputType}
            returnKeyType={returnKeyType || "default"}
            placeholder={placeholder || "Type something here ..."}
            placeholderTextColor={globalTheme.text.textSecondary.color}
            style={{
              ...globalTheme.text.textPrimary,
              flex: 1,
              paddingLeft: 0,
              height: 48,
            }}
            maxLength={maxLength}
            secureTextEntry={inputType === "password" && secureTextEntry}
            onChangeText={(searchText) => onChange(searchText)}
            onEndEditing={onEndEditing}
            clearButtonMode="never"
            value={inputQuery}
          />
          {rightButton()}
        </View>
        {title && (
          <TextPrimary
            label={title}
            style={{
              backgroundColor: globalTheme.colors.background,
              paddingHorizontal: 8,
              position: "absolute",
              top: 0,
              left: 54,
              fontSize: 14,
            }}
          />
        )}
      </View>
    </>
  );
};

export default CustomTextInput;
