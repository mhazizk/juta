import { useState } from "react";
import { TextInput, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

const CustomTextInput = ({
  inputType,
  inputQuery,
  inputRef,
  //   secureTextEntry = false,
  onChange,
  placeholder,
  returnKeyType,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const rightButton = () => {
    switch (true) {
      case inputQuery && inputType === "password" && secureTextEntry:
        return (
          <IonIcons
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
            }}
            name="eye"
            size={24}
            color={appSettings.theme.style.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );
      case inputQuery && inputType === "password" && !secureTextEntry:
        return (
          <IonIcons
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
            }}
            name="eye-off"
            size={24}
            color={appSettings.theme.style.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );
      case inputQuery && inputType === "password" && secureTextEntry:
        return (
          <IonIcons
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
            }}
            name="eye"
            size={24}
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
            size={24}
            color={appSettings.theme.style.colors.foreground}
            style={{ paddingHorizontal: 16 }}
          />
        );

      default:
        return;
    }
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
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: appSettings.theme.style.colors.background,
        margin: 8,
      }}
    >
      {inputType === "search" && (
        <IonIcons
          name="search"
          size={24}
          color={appSettings.theme.style.colors.primary}
          style={{ paddingHorizontal: 16 }}
        />
      )}
      {inputType === "email" && (
        <IonIcons
          name="mail"
          size={24}
          color={appSettings.theme.style.colors.primary}
          style={{ paddingHorizontal: 16 }}
        />
      )}
      {inputType === "password" && (
        <IonIcons
          name="key"
          size={24}
          color={appSettings.theme.style.colors.primary}
          style={{ paddingHorizontal: 16 }}
        />
      )}
      <TextInput
        ref={inputRef}
        returnKeyType={returnKeyType || "default"}
        placeholder={placeholder || "Type something here ..."}
        placeholderTextColor={appSettings.theme.style.text.textSecondary.color}
        style={{
          ...appSettings.theme.style.text.textPrimary,
          flex: 1,
          paddingLeft: 0,
          height: 48,
        }}
        secureTextEntry={inputType === "password" && secureTextEntry}
        onChangeText={(searchText) => onChange(searchText)}
        clearButtonMode="while-editing"
        value={inputQuery}
      />
      {rightButton()}
    </View>
  );
};

export default CustomTextInput;
