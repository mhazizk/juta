import { Image, TouchableNativeFeedback, View } from "react-native";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import subscriptionTypes from "../model/subscriptionType";
import IonIcons from "react-native-vector-icons/Ionicons";
import { Path, Svg } from "react-native-svg";

const PackageItem = ({ purchasePackage, yearlySaving, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const {
    identifier,
    product: {
      title,
      description,
      priceString,
      price,
      currencyCode,
      subscriptionPeriod,
    },
  } = purchasePackage;
  // const priceUSD = parseFloat(identifier.split("_")[1]);

  return (
    <>
      <TouchableNativeFeedback
        onPress={() => onPress()}
        style={
          {
            // zIndex: 1,
          }
        }
      >
        <View
          style={{
            // backgroundColor: appSettings.theme.style.colors.secondary,
            height: 150,
            padding: 16,
            zIndex: 1,
            // borderWidth: currentSubscriptionType === offering.id ? 2 : 0,
            // borderColor:
            //   currentSubscriptionType === offering.id
            //     ? appSettings.theme.style.colors.success
            //     : "transparent",
          }}
        >
          {/* // TAG : Name */}
          <TextPrimary
            label={description}
            style={{
              fontWeight: "bold",
            }}
          />
          {/* // TAG : Price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* <TextPrimary
              label={offering.currency}
              style={{
                paddingRight: 8,
                fontSize: 18,
              }}
            /> */}
            {priceString !== "0" && (
              <TextPrimary
                label={priceString}
                style={{
                  fontSize: 24,
                }}
              />
            )}
            {priceString !== "0" && (
              <TextPrimary
                label={subscriptionPeriod === "P1M" ? "/mo" : "/yr"}
                style={{
                  paddingRight: 8,
                  fontSize: 16,
                }}
              />
            )}
          </View>
          {/* // TAG : Yearly Saving */}
          {yearlySaving && subscriptionPeriod === "P1Y" && (
            <>
              <View
                style={{
                  padding: 8,
                  borderRadius: 8,
                  width: 86,
                  alignItems: "center",
                  backgroundColor: appSettings.theme.style.colors.success,
                }}
              >
                <TextButtonPrimary
                  label={` ${
                    Math.floor((yearlySaving * 100) / price) || "0"
                  }% off`}
                  style={{
                    fontWeight: "bold",
                  }}
                />
              </View>
              <View
                style={{
                  padding: 8,
                  borderRadius: 8,
                  width: 86,
                  alignItems: "center",
                  backgroundColor: appSettings.theme.style.colors.success,
                }}
              >
                <TextButtonPrimary
                  label="✨ Best Value ✨"
                  style={{
                    fontWeight: "bold",
                  }}
                />
              </View>
            </>
          )}
        </View>
        {/* // TAG : Background Image */}
      </TouchableNativeFeedback>
      {title.toLowerCase().includes("yearly") && (
        <Image
          source={require("../../../assets/img/subscription/yearly-premium-subscription-bg.png")}
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
      {title.toLowerCase().includes("monthly") && (
        <Image
          source={require("../../../assets/img/subscription/monthly-premium-subscription-bg.png")}
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
      {title.toLowerCase().includes("free") && (
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
export default PackageItem;
