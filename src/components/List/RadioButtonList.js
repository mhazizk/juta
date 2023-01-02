import { TouchableNativeFeedback, View } from "react-native";
import { TextPrimary } from "../Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";

const RadioButtonList = ({ items, selected, onChange }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  return (
    <>
      {items.map((item) => (
        <TouchableNativeFeedback
          key={item.value}
          onPress={() => {
            onChange(item);
          }}
        >
          <View
            style={{
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
              {item.name && <TextPrimary label={item.name} />}
              {item.secondary && <TextSecondary label={item.secondary} />}
            </View>
            <View
              style={{
                // borderColor:
                //   selected === item.value
                //     ? appSettings.theme.style.colors.primary
                //     : appSettings.theme.style.colors.secondary,
                borderColor: appSettings.theme.style.colors.primary,
                backgroundColor: "transparent",
                height: 20,
                width: 20,
                borderWidth: 1.3,
                borderRadius: 20 / 2,
                // marginRight: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    selected === item.value
                      ? appSettings.theme.style.colors.primary
                      : "transparent",
                  height: 12,
                  width: 12,
                  borderRadius: 16 / 2,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      ))}
    </>
  );
};

export default RadioButtonList;
