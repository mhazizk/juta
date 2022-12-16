import { TouchableNativeFeedback, View } from "react-native";
import { TextPrimary, TextSecondary } from "./Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../modules/GlobalContext";
import formatCurrency from "../modules/formatCurrency";
import { relativeDate } from "../modules/RelativeDate";

export const ListItem = ({
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
        <TouchableNativeFeedback onPress={onPress}>
          <View style={appSettings.theme.style.list.listContainer}>
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
            <View style={appSettings.theme.style.list.listItem}>
              {leftLabel && <TextPrimary label={leftLabel} />}
              {rightLabel && <TextSecondary label={rightLabel} />}
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
            {rightLabel && <TextSecondary label={rightLabel} />}
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
                        categoryType === "income"
                          ? appSettings.theme.style.colors.incomeSymbol
                          : appSettings.theme.style.text.textSecondary.color,
                    }}
                  />
                  <TextPrimary
                    style={{
                      fontSize: 18,
                      color:
                        categoryType === "income"
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
