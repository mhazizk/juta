import { TouchableNativeFeedback, View } from "react-native";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import * as utils from "../../../utils";

const LoanTransactionItem = ({
  showDate = false,
  transactionType,
  transactionHour,
  transactionNotes,
  transactionDate,
  transactionAmount,
  fromUid,
  toUid,
  isRepeated,
  // transactionId,
  logbookCurrency,
  secondaryCurrency,
  showSecondaryCurrency,
  categoryName,
  iconLeftName,
  iconLeftColor,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { globalLoan } = useGlobalLoan();
  const { userAccount } = useGlobalUserAccount();
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
                paddingVertical: 4,
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
                </View>
                {/* // TAG : Borrower / Loan scheme */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <TextPrimary
                    label={
                      globalLoan.contacts.find((contact) => {
                        return contact.contact_uid === fromUid;
                      })?.contact_name ?? userAccount.displayName
                    }
                    style={{
                      fontSize: 14,
                    }}
                  />
                  <IonIcons
                    name="arrow-forward"
                    size={14}
                    color={globalTheme.colors.foreground}
                    style={{
                      paddingHorizontal: 4,
                    }}
                  />
                  <TextPrimary
                    label={
                      globalLoan.contacts.find((contact) => {
                        return contact.contact_uid === toUid;
                      })?.contact_name ?? userAccount.displayName
                    }
                    style={{
                      fontSize: 14,
                    }}
                  />
                </View>
                {/* // TAG : Bottom Left Side */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {showDate && (
                    <TextSecondary
                      label={new Date(transactionDate).toDateString()}
                      numberOfLines={1}
                      style={{ fontSize: 14 }}
                    />
                  )}
                  <IonIcons
                    name={isRepeated ? "repeat" : "ellipse"}
                    color={
                      isRepeated
                        ? globalTheme.colors.foreground
                        : globalTheme.colors.secondary
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

export default LoanTransactionItem;
