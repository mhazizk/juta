import { Dimensions, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { dailyLimit } from "../utils/DailyLimit";
import formatCurrency from "../utils/FormatCurrency";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { hexToRgb } from "../utils/HexToRGB";
import { RoundProgressBar } from "./charts/RoundProgressBar";
import { TextButtonPrimary, TextPrimary, TextSecondary } from "./Text";

export const ActiveBudget = ({
  // Card Props
  onPress,
  title,
  rightLabel,
  iconPack,
  finishDate,
  iconLeftName,
  iconLeftColor,
  repeat,
  // Chart Props
  spent,
  limit,
  width,
  data,
  startDate,
  transactionList,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const screenWidth = Dimensions.get("window").width;
  const spentWidth = `${(spent / limit) * 100}%`;

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        {/* Card Container */}
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.background,
            padding: 16,
            borderRadius: 16,
            // minHeight: 300,
          }}
        >
          <View>
            {iconPack === "FontAwesome5" && (
              <FontAwesome5Icon
                name={iconLeftName}
                color={
                  iconLeftColor || appSettings.theme.style.colors.background
                }
                size={54}
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  transform: [{ scaleX: -1 }],
                }}
              />
            )}
            {/* Title Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FontAwesome5Icon
                name={iconLeftName}
                color={
                  iconLeftColor || appSettings.theme.style.colors.foreground
                }
                size={20}
                style={{
                  transform: [{ scaleX: -1 }],
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {title && (
                  <TextPrimary
                    label={title}
                    style={{ fontWeight: "bold", paddingRight: 8 }}
                  />
                )}
                {repeat && (
                  <IonIcons
                    name="repeat"
                    size={20}
                    color={appSettings.theme.style.colors.foreground}
                  />
                )}
              </View>
              {rightLabel && <TextSecondary label={rightLabel} />}
            </View>
            {/* Date Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: appSettings.theme.style.colors.secondary,
                  borderRadius: 16,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <TextPrimary
                  label={new Date(startDate).toDateString()}
                  style={{ fontWeight: "bold" }}
                />
                {/* </View> */}
                <IonIcons
                  name="arrow-forward"
                  size={20}
                  style={{
                    paddingHorizontal: 8,
                    color: appSettings.theme.style.colors.foreground,
                  }}
                />
                {/* <View
                  style={{
                    backgroundColor: appSettings.theme.style.colors.secondary,
                    borderRadius: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}
                > */}
                <TextPrimary
                  label={new Date(finishDate).toDateString()}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
            <View>
              <RoundProgressBar
                width={Dimensions.get("window").width - 32}
                spent={spent}
                limit={limit}
                data={data}
                label="Budget Spent"
              />
            </View>

            {/* Container */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
              }}
            >
              {/* Budget Limit */}
              {/* Indicator */}
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 16,
                    width: 16,
                    borderRadius: 50,
                    backgroundColor: hexToRgb({
                      hex: appSettings.theme.style.colors.foreground,
                    }),
                  }}
                />
                <TextPrimary
                  label="Budget Limit"
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.currency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...appSettings.theme.style.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={formatCurrency({
                        amount: limit,
                        currency: appSettings.currency.name,
                      })}
                    />
                  </TextTicker>
                </View>
              </View>

              {/* Amount Spent */}
              {/* Indicator */}
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 16,
                    width: 16,
                    borderRadius: 50,
                    backgroundColor: hexToRgb({
                      hex:
                        spent / limit >= 1
                          ? appSettings.theme.style.colors.danger
                          : spent / limit >= 0.8
                          ? appSettings.theme.style.colors.warn
                          : appSettings.theme.style.colors.success,
                    }),
                  }}
                />
                <TextPrimary
                  label="Budget Spent"
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.currency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...appSettings.theme.style.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={formatCurrency({
                        amount: spent,
                        currency: appSettings.currency.name,
                      })}
                    />
                  </TextTicker>
                </View>
              </View>

              {/* Budget Remaining */}
              {/* Indicator */}
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 16,
                    width: 16,
                    borderRadius: 50,
                    backgroundColor: hexToRgb({
                      opacity: 0.4,
                      hex:
                        spent / limit >= 1
                          ? appSettings.theme.style.colors.danger
                          : spent / limit >= 0.8
                          ? appSettings.theme.style.colors.warn
                          : appSettings.theme.style.colors.success,
                    }),
                  }}
                />
                <TextPrimary
                  label={spent / limit > 1 ? "Overbudget" : "Budget Remaining"}
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.currency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...appSettings.theme.style.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={formatCurrency({
                        amount: limit - spent,
                        currency: appSettings.currency.name,
                      })}
                    />
                  </TextTicker>
                </View>
              </View>
            </View>

            {/* Info Card */}
            {/* Danger Info */}
            {spent / limit > 1 && (
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: appSettings.theme.style.colors.danger,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="warning"
                  size={32}
                  color={
                    appSettings.theme.style.button.buttonPrimary.textStyle.color
                  }
                  style={{ paddingRight: 16 }}
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TextButtonPrimary
                    label="Budget Limit Exceeded. Reduce your Expense"
                    style={{ fontWeight: "bold" }}
                  />
                </View>
              </View>
            )}

            {/* Warning Info */}
            {spent / limit <= 1 && spent / limit > 0.8 && (
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: appSettings.theme.style.colors.warn,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="warning"
                  size={32}
                  color={
                    appSettings.theme.style.button.buttonPrimary.textStyle.color
                  }
                  style={{ paddingRight: 16 }}
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TextButtonPrimary
                    label="Budget Limit Approaching. Reduce your Expense"
                    style={{ fontWeight: "bold" }}
                  />
                  <TextButtonPrimary
                    label={`Daily Expense Limit: ${
                      appSettings.currency.symbol
                    } ${formatCurrency({
                      amount: dailyLimit({
                        limit: limit,
                        spent: spent,
                        startDate: startDate,
                        finishDate: finishDate,
                      }),
                      currency: appSettings.currency.name,
                    })}/day`}
                    // style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}

            {/* On Track Info */}
            {spent / limit <= 0.8 && (
              <View
                style={{
                  borderRadius: 16,
                  padding: 16,
                  marginVertical: 8,
                  backgroundColor: appSettings.theme.style.colors.success,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="checkmark-circle-outline"
                  size={32}
                  color={
                    appSettings.theme.style.button.buttonPrimary.textStyle.color
                  }
                  style={{ paddingRight: 16 }}
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TextButtonPrimary
                    label="Budget Limit Not Exceeded. Keep it up!"
                    style={{ fontWeight: "bold" }}
                  />
                  <TextButtonPrimary
                    label={`Daily Expense Limit: ${
                      appSettings.currency.symbol
                    } ${formatCurrency({
                      amount: dailyLimit({
                        limit: limit,
                        spent: spent,
                        startDate: startDate,
                        finishDate: finishDate,
                      }),
                      currency: appSettings.currency.name,
                    })}/day`}
                    // style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}

            {/* Limit Section */}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
