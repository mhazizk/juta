import { Text } from "react-native";
import { lightTheme } from "../assets/themes/lightTheme";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

// TAG : TEXT COMPONENT //

// TAG : Text Primary //
export const TextPrimary = ({ label, props, numberOfLines, theme, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Text
        numberOfLines={numberOfLines}
        style={[
          { ...appSettings.theme.style.text.textPrimary },
          { ...(style || null) },
        ]}
      >
        {label || "Primary Text"}
      </Text>
    </>
  );
};

// TAG : Text Button Primary //
export const TextButtonPrimary = ({ label, props, numberOfLines, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Text
        numberOfLines={numberOfLines || null}
        style={[
          { ...appSettings.theme.style.button.buttonPrimary.textStyle },
          { ...(style || null) },
        ]}
      >
        {label || "Primary Text"}
      </Text>
    </>
  );
};

// TAG : Text Button Secondary //
export const TextButtonSecondary = ({ label, props, theme, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Text style={appSettings.theme.style.button.buttonSecondary.textStyle}>
        {label || "Secondary Text"}
      </Text>
    </>
  );
};

// TAG : Text Secondary //
export const TextSecondary = ({ label, props, theme, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Text
        style={[
          { ...appSettings.theme.style.text.textSecondary },
          { ...(style || null) },
        ]}
      >
        {label || "Secondary Text"}
      </Text>
    </>
  );
};

// TAG : Text Disabled //
export const TextDisabled = ({ label, props, theme, style }) => {
  return (
    <>
      <Text
        style={[
          { ...(theme.text.textDisabled || lightTheme.text.textDisabled) },
          { ...(style || null) },
        ]}
      >
        {label || "Disabled Text"}
      </Text>
    </>
  );
};

// TAG : Text Success //
export const TextSuccess = ({ label, props, theme, style }) => {
  return (
    <>
      <Text
        style={[
          { ...(theme.text.textSuccess || lightTheme.text.textSuccess) },
          { ...(style || null) },
        ]}
      >
        {label || "Success Text"}
      </Text>
    </>
  );
};

// TAG : Text Warn //
export const TextWarn = ({ label, props, theme, style }) => {
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <Text
        style={[
          {
            ...(appSettings.theme.style.text.textWarn ||
              lightTheme.text.textWarn),
          },
          { ...(style || null) },
        ]}
      >
        {label || "Warn Text"}
      </Text>
    </>
  );
};

// TAG : Text Danger //
export const TextDanger = ({ label, props, theme, style }) => {
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <Text
        style={[
          {
            ...(appSettings.theme.style.text.textDanger ||
              lightTheme.text.textDanger),
          },
          { ...(style || null) },
        ]}
      >
        {label || "Danger Text"}
      </Text>
    </>
  );
};
