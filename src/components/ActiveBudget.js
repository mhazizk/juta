import { Dimensions, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { RoundProgressBar } from "./charts/RoundProgressBar";
import { TextButtonPrimary, TextPrimary, TextSecondary } from "./Text";
import * as utils from "../utils";

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
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const screenWidth = Dimensions.get("window").width;
  const spentWidth = `${(spent / limit) * 100}%`;

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        {/* Card Container */}
        <View
          style={{
            backgroundColor: globalTheme.colors.background,
            padding: 16,
            borderRadius: 16,
            // minHeight: 300,
          }}
        >
          <View>
            {iconPack === "FontAwesome5" && (
              <FontAwesome5Icon
                name={iconLeftName}
                color={iconLeftColor || globalTheme.colors.background}
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
                color={iconLeftColor || globalTheme.colors.foreground}
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
                    color={globalTheme.colors.foreground}
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
                  backgroundColor: globalTheme.colors.secondary,
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
                    color: globalTheme.colors.foreground,
                  }}
                />
                {/* <View
                  style={{
                    backgroundColor: globalTheme.colors.secondary,
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
                    backgroundColor: utils.HexToRgb({
                      hex: globalTheme.colors.foreground,
                    }),
                  }}
                />
                <TextPrimary
                  label="Budget Limit"
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.logbookSettings.defaultCurrency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...globalTheme.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={utils.getFormattedNumber({
                        value: limit,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
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
                    backgroundColor: utils.HexToRgb({
                      hex:
                        spent / limit >= 1
                          ? globalTheme.colors.danger
                          : spent / limit >= 0.8
                          ? globalTheme.colors.warn
                          : globalTheme.colors.success,
                    }),
                  }}
                />
                <TextPrimary
                  label="Budget Spent"
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.logbookSettings.defaultCurrency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...globalTheme.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={utils.getFormattedNumber({
                        value: spent,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
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
                    backgroundColor: utils.HexToRgb({
                      opacity: 0.4,
                      hex:
                        spent / limit >= 1
                          ? globalTheme.colors.danger
                          : spent / limit >= 0.8
                          ? globalTheme.colors.warn
                          : globalTheme.colors.success,
                    }),
                  }}
                />
                <TextPrimary
                  label={spent / limit > 1 ? "Overbudget" : "Budget Remaining"}
                  style={{ fontWeight: "bold" }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TextSecondary
                    label={appSettings.logbookSettings.defaultCurrency.symbol}
                    style={{ paddingRight: 4 }}
                  />
                  <TextTicker
                    style={{
                      ...globalTheme.text.textPrimary,
                      fontSize: 16,
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                  >
                    <TextPrimary
                      label={utils.getFormattedNumber({
                        value: limit - spent,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
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
                  backgroundColor: globalTheme.colors.danger,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="warning"
                  size={32}
                  color={globalTheme.button.buttonPrimary.textStyle.color}
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
                  backgroundColor: globalTheme.colors.warn,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="warning"
                  size={32}
                  color={globalTheme.button.buttonPrimary.textStyle.color}
                  style={{ paddingRight: 16 }}
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TextButtonPrimary
                    label="Budget Limit Approaching. Reduce your Expense"
                    style={{ fontWeight: "bold" }}
                  />
                  <TextButtonPrimary
                    label={`Daily Expense Limit: ${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: utils.DailyLimit({
                        limit: limit,
                        spent: spent,
                        startDate: startDate,
                        finishDate: finishDate,
                      }),
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
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
                  backgroundColor: globalTheme.colors.success,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="checkmark-circle-outline"
                  size={32}
                  color={globalTheme.button.buttonPrimary.textStyle.color}
                  style={{ paddingRight: 16 }}
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TextButtonPrimary
                    label="Budget Limit Not Exceeded. Keep it up!"
                    style={{ fontWeight: "bold" }}
                  />
                  <TextButtonPrimary
                    label={`Daily Expense Limit: ${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: utils.DailyLimit({
                        limit: limit,
                        spent: spent,
                        startDate: startDate,
                        finishDate: finishDate,
                      }),
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
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
