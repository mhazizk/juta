import { View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import ListSection from "../../../components/List/ListSection";
import * as utils from "../../../utils";

/**
 * Component to show income, expense and deviation
 *
 * Caution:
 * All args should has been converted into default logbook currency.
 * So convertion should be done before passing the args to this component.
 *
 * @param totalIncome - Total income for the selected date range
 * @param totalExpense - Total expense for the selected date range
 * @returns
 */
const IncomeExpenseDeviation = ({
  totalIncome,
  totalExpense,
  showLabel = true,
  backgroundColor = null,
  defaultTextColor = null,
  showSymbol = false,
}) => {
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <ListSection backgroundColor={backgroundColor || null}>
        <View
          style={{
            width: "100%",
            padding: 16,
          }}
        >
          {/* // TAG : Income */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                width: "100%",
              }}
            >
              {!showSymbol && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={globalTheme.colors.success}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {showSymbol && (
                <>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 2,
                      borderRadius: 4,
                      backgroundColor: globalTheme.colors.success,
                    }}
                  >
                    <TextPrimary
                      label="+"
                      style={{
                        fontSize: 16,
                        color:
                          globalTheme.widgets.totalExpense.cardBackgroundColor,
                        fontWeight: "bold",
                      }}
                    />
                  </View>
                </>
              )}
              {showLabel && (
                <TextPrimary
                  label="Total income"
                  style={{
                    color: globalTheme.colors.success,
                  }}
                />
              )}
            </View>
            <TextPrimary
              label={`${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: totalIncome,
                currencyIsoCode:
                  appSettings.logbookSettings.defaultCurrency.isoCode,
                negativeSymbol:
                  appSettings.logbookSettings.defaultCurrency
                    .negativeCurrencySymbol,
              })}`}
              style={{
                color: globalTheme.colors.success,
              }}
            />
          </View>
          {/* // TAG : Expense */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                width: "100%",
              }}
            >
              {!showSymbol && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={globalTheme.colors.danger}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {showSymbol && (
                <>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 2,
                      borderRadius: 4,
                      backgroundColor: globalTheme.colors.danger,
                    }}
                  >
                    <TextPrimary
                      label="-"
                      style={{
                        fontSize: 16,
                        color:
                          globalTheme.widgets.totalExpense.cardBackgroundColor,
                        fontWeight: "bold",
                      }}
                    />
                  </View>
                </>
              )}

              {showLabel && (
                <TextPrimary
                  label="Total expense"
                  style={{
                    color: globalTheme.colors.danger,
                  }}
                />
              )}
            </View>
            <TextPrimary
              label={`${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: totalExpense,
                currencyIsoCode:
                  appSettings.logbookSettings.defaultCurrency.isoCode,
                negativeSymbol:
                  appSettings.logbookSettings.defaultCurrency
                    .negativeCurrencySymbol,
              })}`}
              style={{
                color: globalTheme.colors.danger,
              }}
            />
          </View>
          {/* // TAG : Deviation */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                width: "100%",
              }}
            >
              {!showSymbol && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={defaultTextColor || globalTheme.colors.primary}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {showSymbol && (
                <>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 2,
                      borderRadius: 4,
                      backgroundColor:
                        defaultTextColor || globalTheme.colors.primary,
                    }}
                  >
                    <TextPrimary
                      label="="
                      style={{
                        fontSize: 16,
                        color:
                          globalTheme.widgets.totalExpense.cardBackgroundColor,
                        fontWeight: "bold",
                      }}
                    />
                  </View>
                </>
              )}

              {showLabel && (
                <TextPrimary
                  label="Deviation"
                  style={{
                    color: defaultTextColor || globalTheme.colors.primary,
                  }}
                />
              )}
            </View>
            <TextPrimary
              label={`${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: totalIncome - totalExpense,
                currencyIsoCode:
                  appSettings.logbookSettings.defaultCurrency.isoCode,
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
              })}`}
              style={{
                color: defaultTextColor || globalTheme.colors.primary,
              }}
            />
          </View>
        </View>
      </ListSection>
    </>
  );
};

export default IncomeExpenseDeviation;
