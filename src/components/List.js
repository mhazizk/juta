import { Dimensions, TouchableNativeFeedback, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";
import * as utils from "../utils";
import Loading from "./Loading";

export const ListItem = ({
  leftLabel,
  rightLabel,
  secondaryLabel,
  thirdLabel,
  iconPack,
  useRightLabelContainer = false,
  rightLabelContainerStyle,
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
                  iconLeftColor
                    ? iconLeftColor
                    : !disabled
                    ? appSettings.theme.style.colors.foreground
                    : appSettings.theme.style.text.textSecondary.color
                }
                style={{ paddingRight: 16 }}
              />
            )}
            {iconPack === "FontAwesome5" && (
              <FontAwesome5Icon
                name={iconLeftName}
                color={
                  iconLeftColor || disabled
                    ? appSettings.theme.style.text.textSecondary.color
                    : appSettings.theme.style.colors.foreground
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
                ...appSettings.theme.style.list.listItem,
                flexDirection: "row",
                // maxWidth: "100%",
              }}
            >
              <View>
                {leftLabel && !disabled && <TextPrimary label={leftLabel} />}
                {secondaryLabel && !disabled && (
                  <TextSecondary label={secondaryLabel} />
                )}
                {thirdLabel && !disabled && (
                  <TextSecondary label={thirdLabel} />
                )}
                {leftLabel && disabled && <TextSecondary label={leftLabel} />}
              </View>
              {rightLabel && !useRightLabelContainer && (
                <TextSecondary label={rightLabel} />
              )}
              {rightLabel && useRightLabelContainer && (
                <>
                  <View
                    style={[
                      { ...rightLabelContainerStyle },
                      { maxWidth: "70%" },
                    ]}
                  >
                    {iconInRightContainerName && (
                      <IonIcons
                        name={iconInRightContainerName}
                        size={
                          iconRightSize ||
                          (iconRightName === "checkmark-circle" ? 22 : 18)
                        }
                        color={
                          iconColorInContainer ||
                          appSettings.theme.style.colors.foreground ||
                          lightTheme.colors.foreground
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
                    ? appSettings.theme.style.colors.secondary
                    : iconRightColor
                    ? iconRightColor
                    : appSettings.theme.style.colors.foreground ||
                      lightTheme.colors.foreground
                }
                style={{ paddingLeft: 16 }}
              />
            )}
            {isLoading && <Loading size={18} />}
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
                iconLeftColor ||
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
            {iconRightName && !isLoading && (
              <IonIcons
                name={iconRightName}
                size={
                  iconRightSize ||
                  (iconRightName === "checkmark-circle" ? 22 : 18)
                }
                color={
                  iconRightColor ||
                  appSettings.theme.style.colors.foreground ||
                  lightTheme.colors.foreground
                }
                style={{ paddingLeft: 16 }}
              />
            )}
            {isLoading && <Loading size={18} />}
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
                iconLeftColor ||
                appSettings.theme.style.colors.foreground ||
                lightTheme.colors.foreground
              }
              style={{
                paddingRight: 16,
                // flex: titleMode ? 1 : 0,
              }}
            />
          )}
          <View style={appSettings.theme.style.list.listItem}>
            <View
              style={{
                paddingRight: titleMode ? 34 : 0,
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
              }}
            >
              {middleLabel && (
                <TextPrimary
                  label={middleLabel}
                  style={{
                    color:
                      middleLabelColor ||
                      appSettings.theme.style.colors.foreground,
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {rightLabel && (
                <TextPrimary
                  label={rightLabel}
                  style={{
                    color:
                      rightLabelColor ||
                      appSettings.theme.style.colors.foreground,
                  }}
                />
              )}
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
                <IonIcons
                  name={isRepeated ? "repeat" : "ellipse"}
                  color={
                    isRepeated
                      ? appSettings.theme.style.colors.foreground
                      : appSettings.theme.style.colors.secondary
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
                      // label={new Date(transactionHour).toLocaleTimeString(
                      //   appSettings.locale,
                      //   { hour: "2-digit", minute: "2-digit" }
                      // )}
                      label={
                        new Date(transactionHour)
                          .getHours()
                          .toString()
                          .padStart(2, "0") +
                        ":" +
                        new Date(transactionHour)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")
                      }
                      // label={getTime(transactionHour)}
                      style={{ fontSize: 14 }}
                    />
                  </>
                )}
              </View>
              {/* Bottom Left Side */}
              {/* <TextSecondary label={transactionId} /> */}
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
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
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
                      label={logbookCurrency.symbol}
                      style={{
                        fontSize: 14,
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
                      // label={utils.FormatCurrency({
                      //   amount: transactionAmount,
                      //   currency: currency.name,
                      // })}
                      label={utils.GetFormattedNumber({
                        value: transactionAmount,
                        currency: logbookCurrency.name,
                      })}
                    />
                  </View>
                </>
              )}
              {/* // TAG : Secondary Currency */}
              {showSecondaryCurrency && (
                <>
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
                            ? appSettings.theme.style.colors.incomeSymbol
                            : appSettings.theme.style.text.textSecondary.color,
                      }}
                    />
                    <TextPrimary
                      style={{
                        fontSize: 14,
                        color:
                          transactionType === "income"
                            ? appSettings.theme.style.colors.incomeAmount
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                      // label={utils.FormatCurrency({
                      //   amount: transactionAmount,
                      //   currency: currency.name,
                      // })}
                      label={utils.GetFormattedNumber({
                        value: utils.ConvertCurrency({
                          amount: transactionAmount,
                          from: logbookCurrency.name,
                          target: secondaryCurrency.name,
                        }),
                        currency: secondaryCurrency.name,
                      })}
                    />
                  </View>
                </>
              )}
            </View>
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
                        label={utils.RelativeDate({
                          dateToCheck: transactionDate,
                          locale: appSettings.locale,
                          currentDate: Date.now(),
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
                        label={
                          new Date(transactionDate)
                            .getHours()
                            .toString()
                            .padStart(2, "0") +
                          ":" +
                          new Date(transactionDate)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")
                        }
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

              {/* // TAG : Right Side */}
              {transactionAmount && (
                <>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    {logbookCurrency && (
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
                            paddingRight: 8,
                            fontSize: 14,
                            color:
                              transactionType === "income"
                                ? appSettings.theme.style.colors.incomeSymbol
                                : appSettings.theme.style.text.textSecondary
                                    .color,
                          }}
                        />
                        <TextPrimary
                          style={{
                            fontSize: 18,
                            color:
                              transactionType === "income"
                                ? appSettings.theme.style.colors.incomeAmount
                                : appSettings.theme.style.text.textPrimary
                                    .color,
                          }}
                          label={utils.GetFormattedNumber({
                            value: transactionAmount,
                            currency: logbookCurrency.name,
                          })}
                        />
                      </View>
                    )}
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
                            paddingRight: 8,
                            fontSize: 14,
                            color:
                              transactionType === "income"
                                ? appSettings.theme.style.colors.incomeSymbol
                                : appSettings.theme.style.text.textSecondary
                                    .color,
                          }}
                        />
                        <TextPrimary
                          style={{
                            fontSize: 14,
                            color:
                              transactionType === "income"
                                ? appSettings.theme.style.colors.incomeAmount
                                : appSettings.theme.style.text.textPrimary
                                    .color,
                          }}
                          label={utils.GetFormattedNumber({
                            value: utils.ConvertCurrency({
                              amount: transactionAmount,
                              from: logbookCurrency.name,
                              target: secondaryCurrency.name,
                            }),
                            currency: secondaryCurrency.name,
                          })}
                        />
                      </View>
                    )}
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
                    label={utils.GetFormattedNumber({
                      value: spent,
                      currency:
                        appSettings.logbookSettings.defaultCurrency.name,
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
