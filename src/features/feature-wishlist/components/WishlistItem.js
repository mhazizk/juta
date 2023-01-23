import { View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";

const WishlistItem = ({ uid, item }) => {
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          backgroundColor: appSettings.theme.style.colors.background,
          borderRadius: 16,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <IonIcons
              name="caret-up"
              size={24}
              color={
                item?.voters.some((voter) => voter === uid)
                  ? appSettings.theme.style.colors.success
                  : appSettings.theme.style.colors.foreground
              }
              style={{
                flex: 1,
              }}
            />
            <TextPrimary label={item.voters.length} />
          </View>
          <TextPrimary
            label={item.name}
            style={{
              flex: 8,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default WishlistItem;
