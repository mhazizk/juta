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
const IncomeExpenseDeviation = ({ totalIncome, totalExpense }) => {
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <ListSection>
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
              <IonIcons
                name="ellipse"
                size={12}
                color={globalTheme.colors.success}
                style={{
                  paddingRight: 8,
                }}
              />
              <TextPrimary label="Total income" />
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
              <IonIcons
                name="ellipse"
                size={12}
                color={globalTheme.colors.danger}
                style={{
                  paddingRight: 8,
                }}
              />
              <TextPrimary label="Total expense" />
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
              <IonIcons
                name="ellipse"
                size={12}
                color={globalTheme.colors.primary}
                style={{
                  paddingRight: 8,
                }}
              />
              <TextPrimary label="Deviation" />
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
                color: globalTheme.colors.primary,
              }}
            />
          </View>
        </View>
      </ListSection>
    </>
  );
};

export default IncomeExpenseDeviation;
