import { TouchableNativeFeedback, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";
const CheckList = ({
  primaryLabel,
  secondaryLabel,
  item,
  onPress,
  selected,
}) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <TouchableNativeFeedback
        onPress={() => {
          onPress(item);
        }}
      >
        <View
          style={{
            ...appSettings.theme.style.list.listContainer,
            flexDirection: "row",
            paddingHorizontal: 16,
            minHeight: 48,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          >
          <View
            style={{
              ...appSettings.theme.style.list.listItem,
              flex: 1,
              maxWidth: "80%",
              paddingVertical: 8,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {primaryLabel && <TextPrimary label={primaryLabel} />}
            {secondaryLabel && (
              <TextSecondary label={secondaryLabel} style={{ fontSize: 14 }} />
            )}
          </View>
          <View
            style={{
              borderColor:
                selected === item
                  ? "transparent"
                  : appSettings.theme.style.colors.secondary,
              backgroundColor:
                selected === item
                  ? appSettings.theme.style.colors.primary
                  : "transparent",
              height: 20,
              width: 20,
              borderWidth: 1.3,
              borderRadius: 8,
              // marginRight: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selected === item && (
              <IonIcons
                name="checkmark-sharp"
                size={16}
                color={appSettings.theme.style.colors.background}
              />
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export default CheckList;
