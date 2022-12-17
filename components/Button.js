import { TouchableOpacity, View, Text } from "react-native";
import { globalStyles, globalTheme } from "../assets/themes/globalStyles";
import { lightTheme } from "../assets/themes/lightTheme";
import {
  TextButtonPrimary,
  TextButtonSecondary,
  TextDanger,
  TextPrimary,
  TextSecondary,
} from "./Text";
import { useGlobalAppSettings } from "../modules/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

// ! BUTTON COMPONENT //

// ! Button Primary
export const ButtonPrimary = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...appSettings.theme.style.button.buttonPrimary.buttonStyle },
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
          {/* <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}> */}
          <TextButtonPrimary label={label} />
          {/* </View> */}
        </View>
      </TouchableOpacity>
    </>
  );
};

// ! Button Secondary
export const ButtonSecondary = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  style,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            { ...appSettings.theme.style.button.buttonSecondary.buttonStyle },
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
          {/* <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}> */}
          <TextButtonSecondary label={label} />
          {/* </View> */}
        </View>
      </TouchableOpacity>
    </>
  );
};

// ! Button Icon Danger
export const ButtonIconDanger = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  iconName,
  style,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            {
              backgroundColor:
                theme.button.buttonDanger.backgroundColor || "transparent",
              borderRadius: theme.button.buttonDanger.borderRadius || null,
              borderWidth: theme.button.buttonDanger.borderWidth || null,
              borderColor: theme.button.buttonDanger.borderColor || null,
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
          <View
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {iconName && (
              <IonIcons
                name={iconName}
                size={16}
                color={theme.colors.danger || lightTheme.colors.danger}
              />
            )}
            <TextDanger label={label} theme={theme} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

// ! Button Icon Success
export const ButtonIconSuccess = ({
  label,
  props,
  onPress,
  condition,
  theme,
  width,
  iconName,
  style,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            {
              ...(theme.button.buttonSuccess ||
                lightTheme.button.buttonSuccess),
              minWidth: 80,
              minHeight: 48,
              width: width || null,
              paddingHorizontal: 16,
              // margin: 4
            },
            { ...(style || null) },
          ]}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {iconName && (
              <IonIcons
                name={iconName}
                size={16}
                color={theme.colors.success || lightTheme.colors.success}
              />
            )}
            <TextDanger label={label} theme={theme} />
          </View>
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
          {iconPack === "ionIcons" && (
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
// ! Button Primary //
// export const ButtonPrimary = ({ label, props, onPress, condition, theme, width }) => {

//     let buttonStyle;
//     let buttonTheme;
//     let textButtonTheme;
//     let textButtonStyle;

//     switch (true) {
//         case theme === 'light':
//             buttonStyle = globalStyles.lightTheme.buttonPrimary;
//             buttonTheme = globalTheme.lightTheme.buttonPrimary;
//             textButtonTheme = globalTheme.lightTheme.textButtonPrimary;
//             textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
//             break;
//         case theme === 'dark':
//             buttonStyle = globalStyles.darkTheme.buttonPrimary;
//             buttonTheme = globalTheme.darkTheme.buttonPrimary
//             textButtonTheme = globalTheme.darkTheme.textButtonPrimary;
//             textButtonStyle = globalStyles.darkTheme.textButtonPrimary;
//             break;
//         default:
//             buttonStyle = globalStyles.lightTheme.buttonPrimary;
//             buttonTheme = globalTheme.lightTheme.buttonPrimary
//             textButtonTheme = globalTheme.lightTheme.textButtonPrimary;
//             textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
//             break;
//     }

//     return (
//         <>
//             <TouchableOpacity onPress={onPress}>
//                 <View style={[{
//                     ...buttonStyle,
//                     minWidth: 80,
//                     width: (width ? width : null),
//                     paddingHorizontal: 16,
//                     // margin: 4
//                 }, buttonTheme]}>
//                     <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{ ...textButtonTheme }}>{label}</Text>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         </>
//     )
// }

// ! Button Secondary //
// export const ButtonSecondary = ({ label, props, type, onPress, condition, theme, width }) => {

//     let buttonStyle;
//     let buttonTheme;
//     let textButtonTheme;
//     let textButtonStyle;

//     switch (true) {
//         case theme === 'light':
//             buttonStyle = globalStyles.lightTheme.buttonSecondary;
//             buttonTheme = globalTheme.lightTheme.buttonSecondary;
//             textButtonTheme = globalTheme.lightTheme.textbuttonSecondary;
//             textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
//             break;
//         case theme === 'dark':
//             buttonStyle = globalStyles.darkTheme.buttonSecondary;
//             buttonTheme = globalTheme.darkTheme.buttonSecondary
//             textButtonTheme = globalTheme.darkTheme.textbuttonSecondary;
//             textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
//             break;
//         default:
//             buttonStyle = globalStyles.lightTheme.buttonSecondary;
//             buttonTheme = globalTheme.lightTheme.buttonSecondary
//             textButtonTheme = globalTheme.lightTheme.textbuttonSecondary;
//             textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
//             break;
//     }

//     return (
//         <>
//             <TouchableOpacity onPress={onPress}>
//                 <View style={[{
//                     ...buttonStyle,
//                     minWidth: 80,
//                     width: (width ? width : null),
//                     paddingHorizontal: 16,
//                     // margin: 4
//                 }, buttonTheme]}>
//                     <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{ ...textButtonTheme }}>{label}</Text>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         </>
//     )
// }

// ! Button Switch //
export const ButtonSwitch = ({
  label,
  condition,
  onPress,
  props,
  theme,
  width,
}) => {
  let buttonDidFocusStyle;
  let buttonNotFocusStyle;
  let buttonDidFocusTheme;
  let buttonNotFocusTheme;
  let textButtonDidFocusTheme;
  let textButtonNotFocusTheme;
  let textButtonStyle;

  switch (true) {
    case theme === "light":
      // Did Focus
      buttonDidFocusStyle = globalStyles.lightTheme.buttonPrimary;
      buttonDidFocusTheme = globalTheme.lightTheme.buttonPrimary;
      textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
      textButtonDidFocusTheme = globalTheme.lightTheme.textButtonPrimary;
      // Not Focus
      buttonNotFocusStyle = globalStyles.lightTheme.buttonSecondary;
      buttonNotFocusTheme = globalTheme.lightTheme.buttonSecondary;
      textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
      textButtonNotFocusTheme = globalTheme.lightTheme.textButtonSecondary;
      break;
    case theme === "dark":
      // Did Focus
      buttonDidFocusStyle = globalStyles.darkTheme.buttonPrimary;
      buttonDidFocusTheme = globalTheme.darkTheme.buttonPrimary;
      textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
      textButtonDidFocusTheme = globalTheme.darkTheme.textButtonPrimary;
      // Not Focus
      buttonNotFocusStyle = globalStyles.darkTheme.buttonSecondary;
      buttonNotFocusTheme = globalTheme.darkTheme.buttonSecondary;
      textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
      textButtonNotFocusTheme = globalTheme.darkTheme.textButtonSecondary;
      break;
    default:
      // Did Focus
      buttonDidFocusStyle = globalStyles.lightTheme.buttonPrimary;
      buttonDidFocusTheme = globalTheme.lightTheme.buttonPrimary;
      textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
      textButtonDidFocusTheme = globalTheme.lightTheme.textButtonPrimary;
      // Not Focus
      buttonNotFocusStyle = globalStyles.lightTheme.buttonSecondary;
      buttonNotFocusTheme = globalTheme.lightTheme.buttonSecondary;
      textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
      textButtonNotFocusTheme = globalTheme.lightTheme.textButtonSecondary;
      break;
  }

  const isButtonFocusStyle = condition
    ? buttonDidFocusStyle
    : buttonNotFocusStyle;
  const isButtonFocusTheme = condition
    ? buttonDidFocusTheme
    : buttonNotFocusTheme;
  const isTextFocusTheme = condition
    ? textButtonDidFocusTheme
    : textButtonNotFocusTheme;

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[
            {
              ...isButtonFocusStyle,
              minWidth: 80,
              width: width ? width : null,
              paddingHorizontal: 16,
              // margin: 4,
            },
            isButtonFocusTheme,
          ]}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={isTextFocusTheme}>{label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
