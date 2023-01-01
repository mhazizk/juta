import { TouchableNativeFeedback } from "react-native";
import { TextPrimary } from "../Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";

const RadioButtonList = ({ items, selected, onChange }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  return (
    <>
      {items.map((item, index) => (
        <TouchableNativeFeedback
          key={index}
          onPress={() => {
            onChange(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <TextPrimary label={item.name} />
          {selected === item.value && (
            <IonIcons
              name="radio-button-on"
              size={24}
              color={appSettings.theme.style.colors.primary}
            />
          )}
        </TouchableNativeFeedback>
      ))}
    </>
  );
};

export default RadioButtonList;
