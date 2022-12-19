import { TouchableOpacity, View } from "react-native";
import { TextPrimary } from "./Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
} from "../modules/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const MyBudgets = ({
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
  iconColor,
  iconName,
  textColor,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { budgets, dispatchBudgets } = useGlobalBudgets();

  // TODO Add Budget widget logic

  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <View
          style={{
            height: boxHeight || 150,
            width: boxWidth || 150,
            backgroundColor: "#FFE088",
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
            label="My Budget"
            style={{
              fontWeight: "bold",
              fontSize: 18,
              padding: 16,
              color: appSettings.theme.style.colors.background,
            }}
          />

          <FontAwesome5Icon
            name="piggy-bank"
            color="#FFC727"
            size={100}
            style={{
              transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
              zIndex: -1,
              position: "absolute",
              bottom: -10,
              right: -10,
            }}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};
