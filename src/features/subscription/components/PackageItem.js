import { Image, Text, TouchableNativeFeedback, View } from "react-native";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings, useGlobalTheme } from "../../../reducers/GlobalContext";
import subscriptionTypes from "../model/subscriptionType";
import IonIcons from "react-native-vector-icons/Ionicons";
import { Path, Svg } from "react-native-svg";

const PackageItem = ({ purchasePackage, monthToYearPrice, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const {globalTheme} = useGlobalTheme()
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
            // backgroundColor: globalTheme.colors.secondary,
            height: 150,
            padding: 16,
            zIndex: 1,
            // borderWidth: currentSubscriptionType === offering.id ? 2 : 0,
            // borderColor:
            //   currentSubscriptionType === offering.id
            //     ? globalTheme.colors.success
            //     : "transparent",
          }}
        >
          {/* // TAG : Name */}
          <TextPrimary
            label={description}
            style={{
              fontWeight: "bold",
              paddingBottom: 4,
            }}
          />
          {/* // TAG : Price */}
          {/* // TAG : Discount Price */}
          {title.toLowerCase().includes("yearly") && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 4,
              }}
            >
              <TextPrimary
                label={currencyCode + " " + monthToYearPrice}
                style={{
                  fontSize: 18,
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                }}
              />
              <TextPrimary
                label="/yr"
                style={{
                  paddingRight: 8,
                  fontSize: 16,
                  textDecorationLine: "line-through",
                }}
              />
            </View>
          )}
          {/* // TAG : Offered price */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 4,
            }}
          >
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
          {monthToYearPrice && subscriptionPeriod === "P1Y" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    width: 86,
                    alignItems: "center",
                    marginRight: 8,
                    backgroundColor: globalTheme.colors.success,
                  }}
                >
                  <TextButtonPrimary
                    label={` ${
                      Math.floor(((monthToYearPrice - price) * 100) / price) ||
                      "0"
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
                    // width: 86,
                    alignItems: "center",
                    backgroundColor: globalTheme.colors.success,
                  }}
                >
                  <TextButtonPrimary
                    label="✨ Best Value ✨"
                    style={{
                      fontWeight: "bold",
                    }}
                  />
                </View>
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
