import { Dimensions, TouchableNativeFeedback, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";
import * as utils from "../utils";
import Loading from "./Loading";
import ListSection from "./List/ListSection";
import CountryFlag from "react-native-country-flag";
import TextTicker from "react-native-text-ticker";
import { getCalendars } from "expo-localization";

const is24hours = getCalendars()[0]?.uses24hourClock;

export const ListItem = ({
  leftLabel,
  rightLabel,
  rightLabelColor = null,
  secondaryLabel,
  thirdLabel,
  iconPack,
  isDanger,
  useRightLabelContainer = false,
  rightLabelContainerStyle,
  useFlagIcon,
  flagIsoCode,
  flagIconSize = 18,
  iconColorInContainer,
  iconInRightContainerName,
  rightLabelStyle,
  isLoading = false,
  props,
  theme,
  symbol,
  pressable,
  disabled = false,
  iconLeftName,
  iconLeftColor,
  iconRightName,
  iconRightSize,
  iconRightColor,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <TouchableNativeFeedback onPress={pressable ? onPress : null}>
        <View
          style={{
            ...globalTheme.list.listContainer,
            // backgroundColor: isDanger ? globalTheme.colors.danger : null,
          }}
        >
          {iconPack === "IonIcons" && (
            <IonIcons
              name={iconLeftName}
              size={18}
              color={
                iconLeftColor
                  ? iconLeftColor
                  : !disabled
                  ? globalTheme.colors.foreground
                  : globalTheme.text.textSecondary.color
              }
              style={{ paddingRight: 16 }}
            />
          )}
          {iconPack === "FontAwesome5" && (
            <FontAwesome5Icon
              name={iconLeftName}
              color={
                iconLeftColor || disabled
                  ? globalTheme.text.textSecondary.color
                  : globalTheme.colors.foreground
              }
              size={18}
              style={{
                transform: [{ scaleX: -1 }],
                paddingLeft: 16,
              }}
            />
          )}
          <View
            style={{
              ...globalTheme.list.listItem,
              flexDirection: "row",
              // maxWidth: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              {leftLabel && !disabled && (
                <TextPrimary
                  label={leftLabel}
                  style={{
                    color: isDanger
                      ? globalTheme.colors.danger
                      : globalTheme.text.textPrimary.color,
                  }}
                />
              )}
              {secondaryLabel && !disabled && (
                <TextSecondary label={secondaryLabel} />
              )}
              {thirdLabel && !disabled && (
                <TextSecondary
                  label={thirdLabel}
                  style={{
                    fontSize: 14,
                  }}
                />
              )}
              {leftLabel && disabled && <TextSecondary label={leftLabel} />}
            </View>
            {rightLabel && !useRightLabelContainer && (
              <TextSecondary
                label={rightLabel}
                style={{
                  color:
                    rightLabelColor || globalTheme.text.textSecondary.color,
                }}
              />
            )}
            {rightLabel && useRightLabelContainer && (
              <>
                <View
                  style={[{ ...rightLabelContainerStyle }, { maxWidth: "70%" }]}
                >
                  {useFlagIcon && (
                    <CountryFlag
                      isoCode={flagIsoCode}
                      size={flagIconSize}
                      style={{
                        marginRight: 8,
                      }}
                    />
                  )}

                  {iconInRightContainerName && (
                    <IonIcons
                      name={iconInRightContainerName}
                      size={
                        iconRightSize ||
                        (iconRightName === "checkmark-circle" ? 22 : 18)
                      }
                      color={
                        iconColorInContainer || globalTheme.colors.foreground
                      }
                      style={{ paddingRight: 8 }}
                    />
                  )}

                  <TextPrimary
                    label={rightLabel}
                    style={{ ...(rightLabelStyle || null) }}
                  />
                </View>
              </>
            )}
          </View>
          {/* {iconPack === "IonIcons" && ( */}

          {iconRightName && !isLoading && (
            <IonIcons
              name={iconRightName}
              size={
                iconRightSize ||
                (iconRightName === "checkmark-circle" ? 22 : 18)
              }
              color={
                disabled
                  ? globalTheme.colors.secondary
                  : iconRightColor
                  ? iconRightColor
                  : globalTheme.colors.foreground
              }
              style={{ paddingLeft: 16 }}
            />
          )}
          {isLoading && <Loading size={18} />}
          {/* )} */}
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export const ListTable = ({
  onPress,
  isLoading = false,
  theme,
  symbol,
  pressable,
  iconPack,
  titleMode,
  // left
  leftLabel,
  iconLeftName,
  iconLeftColor,
  props,
  // middle
  middleLabel,
  middleLabelColor,
  // right
  rightLabel,
  rightLabelColor,
  iconRightName,
  iconRightSize,
  iconRightColor,
}) => {
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      {pressable && (
        <TouchableNativeFeedback onPress={onPress}>
          {/* <View style={globalTheme.list.listContainer}> */}
          <View
            style={{
              width: "100%",
            }}
          >
            {iconPack === "IonIcons" && (
              <IonIcons
                name={iconLeftName}
                size={18}
                color={iconLeftColor || globalTheme.colors.foreground}
                style={{ paddingRight: 16 }}
              />
            )}
            {iconPack === "FontAwesome5" && (
              <FontAwesome5Icon
                name={iconLeftName}
                color={iconLeftColor || globalTheme.colors.foreground}
                size={18}
                style={{
                  transform: [{ scaleX: -1 }],
                  paddingLeft: 16,
                }}
              />
            )}
            <View style={globalTheme.list.listItem}>
              {leftLabel && <TextPrimary label={leftLabel} />}
              {rightLabel && <TextSecondary label={rightLabel} />}
            </View>
            {/* {iconPack === "IonIcons" && ( */}
            {iconRightName && !isLoading && (
              <IonIcons
                name={iconRightName}
                size={
                  iconRightSize ||
                  (iconRightName === "checkmark-circle" ? 22 : 18)
                }
                color={iconRightColor || globalTheme.colors.foreground}
                style={{ paddingLeft: 16 }}
              />
            )}
            {isLoading && <Loading size={18} />}
            {/* )} */}
            {/* </View> */}
          </View>
        </TouchableNativeFeedback>
      )}

      {!pressable && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          {iconLeftName && (
            <IonIcons
              name={iconLeftName}
              size={18}
              color={iconLeftColor || globalTheme.colors.foreground}
              style={{
                paddingRight: 16,
                // flex: titleMode ? 1 : 0,
              }}
            />
          )}
          <View
            style={{
              width: "100%",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                paddingRight: titleMode ? 32 : 0,
                flex: 3,
                alignItems: titleMode ? "center" : "flex-start",
              }}
            >
              {leftLabel && <TextPrimary label={leftLabel} />}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(typeof middleLabel === "string" ||
                typeof middleLabel === "number" ||
                titleMode) && (
                <TextPrimary
                  label={middleLabel}
                  style={{
                    color: middleLabelColor || globalTheme.colors.foreground,
                  }}
                />
              )}
              {typeof middleLabel === "boolean" && !titleMode && (
                <IonIcons
                  name={middleLabel ? "checkmark-sharp" : "close"}
                  size={18}
                  color={
                    middleLabel
                      ? globalTheme.colors.success
                      : globalTheme.colors.danger
                  }
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingRight: titleMode ? 0 : 32,
              }}
            >
              {(typeof rightLabel === "string" ||
                typeof rightLabel === "number" ||
                titleMode) && (
                <TextPrimary
                  label={rightLabel}
                  style={{
                    color: rightLabelColor || globalTheme.colors.foreground,
                  }}
                />
              )}
              {typeof rightLabel === "boolean" && !titleMode && (
                <IonIcons
                  name={rightLabel ? "checkmark-sharp" : "close"}
                  size={18}
                  color={
                    rightLabel
                      ? globalTheme.colors.success
                      : globalTheme.colors.danger
                  }
                />
              )}
            </View>
          </View>
          {iconRightName && (
            <IonIcons
              name={iconRightName}
              size={iconRightName === "checkmark-circle" ? 22 : 18}
              color={globalTheme.colors.foreground}
              style={{ paddingLeft: 16 }}
            />
          )}
        </View>
      )}
    </>
  );
};

