import { Image, TouchableNativeFeedback, View } from "react-native";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings, useGlobalTheme } from "../../../reducers/GlobalContext";
import subscriptionTypes from "../model/subscriptionType";
import IonIcons from "react-native-vector-icons/Ionicons";
import { Path, Svg } from "react-native-svg";

const SubscriptionTypeCard = ({
  currentSubscriptionType,
  subscriptionType,
  yearlySaving = false,
  index,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const {globalTheme} = useGlobalTheme()

  return (
    <>
      <TouchableNativeFeedback
        onPress={() => onPress(subscriptionType)}
        style={
          {
            // zIndex: 1,
          }
        }
      >
        <View
          style={{
            // backgroundColor: globalTheme.colors.secondary,
            height: 150,
            padding: 16,
            zIndex: 1,
            borderWidth:
              currentSubscriptionType === subscriptionType.id ? 2 : 0,
            borderColor:
              currentSubscriptionType === subscriptionType.id
                ? globalTheme.colors.success
                : "transparent",
          }}
        >
          {/* // TAG : Name */}
          <TextPrimary
            label={subscriptionType.name}
            style={{
              fontWeight: "bold",
            }}
          />
          {/* // TAG : Description */}
          <TextPrimary label={subscriptionType.description} />
          {/* // TAG : Price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextPrimary
              label={subscriptionType.currency}
              style={{
                paddingRight: 8,
                fontSize: 18,
              }}
            />
            <TextPrimary
              label={subscriptionType.price || "0"}
              style={{
                fontSize: 24,
              }}
            />
            <TextPrimary
              label={subscriptionType.id === "yearly" ? " /year" : " /month"}
              style={{
                paddingRight: 8,
                fontSize: 16,
              }}
            />
          </View>
          {/* // TAG : Yearly Saving */}
          {yearlySaving && subscriptionType.id === "yearly" && (
            <View
              style={{
                padding: 8,
                borderRadius: 8,
                width: 86,
                alignItems: "center",
                backgroundColor: globalTheme.colors.success,
              }}
            >
              <TextButtonPrimary
                label={` ${
                  Math.floor((yearlySaving * 100) / subscriptionType.price) ||
                  "0"
                }% off`}
                style={{
                  fontWeight: "bold",
                }}
              />
            </View>
          )}
        </View>
        {/* // TAG : Background Image */}
      </TouchableNativeFeedback>
      {subscriptionType.id === "yearly" && (
        <Image
          source={require("../../../assets/img/subscription/yearly-premium-subscription-bg.png")}
          style={{
            width: 150,
            height: 150,
            position: "absolute",
            top: 320,
            right: 16,
            bottom: -16,
          }}
        />
      )}
      {subscriptionType.id === "monthly" && (
        <Image
          source={require("../../../assets/img/subscription/monthly-premium-subscription-bg.png")}
          style={{
            width: 150,
            height: 150,
            position: "absolute",
            top: 160,
            right: 16,
            bottom: -16,
          }}
        />
      )}
      {subscriptionType.id === "free" && (
        <Image
          source={require("../../../assets/img/subscription/free-subscription-bg.png")}
          style={{
            width: 150,
            height: 150,
            position: "absolute",
            top: 0,
            right: 16,
            bottom: -16,
          }}
        />
      )}
    </>
  );
};
export default SubscriptionTypeCard;
