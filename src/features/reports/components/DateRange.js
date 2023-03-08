import { View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";

const DateRange = ({ startDateInMillis, endDateInMillis }) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: globalTheme.colors.secondary,
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <TextPrimary
          label={new Date(startDateInMillis).toDateString()}
          style={{ fontWeight: "bold" }}
        />
        <IonIcons
          name="arrow-forward"
          size={20}
          style={{
            paddingHorizontal: 8,
            color: globalTheme.colors.foreground,
          }}
        />
        <TextPrimary
          label={new Date(endDateInMillis).toDateString()}
          style={{ fontWeight: "bold" }}
        />
      </View>
    </View>
  );
};

export default DateRange;
