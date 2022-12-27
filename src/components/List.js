import {
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import TextTicker from "react-native-text-ticker";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { dailyLimit } from "../utils/DailyLimit";
import formatCurrency from "../utils/FormatCurrency";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { hexToRgb } from "../utils/HexToRgb";
import { relativeDate } from "../utils/RelativeDate";
import { RoundProgressBar } from "./charts/RoundProgressBar";
import { TextButtonPrimary, TextPrimary, TextSecondary } from "./Text";

export const ListItem = ({
  leftLabel,
  rightLabel,
  iconPack,
  props,
  theme,
  symbol,
  pressable,
  iconLeftName,
  iconLeftColor,
  iconRightName,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      {pressable && (
        <TouchableNativeFeedback onPress={onPress}>
          <View style={appSettings.theme.style.list.listContainer}>
            {iconPack === "IonIcons" && (
              <IonIcons
                name={iconLeftName}
                size={18}
                color={
                  iconLeftColor || appSettings.theme.style.colors.foreground
                }
                style={{ paddingRight: 16 }}
              />
            )}
            {iconPack === "FontAwesome5" && (
              <FontAwesome5Icon
                name={iconLeftName}
                color={
                  iconLeftColor || appSettings.theme.style.colors.foreground
                }
                size={18}
                style={{
                  transform: [{ scaleX: -1 }],
                  paddingLeft: 16,
                }}
              />
            )}
            <View style={appSettings.theme.style.list.listItem}>
              {leftLabel && <TextPrimary label={leftLabel} />}
              {rightLabel && <TextSecondary label={rightLabel} />}
            </View>
            {/* {iconPack === "IonIcons" && ( */}
            <IonIcons
              name={iconRightName}
              size={iconRightName === "checkmark-circle" ? 22 : 18}
              color={
                appSettings.theme.style.colors.foreground ||
                lightTheme.colors.foreground
              }
              style={{ paddingLeft: 16 }}
            />
            {/* )} */}
          </View>
        </TouchableNativeFeedback>
      )}

      {!pressable && (
        <View style={appSettings.theme.style.list.listContainer}>
          {iconLeftName && (
            <IonIcons
              name={iconLeftName}
              size={18}
              color={
                appSettings.theme.style.colors.foreground ||
                lightTheme.colors.foreground
              }
              style={{ paddingRight: 16 }}
            />
          )}
          <View style={appSettings.theme.style.list.listItem}>
            {leftLabel && <TextPrimary label={leftLabel} />}
            <View style={{ flexDirection: "row" }}>
              {symbol && <TextSecondary label={symbol} />}
              {rightLabel && <TextSecondary label={rightLabel} />}
            </View>
          </View>
          {iconRightName && (
            <IonIcons
              name={iconRightName}
              size={iconRightName === "checkmark-circle" ? 22 : 18}
              color={
                appSettings.theme.style.colors.foreground ||
                lightTheme.colors.foreground
              }
              style={{ paddingLeft: 16 }}
            />
          )}
        </View>
      )}
    </>
  );
};

export const TransactionListItem = ({
  transactionType,
  transactionHour,
  transactionNotes,
  transactionAmount,
  currency,
  categoryName,
  categoryType,
  leftLabel,
  rightLabel,
  props,
  theme,
  pressable,
  iconLeftName,
  iconLeftColor,
  iconRightName,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <TouchableNativeFeedback onPress={() => onPress()}>
        <View
          style={{
            ...appSettings.theme.style.list.listContainer,
            justifyContent: "space-between",
          }}
        >
          {/* Outer Left Side */}
          {iconLeftName && (
            <IonIcons
              name={iconLeftName}
              size={18}
              color={iconLeftColor || appSettings.theme.style.colors.foreground}
              style={{ paddingRight: 16 }}
            />
          )}

          {/* Line Container */}
          <View style={appSettings.theme.style.list.listItem}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Top Left Side */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {categoryName && <TextPrimary label={categoryName} />}
                {transactionHour && (
                  <>
                    <IonIcons
                      name="ellipse"
                      color={appSettings.theme.style.colors.secondary}
                      size={8}
                      style={{ paddingHorizontal: 8 }}
                    />
                    <TextSecondary
                      label={new Date(transactionHour).toLocaleTimeString(
                        appSettings.locale,
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                      style={{ fontSize: 14 }}
                    />
                  </>
                )}
              </View>
              {/* Bottom Left Side */}
              {transactionNotes && (
                <TextSecondary
                  label={transactionNotes}
                  numberOfLines={1}
                  style={{ fontSize: 14 }}
                />
              )}
            </View>

            {/* Right Side */}
            {transactionAmount && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TextSecondary
                    label={currency.symbol}
                    style={{
                      paddingRight: 8,
                      color:
                        transactionType === "income"
                          ? appSettings.theme.style.colors.incomeSymbol
                          : appSettings.theme.style.text.textSecondary.color,
                    }}
                  />
                  <TextPrimary
                    style={{
                      fontSize: 18,
                      color:
                        transactionType === "income"
                          ? appSettings.theme.style.colors.incomeAmount
                          : appSettings.theme.style.text.textPrimary.color,
                    }}
                    label={formatCurrency({
                      amount: transactionAmount,
                      currency: currency.name,
                    })}
                  />
                </View>
              </>
            )}
          </View>

          {/* Right Side */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {iconRightName && (
              <IonIcons
                name={iconRightName}
                size={iconRightName === "checkmark-circle" ? 22 : 18}
                color={
                  appSettings.theme.style.colors.foreground ||
                  lightTheme.colors.foreground
                }
                style={{ paddingLeft: 16 }}
              />
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export const SearchResultListItem = ({
  transaction,
  transactionType,
  transactionDate,
  transactionNotes,
  transactionAmount,
  currency,
  categoryName,
  logbook,
  logbookName,
  leftLabel,
  rightLabel,
  props,
  theme,
  pressable,
  iconLeftName,
  iconLeftColor,
  iconRightName,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      {pressable && (
        <TouchableNativeFeedback onPress={() => onPress()}>
          <View
            style={{
              ...appSettings.theme.style.list.listContainer,
              justifyContent: "space-between",
            }}
          >
            {/* Outer Left Side */}
            {iconLeftName && (
              <IonIcons
                name={iconLeftName}
                size={18}
                color={
                  iconLeftColor || appSettings.theme.style.colors.foreground
                }
                style={{ paddingRight: 16 }}
              />
            )}

            {/* Line Container */}
            <View style={appSettings.theme.style.list.listItem}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {/* Top Left Side */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {categoryName && <TextPrimary label={categoryName} />}
                  <IonIcons
                    name="at"
                    color={appSettings.theme.style.text.textSecondary.color}
                    size={16}
                    style={{ paddingHorizontal: 8 }}
                  />
                  {logbookName && (
                    <TextPrimary
                      label={
                        logbookName.length > 15
                          ? logbookName.substring(0, 15) + "..."
                          : logbookName
                      }
                    />
                  )}
                </View>
                {/* Middle Left Side */}
                {transactionDate && (
                  <>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TextSecondary
                        label={relativeDate({
                          dateToCheck: transactionDate,
                          locale: appSettings.locale,
                          currentDate: new Date().toLocaleString(
                            appSettings.locale,
                            { timeZone: appSettings.timeZone }
                          ),
                        })}
                        style={{ fontSize: 14 }}
                      />
                      <IonIcons
                        name="ellipse"
                        color={appSettings.theme.style.colors.secondary}
                        size={8}
                        style={{ paddingHorizontal: 8 }}
                      />
                      <TextSecondary
                        label={new Date(transactionDate).toLocaleTimeString(
                          appSettings.locale,
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                        style={{ fontSize: 14 }}
                      />
                    </View>
                  </>
                )}

                {/* Bottom Left Side */}
                {transactionNotes && (
                  <TextSecondary
                    label={
                      transactionNotes.length > 40
                        ? transactionNotes.substring(0, 40) + "..."
                        : transactionNotes
                    }
                    style={{ fontSize: 14 }}
                    numberOfLines={1}
                  />
                )}
              </View>

              {/* Right Side */}
              {transactionAmount && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextSecondary
                      label={currency.symbol}
                      style={{
                        paddingRight: 8,
                        fontSize: 14,
                        color:
                          transactionType === "income"
                            ? appSettings.theme.style.colors.incomeSymbol
                            : appSettings.theme.style.text.textSecondary.color,
                      }}
                    />
                    <TextPrimary
                      style={{
                        fontSize: 18,
                        color:
                          transactionType === "income"
                            ? appSettings.theme.style.colors.incomeAmount
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                      label={formatCurrency({
                        amount: transactionAmount,
                        currency: currency.name,
                      })}
                    />
                  </View>
                </>
              )}
            </View>

            {/* Right Side */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {iconRightName && (
                <IonIcons
                  name={iconRightName}
                  size={iconRightName === "checkmark-circle" ? 22 : 18}
                  color={
                    appSettings.theme.style.colors.foreground ||
                    lightTheme.colors.foreground
                  }
                  style={{ paddingLeft: 16 }}
                />
              )}
            </View>
          </View>
        </TouchableNativeFeedback>
      )}
    </>
  );
};

export const CardList = ({
  title,
  rightLabel,
  iconPack,
  props,
  theme,
  pressable,
  limit,
  spent,
  iconLeftName,
  iconLeftColor,
  iconRightName,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const screenWidth = Dimensions.get("window").width;
  const spentWidth = `${(spent / limit) * 100}%`;

  return (
    <>
      <TouchableNativeFeedback onPress={onPress}>
        {/* Card Container */}
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.secondary,
            padding: 16,
            borderRadius: 16,
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
            <View style={appSettings.theme.style.list.listItem}>
              {/* Title Section */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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

                {title && (
                  <TextPrimary
                    label={title}
                    style={{ fontWeight: "bold", paddingLeft: 16 }}
                  />
                )}
                {rightLabel && <TextSecondary label={rightLabel} />}
              </View>
            </View>

            {/* Progress Bar */}
            <View style={{ position: "relative", height: 150 }}>
              <View
                style={{
                  position: "absolute",
                  height: 10,
                  width: "100%",
                  backgroundColor: appSettings.theme.style.colors.foreground,
                  borderRadius: 16,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  height: 70,
                  width: spentWidth,
                }}
              >
                <View
                  style={{
                    position: "relative",
                    height: 10,
                    width: "100%",
                    backgroundColor: appSettings.theme.style.colors.primary,
                    borderRadius: 16,
                  }}
                />
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <IonIcons name="chevron-up" size={20} />
                  <TextPrimary label={`${(spent / limit) * 100}% spent`} />
                  <TextPrimary
                    label={formatCurrency({
                      amount: spent,
                      currency: appSettings.currency.name,
                    })}
                  />
                </View>
              </View>
            </View>
            {/* Limit Section */}
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};
