import { useState } from "react";
import { TextInput, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

const CustomTextInput = ({
  inputType,
  inputQuery,
  inputRef,
  //   secureTextEntry = false,
  maxLength = null,
  onChange,
  onEndEditing,
  placeholder,
  returnKeyType,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

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
            color={appSettings.theme.style.colors.foreground}
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
            color={appSettings.theme.style.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );

      case inputQuery && inputType === "search":
        return (
          <IonIcons
            onPress={() => {
              onChange("");
            }}
            name="close-circle"
            size={20}
            color={appSettings.theme.style.colors.foreground}
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
        color={appSettings.theme.style.colors.primary}
        style={{ paddingHorizontal: 16 }}
      />
    );
  };

  return (
    <View
      style={{
        // flex: 1,
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        flexDirection: "row",
        borderColor: appSettings.theme.style.colors.primary,
        justifyContent: "space-between",
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: appSettings.theme.style.colors.background,
        margin: 8,
      }}
    >
      {leftIcon(inputType)}
      <TextInput
        ref={inputRef}
        keyboardType={inputType === "password" ? "default" : "default"}
        returnKeyType={returnKeyType || "default"}
        placeholder={placeholder || "Type something here ..."}
        placeholderTextColor={appSettings.theme.style.text.textSecondary.color}
        style={{
          ...appSettings.theme.style.text.textPrimary,
          flex: 1,
          paddingLeft: 0,
          height: 48,
        }}
        maxLength={maxLength}
        secureTextEntry={inputType === "password" && secureTextEntry}
        onChangeText={(searchText) => onChange(searchText)}
        onEndEditing={onEndEditing}
        clearButtonMode="while-editing"
        value={inputQuery}
      />
      {rightButton()}
    </View>
  );
};

export default CustomTextInput;
