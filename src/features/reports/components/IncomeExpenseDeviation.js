import { View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import ListSection from "../../../components/List/ListSection";
import * as utils from "../../../utils";
import TextTicker from "react-native-text-ticker";
import { useEffect, useState } from "react";

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
  useWidgetStyle = false,
}) => {
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  const [incomeViewWidth, setIncomeViewWidth] = useState(0);
  const [expenseViewWidth, setExpenseViewWidth] = useState(0);
  const [deviationViewWidth, setDeviationViewWidth] = useState(0);
  const [incomeTextWidth, setIncomeTextWidth] = useState(0);
  const [expenseTextWidth, setExpenseTextWidth] = useState(0);
  const [deviationTextWidth, setDeviationTextWidth] = useState(0);
  const [useAbbreviation, setUseAbbreviation] = useState(false);

  useEffect(() => {
    console.log(
      JSON.stringify(
        {
          incomeViewWidth,
          incomeTextWidth,
          expenseViewWidth,
          expenseTextWidth,
          deviationViewWidth,
          deviationTextWidth,
        },
        null,
        2
      )
    );
  }, [
    incomeViewWidth,
    expenseViewWidth,
    deviationViewWidth,
    incomeTextWidth,
    expenseTextWidth,
    deviationTextWidth,
  ]);
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
                // flex: 1,
                alignItems: "center",
                // width: "100%",
              }}
            >
              {!useWidgetStyle && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={globalTheme.colors.success}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {useWidgetStyle && (
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
              {!useWidgetStyle && (
                <TextPrimary
                  label="Total income"
                  style={{
                    color: globalTheme.colors.success,
                  }}
                />
              )}
            </View>
            <View
              onLayout={({ nativeEvent }) => {
                const { x, y, width, height } = nativeEvent.layout;
                setIncomeViewWidth(width);
              }}
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <View
                onLayout={({ nativeEvent }) => {
                  const { x, y, width, height } = nativeEvent.layout;
                  setIncomeTextWidth(width);
                }}
              >
                {useWidgetStyle && (
                  <TextPrimary
                    numberOfLines={1}
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      useAbbreviation: true,
                      value: totalIncome,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.defaultCurrency
                          .negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: globalTheme.colors.success,
                    }}
                  />
                )}
                {!useWidgetStyle && (
                  <TextPrimary
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: totalIncome,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.defaultCurrency
                          .negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: globalTheme.colors.success,
                    }}
                  />
                )}
              </View>
            </View>
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
                // flex: 1,
                alignItems: "center",
                // width: "100%",
              }}
            >
              {!useWidgetStyle && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={globalTheme.colors.danger}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {useWidgetStyle && (
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
                        label="-"
                        style={{
                          fontSize: 16,
                          color:
                            globalTheme.widgets.totalExpense
                              .cardBackgroundColor,
                          fontWeight: "bold",
                        }}
                      />
                    </TextTicker>
                  </View>
                </>
              )}

              {!useWidgetStyle && (
                <TextPrimary
                  label="Total expense"
                  style={{
                    color: globalTheme.colors.danger,
                  }}
                />
              )}
            </View>
            <View
              onLayout={({ nativeEvent }) => {
                const { x, y, width, height } = nativeEvent.layout;
                setExpenseViewWidth(width);
              }}
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <View
                onLayout={({ nativeEvent }) => {
                  const { x, y, width, height } = nativeEvent.layout;
                  setExpenseTextWidth(width);
                }}
              >
                {!useWidgetStyle && (
                  <TextPrimary
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: totalExpense,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.defaultCurrency
                          .negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: globalTheme.colors.danger,
                    }}
                  />
                )}
                {useWidgetStyle && (
                  <TextPrimary
                    numberOfLines={1}
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      useAbbreviation: true,
                      value: totalExpense,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.defaultCurrency
                          .negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: globalTheme.colors.danger,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
          {/* // TAG : Deviation */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // flex: 1,
                alignItems: "center",
                // width: "100%",
              }}
            >
              {!useWidgetStyle && (
                <IonIcons
                  name="ellipse"
                  size={12}
                  color={defaultTextColor || globalTheme.colors.primary}
                  style={{
                    paddingRight: 8,
                  }}
                />
              )}
              {useWidgetStyle && (
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

              {!useWidgetStyle && (
                <TextPrimary
                  label="Deviation"
                  style={{
                    color: defaultTextColor || globalTheme.colors.primary,
                  }}
                />
              )}
            </View>
            <View
              onLayout={({ nativeEvent }) => {
                const { x, y, width, height } = nativeEvent.layout;
                setDeviationViewWidth(width);
              }}
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <View
                onLayout={({ nativeEvent }) => {
                  const { x, y, width, height } = nativeEvent.layout;
                  setDeviationTextWidth(width);
                }}
              >
                {useWidgetStyle && (
                  <TextPrimary
                    numberOfLines={1}
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      useAbbreviation: true,
                      value: totalIncome - totalExpense,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: defaultTextColor || globalTheme.colors.primary,
                    }}
                  />
                )}
                {!useWidgetStyle && (
                  <TextPrimary
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: totalIncome - totalExpense,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })}`}
                    style={{
                      color: defaultTextColor || globalTheme.colors.primary,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </ListSection>
    </>
  );
};

export default IncomeExpenseDeviation;
