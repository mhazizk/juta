import { Text } from "react-native";
import { lightMonoTheme } from "../assets/themes/lightMonoTheme/lightMonoTheme";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";

// TAG : TEXT COMPONENT //

// TAG : Text Primary //
export const TextPrimary = ({ label, props, numberOfLines, theme, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        numberOfLines={numberOfLines}
        style={[{ ...globalTheme.text.textPrimary }, { ...style }]}
      >
        {label || "Primary Text"}
      </Text>
    </>
  );
};

// TAG : Text Button Primary //
export const TextButtonPrimary = ({ label, props, numberOfLines, style }) => {
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        numberOfLines={numberOfLines || null}
        style={[
          { ...globalTheme.button.buttonPrimary.textStyle },
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
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text style={{ ...globalTheme.button.buttonSecondary.textStyle }}>
        {label || "Secondary Text"}
      </Text>
    </>
  );
};

// TAG : Text Button Disabled //
export const TextButtonDisabled = ({ label, props, numberOfLines, style }) => {
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        numberOfLines={numberOfLines || null}
        style={[
          { ...globalTheme.button.buttonDisabled.textStyle },
          { ...(style || null) },
        ]}
      >
        {label || "Disabled Text"}
      </Text>
    </>
  );
};

// TAG : Text Secondary //
export const TextSecondary = ({ label, props, theme, style }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        style={[{ ...globalTheme.text.textSecondary }, { ...(style || null) }]}
      >
        {label || "Secondary Text"}
      </Text>
    </>
  );
};

// TAG : Text Disabled //
export const TextDisabled = ({ label, props, theme, style }) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <Text
        style={[
          {
            ...globalTheme.text.textDisabled,
          },
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
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        style={[{ ...globalTheme.text.textSuccess }, { ...(style || null) }]}
      >
        {label || "Success Text"}
      </Text>
    </>
  );
};

// TAG : Text Warn //
export const TextWarn = ({ label, props, theme, style }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        style={[
          {
            ...globalTheme.text.textWarn,
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
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Text
        style={[
          {
            ...globalTheme.text.textDanger,
          },
          { ...(style || null) },
        ]}
      >
        {label || "Danger Text"}
      </Text>
    </>
  );
};
