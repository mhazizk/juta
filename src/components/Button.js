import { TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import {
  TextButtonDisabled,
  TextButtonPrimary,
  TextButtonSecondary,
  TextDanger,
  TextPrimary,
} from "./Text";

// TAG : BUTTON COMPONENT //

/**
 * Button Primary
 *
 * @param {*} label, props, onPress, condition, theme, width, style
 * @returns
 */
export const ButtonPrimary = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style = null,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...globalTheme.button.buttonPrimary.buttonStyle },
            {
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...style },
          ]}
        >
          <TextButtonPrimary label={label} />
        </View>
      </TouchableOpacity>
    </>
  );
};
/**
 * Button Primary Icon
 *
 * @param label, props, onPress, condition, theme, width, style
 * @returns
 */
export const ButtonPrimaryIcon = ({
  label,
  props,
  onPress,
  condition,
  iconName = null,
  iconPack = null,
  theme,
  width,
  style = null,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...globalTheme.button.buttonPrimary.buttonStyle },
            {
              flexDirection: "row",
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...style },
          ]}
        >
          {iconPack === "IonIcons" && (
            <IonIcons
              name={iconName}
              size={20}
              color={globalTheme.button.buttonPrimary.textStyle.color}
              style={{
                paddingRight: 8,
              }}
            />
          )}
          <TextButtonPrimary label={label} />
        </View>
      </TouchableOpacity>
    </>
  );
};

// TAG : Button Primary Danger
export const ButtonPrimaryDanger = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...globalTheme.button.buttonPrimary.buttonStyle },
            {
              backgroundColor: globalTheme.colors.danger,
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          <TextButtonPrimary label={label} />
        </View>
      </TouchableOpacity>
    </>
  );
};

// TAG : Button Disabled
export const ButtonDisabled = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style = null,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <View
        style={[
          { ...globalTheme.button.buttonDisabled.buttonStyle },
          {
            minWidth: 80,
            minHeight: 48,
            width: width || null,
            paddingHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            // margin: 4
          },
          { ...style },
        ]}
      >
        <TextButtonDisabled label={label} />
      </View>
    </>
  );
};

// TAG : Button Secondary
export const ButtonSecondary = ({
  label,
  props,
  onPress,
  condition,
  width,
  style,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...globalTheme.button.buttonSecondary.buttonStyle },
            {
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          <TextButtonSecondary label={label} />
        </View>
      </TouchableOpacity>
    </>
  );
};

// TAG : Button Secondary Danger
export const ButtonSecondaryDanger = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...globalTheme.button.buttonDanger.buttonStyle },
            {
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          <TextDanger label={label} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export const ImgButton = ({
  label,
  props,
  onPress,
  boxColor,
  boxHeight,
  boxWidth,
  boxMarginLeft,
  boxMarginRight,
  boxMarginTop,
  boxMarginBottom,
  iconPack,
  iconColor,
  iconName,
  textColor,
  condition,
  theme,
  width,
  style,
}) => {
  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <View
          style={{
            height: boxHeight || 150,
            width: boxWidth || 150,
            backgroundColor: boxColor,
            marginTop: boxMarginTop || 0,
            marginBottom: boxMarginBottom || 0,
            marginLeft: boxMarginLeft || 0,
            marginRight: boxMarginRight || 0,
            borderRadius: 16,
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <TextPrimary
            label={label}
            style={{
              fontWeight: "bold",
              fontSize: 18,
              padding: 16,
              color: textColor,
            }}
          />
          {iconPack === "IonIcons" && (
            <IonIcons
              name={iconName}
              color={iconColor}
              size={100}
              style={{
                transform: [{ rotate: "-0deg" }],
                zIndex: -1,
                position: "absolute",
                bottom: -10,
                right: -10,
              }}
            />
          )}
          {iconPack === "fontAwesome5" && (
            <FontAwesome5Icon
              name={iconName}
              color={iconColor}
              size={100}
              style={{
                transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
                zIndex: -1,
                position: "absolute",
                bottom: -10,
                right: -10,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

// TAG : Button Switch
export const ButtonSwitch = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      {/* <TouchableOpacity onPress={onPress}>
        <View
          style={[
            condition
              ? { ...appSettings.theme.style.button.buttonPrimary.buttonStyle }
              : {
                  ...appSettings.theme.style.button.buttonSecondary.buttonStyle,
                  borderWidth: 0,
                },
            {
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          {condition && <TextButtonPrimary label={label} />}
          {!condition && <TextSecondary label={label} />}
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            condition
              ? { ...globalTheme.button.buttonPrimary.buttonStyle }
              : {
                  ...globalTheme.button.buttonSecondary.buttonStyle,
                  borderWidth: 0,
                },
            {
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          {condition && <TextButtonPrimary label={label} />}
          {!condition && <TextButtonSecondary label={label} />}
        </View>
      </TouchableOpacity>
    </>
  );
};
