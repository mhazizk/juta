import { TouchableNativeFeedback, View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import subscriptionTypes from "../model/subscriptionType";

const SubscriptionTypeCard = ({
  currentSubscriptionType,
  subscriptionType,
  index,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <TouchableNativeFeedback
        onPress={() => onPress(subscriptionType)}
        style={{
          borderRadius: 16,
        }}
      >
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.secondary,
            height: 200,
            padding: 16,
            borderRadius: 16,
            borderWidth:
              currentSubscriptionType === subscriptionType.id ? 2 : 0,
            borderColor:
              currentSubscriptionType === subscriptionType.id
                ? appSettings.theme.style.colors.success
                : "transparent",
          }}
        >
          {/* // TAG : Name */}
          <TextPrimary key={index} label={subscriptionType.name} />
          {/* // TAG : Description */}
          <TextPrimary key={index} label={subscriptionType.description} />
          {/* // TAG : Price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextPrimary
              key={index}
              label={subscriptionType.currency}
              style={{
                paddingRight: 8,
                fontSize: 20,
              }}
            />
            <TextPrimary
              key={index}
              label={subscriptionType.price}
              style={{
                fontSize: 24,
              }}
            />
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};
export default SubscriptionTypeCard;
