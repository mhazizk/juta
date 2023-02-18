import { TouchableOpacity } from "react-native";
import { TextPrimary } from "../../components/Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalTheme } from "../../reducers/GlobalContext";

const HeaderButtonRight = ({ iconName, textLabel, onPress }) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        marginRight: 20,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        onPress();
      }}
    >
      <IonIcons
        name={iconName}
        size={20}
        color={globalTheme.colors.textHeader}
      />
      <TextPrimary
        label={textLabel}
        style={{
          color: globalTheme.colors.textHeader,
          paddingLeft: 4,
        }}
      />
    </TouchableOpacity>
  );
};

export default HeaderButtonRight;
