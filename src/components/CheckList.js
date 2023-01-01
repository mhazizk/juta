import { TouchableNativeFeedback } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary } from "./Text";
const CheckList = ({ item, onPress, selected }) => {
  return (
    <>
      <TouchableNativeFeedback
        onPress={() => {
          onPress(item);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
      >
        <TextPrimary label={item} />
        {selected && (
          <IonIcons
            name="checkmark-circle"
            size={24}
            color={theme.style.colors.primary}
          />
        )}
      </TouchableNativeFeedback>
    </>
  );
};

export default CheckList;