export const TransactionListItem = ({
  showDate = false,
  transactionType,
  transactionHour,
  transactionNotes,
  transactionDate,
  transactionAmount,
  isRepeated,
  // transactionId,
  logbookCurrency,
  secondaryCurrency,
  showSecondaryCurrency,
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
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  return (
    <>
      <TouchableNativeFeedback onPress={() => onPress()}>
        <View
          style={{
            ...globalTheme.list.listContainer,
            // width: "100%",
          }}
        >
          {/* // TAG : Left side + right side */}
          <View
            style={{
              flexDirection: "row",
              // width: "100%",
              // justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* // TAG : icon */}
            {iconLeftName && (
              <IonIcons
                name={iconLeftName}
                size={18}
                color={iconLeftColor || globalTheme.colors.foreground}
                style={{ paddingRight: 16 }}
              />
            )}

            {/* Line Container */}
            <View
              style={{
                ...globalTheme.list.listItem,
                width: "100%",
                justifyContent: "space-between",
                // alignItems: "center",
              }}
            >
              {/* // TAG : Left side */}
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {/* // TAG : Top Left Side */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {categoryName && <TextPrimary label={categoryName} />}
                  <IonIcons
                    name={isRepeated ? "repeat" : "ellipse"}
                    color={
                      isRepeated
                        ? globalTheme.colors.foreground
                        : globalTheme.text.textSecondary.color
                    }
                    size={isRepeated ? 16 : 8}
                    style={{
                      display: transactionHour || isRepeated ? "flex" : "none",
                      paddingHorizontal: 8,
                    }}
                  />
                  {transactionHour && (
                    <>
                      <TextSecondary
                        label={new Date(transactionHour).toLocaleTimeString(
                          "en-US",
                          {
                            hourCycle: is24hours ? "h24" : "h12",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                        style={{ fontSize: 14 }}
                      />
                    </>
                  )}
                </View>
                {/* // TAG : Bottom Left Side */}
                {showDate && (
                  <TextSecondary
                    label={new Date(transactionDate).toDateString()}
                    numberOfLines={1}
                    style={{ fontSize: 14 }}
                  />
                )}
                {transactionNotes && (
                  <TextSecondary
                    label={transactionNotes}
                    numberOfLines={1}
                    style={{ fontSize: 14 }}
                  />
                )}
              </View>

              {/* // SECTION : Right Side */}
              {/* // TAG : Main Currency */}
              <View
                style={{
                  // flexDirection: "column",
                  // justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                {transactionAmount && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextSecondary
                      label={logbookCurrency.symbol}
                      style={{
                        fontSize: 14,
                        paddingRight: 8,
                        color:
                          transactionType === "income"
                            ? globalTheme.colors.incomeSymbol
                            : globalTheme.text.textSecondary.color,
                      }}
                    />
                    <TextPrimary
                      style={{
                        fontSize: 18,
                        color:
                          transactionType === "income"
                            ? globalTheme.colors.incomeAmount
                            : globalTheme.text.textPrimary.color,
                      }}
                      // label={utils.FormatCurrency({
                      //   amount: transactionAmount,
                      //   currency: currency.name,
                      // })}
                      label={utils.getFormattedNumber({
                        value: transactionAmount,
                        currencyIsoCode: logbookCurrency.isoCode,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      })}
                    />
                  </View>
                )}
                {/* // TAG : Secondary Currency */}
                {showSecondaryCurrency && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TextSecondary
                      label={secondaryCurrency.symbol}
                      style={{
                        fontSize: 14,
                        paddingRight: 8,
                        color:
                          transactionType === "income"
                            ? globalTheme.colors.incomeSymbol
                            : globalTheme.text.textSecondary.color,
                      }}
                    />
                    <TextPrimary
                      style={{
                        fontSize: 14,
                        color:
                          transactionType === "income"
                            ? globalTheme.colors.incomeAmount
                            : globalTheme.text.textPrimary.color,
                      }}
                      label={utils.getFormattedNumber({
                        value: utils.convertCurrency({
                          amount: transactionAmount,
                          from: logbookCurrency.name,
                          target: secondaryCurrency.name,
                          globalCurrencyRates: globalCurrencyRates,
                        }),
                        currencyIsoCode: secondaryCurrency.isoCode,
                      })}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export const SearchResultListItem = ({
  // Main Currency
  transactionAmount,
  logbookCurrency,
  // Secondary Currency
  secondaryCurrency,
  showSecondaryCurrency,
  // Transaction Details
  transaction,
  transactionType,
  transactionDate,
  transactionNotes,
  // repeat id
  repeatId = null,
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
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  return (
    <>
      {pressable && (
        <TouchableNativeFeedback onPress={() => onPress()}>
          <View
            style={{
              ...globalTheme.list.listContainer,
            }}
          >
            {/* // TAG : left side + right side */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* // TAG : Icon */}
              {iconLeftName && (
                <IonIcons
                  name={iconLeftName}
                  size={18}
                  color={iconLeftColor || globalTheme.colors.foreground}
                  style={{ paddingRight: 16 }}
                />
              )}

              {/* Line Container */}
              <View
                style={{
                  ...globalTheme.list.listItem,
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {/* // TAG : Left side */}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                    paddingVertical: 4,
                  }}
                >
                  {/* // TAG : Top Left Side */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {categoryName && <TextPrimary label={categoryName} />}
                    <IonIcons
                      name={repeatId ? "repeat" : "at"}
                      color={
                        repeatId
                          ? globalTheme.colors.foreground
                          : globalTheme.text.textSecondary.color
                      }
                      size={16}
                      style={{ paddingHorizontal: 4 }}
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
                      shouldAnimateTreshold={10}
                    >
                      {logbookName && (
                        <TextPrimary
                          label={
                            logbookName.length > 15
                              ? logbookName.substring(0, 15) + "..."
                              : logbookName
                          }
                        />
                      )}
                    </TextTicker>
                  </View>
                  {/* // TAG : Middle Left Side */}
                  {transactionDate && (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TextSecondary
                          label={utils.relativeDate({
                            dateToCheck: transactionDate,
                            locale: appSettings.locale,
                            currentDate: Date.now(),
                          })}
                          style={{ fontSize: 14 }}
                        />
                        <IonIcons
                          name="ellipse"
                          color={globalTheme.text.textSecondary.color}
                          size={8}
                          style={{ paddingHorizontal: 8 }}
                        />
                        <TextSecondary
                          label={new Date(transactionDate).toLocaleTimeString(
                            "en-US",
                            {
                              hourCycle: is24hours ? "h24" : "h12",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
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
              </View>
              {/* // TAG : Right Side */}
              {transactionAmount && (
                <View
                  style={{
                    alignItems: "flex-end",
                    marginLeft: 4,
                  }}
                >
                  {/* // TAG : Main currency */}
                  {logbookCurrency && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextSecondary
                        label={logbookCurrency.symbol}
                        style={{
                          paddingRight: 8,
                          fontSize: 14,
                          color:
                            transactionType === "income"
                              ? globalTheme.colors.incomeSymbol
                              : globalTheme.text.textSecondary.color,
                        }}
                      />

                      <TextPrimary
                        style={{
                          fontSize: 18,
                          color:
                            transactionType === "income"
                              ? globalTheme.colors.incomeAmount
                              : globalTheme.text.textPrimary.color,
                        }}
                        label={utils.getFormattedNumber({
                          value: transactionAmount,
                          currencyIsoCode: logbookCurrency.isoCode,
                        })}
                      />
                    </View>
                  )}
                  {/* // TAG : Secondary currency */}
                  {showSecondaryCurrency && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextSecondary
                        label={secondaryCurrency.symbol}
                        style={{
                          paddingRight: 8,
                          fontSize: 14,
                          color:
                            transactionType === "income"
                              ? globalTheme.colors.incomeSymbol
                              : globalTheme.text.textSecondary.color,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 14,
                          color:
                            transactionType === "income"
                              ? globalTheme.colors.incomeAmount
                              : globalTheme.text.textPrimary.color,
                        }}
                        label={utils.getFormattedNumber({
                          value: utils.convertCurrency({
                            amount: transactionAmount,
                            from: logbookCurrency.name,
                            target: secondaryCurrency.name,
                            globalCurrencyRates: globalCurrencyRates,
                          }),
                          currencyIsoCode: secondaryCurrency.isoCode,
                        })}
                      />
                    </View>
                  )}
                </View>
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
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  const screenWidth = Dimensions.get("window").width;
  const spentWidth = `${(spent / limit) * 100}%`;

  return (
    <>
      <TouchableNativeFeedback onPress={onPress}>
        {/* Card Container */}
        <View
          style={{
            backgroundColor: globalTheme.colors.secondary,
            padding: 16,
            borderRadius: 16,
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
            <View style={globalTheme.list.listItem}>
              {/* Title Section */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5Icon
                  name={iconLeftName}
                  color={iconLeftColor || globalTheme.colors.foreground}
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
                  backgroundColor: globalTheme.colors.foreground,
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
                    backgroundColor: globalTheme.colors.primary,
                    borderRadius: 16,
                  }}
                />
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <IonIcons name="chevron-up" size={20} />
                  <TextPrimary label={`${(spent / limit) * 100}% spent`} />
                  <TextPrimary
                    label={utils.getFormattedNumber({
                      value: spent,
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
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
