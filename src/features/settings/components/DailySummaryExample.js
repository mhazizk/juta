import { Dimensions, SectionList, View } from "react-native";
import { TransactionListItem } from "../../../components/List";
import TransactionListSection from "../../../components/List/TransactionListSection";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import transactionDetailsModel from "../../transactions/models/transactionDetailsModel";
import * as utils from "../../../utils";

const DailySummaryExample = () => {
  const { logbooks } = useGlobalLogbooks();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { categories } = useGlobalCategories();

  const transaction1 = {
    ...transactionDetailsModel({
      userAccountUid: "userAccountUid",
      logbookId: logbooks.logbooks[0].logbook_id,
    }),
  };

  transaction1.details.in_out = "expense";
  transaction1.details.amount = 100000;
  transaction1.details.category_id = "4";
  transaction1.details.date = Date.now();
  transaction1.details.notes = "Groceries";

  const transaction2 = {
    ...transactionDetailsModel({
      userAccountUid: "userAccountUid",
      logbookId: logbooks.logbooks[0].logbook_id,
    }),
  };

  transaction2.details.in_out = "income";
  transaction2.details.amount = 5000000;
  transaction2.details.category_id = "13";
  transaction2.details.date = Date.now();
  transaction2.details.notes = "Monthly Salary";

  const mappedTransactions = [
    {
      title: utils.getRelativeDate(Date.now()),
      customDate: utils.getCustomDate(Date.now()),
      data: [transaction1, transaction2],
    },
  ];

  const sumAmount = (data) => {
    if (data) {
      let sum = [];
      switch (appSettings.logbookSettings.dailySummary) {
        case "expense-only":
          data.forEach((transaction) => {
            if (transaction.details.in_out === "expense") {
              sum.push(transaction.details.amount);
            }
          });
          break;
        case "income-only":
          data.forEach((transaction) => {
            if (transaction.details.in_out === "income") {
              sum.push(transaction.details.amount);
            }
          });
          break;
        case "expense-income":
          data.forEach((transaction) => {
            if (transaction.details.in_out === "expense") {
              sum.push(+transaction.details.amount);
            }
            if (transaction.details.in_out === "income") {
              sum.push(-transaction.details.amount);
            }
          });
          break;
        case "income-expense":
          data.forEach((transaction) => {
            if (transaction.details.in_out === "expense") {
              sum.push(-transaction.details.amount);
            }
            if (transaction.details.in_out === "income") {
              sum.push(+transaction.details.amount);
            }
          });
          break;

        default:
          data.forEach((transaction) => {
            if (transaction.details.in_out === "expense") {
              sum.push(transaction.details.amount);
            }
          });
          break;
      }
      return sum.reduce((prev, curr) => prev + curr, 0);
    }
  };

  console.log(JSON.stringify(mappedTransactions, null, 2));

  return (
    <>
      <SectionList
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={7}
        scrollsToTop
        updateCellsBatchingPeriod={1000}
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
        // removeClippedSubviews
        sections={mappedTransactions}
        keyExtractor={(item, index) => index.toString()}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <>
            <View
              style={[
                {
                  width: Dimensions.get("window").width - 64,
                  //   paddingTop: 16,
                  paddingBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  //   backgroundColor: globalTheme.colors.background,
                },
              ]}
            >
              {/* // TAG : Date Title */}
              <TextSecondary
                label={section.title}
                style={{
                  paddingLeft: 16,
                  flex: 1,
                }}
              />
              <View
                style={{
                  backgroundColor: utils.hexToRgb({
                    hex: globalTheme.colors.listSection,
                    opacity: 0.07,
                  }),
                  padding: 8,
                  borderRadius: 8,
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <TextPrimary
                    label={logbooks.logbooks[0].logbook_currency.symbol}
                    style={{ paddingRight: 8 }}
                  />
                  <TextPrimary
                    label={utils.getFormattedNumber({
                      value: sumAmount(section.data),
                      currencyCountryName:
                        logbooks.logbooks[0].logbook_currency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })}
                  />
                </View>
              </View>
            </View>
          </>
        )}
        renderItem={({ item, index, section }) => {
          const transactionCategory = utils.FindById.findCategoryById({
            id: item?.details.category_id,
            categories: categories.categories,
          });

          return (
            <>
              <TransactionListSection
                isFirstItem={index === 0}
                isLastItem={index === section.data.length - 1}
              >
                <TransactionListItem
                  categoryName={utils.upperCaseThisFirstLetter(
                    transactionCategory?.name
                  )}
                  isRepeated={item.repeat_id ? true : false}
                  transactionHour={
                    appSettings.logbookSettings.showTransactionTime &&
                    item.details.date
                  }
                  transactionType={item.details.in_out}
                  transactionNotes={
                    appSettings.logbookSettings.showTransactionNotes &&
                    item.details.notes
                  }
                  iconLeftName={transactionCategory?.icon.name}
                  iconLeftColor={globalTheme.colors.primary}
                  logbookCurrency={logbooks.logbooks[0].logbook_currency}
                  secondaryCurrency={
                    appSettings.logbookSettings.secondaryCurrency
                  }
                  showSecondaryCurrency={
                    appSettings.logbookSettings.showSecondaryCurrency
                  }
                  transactionAmount={item.details.amount}
                  onPress={() => {}}
                />
              </TransactionListSection>
            </>
          );
        }}
      />
      <TextPrimary
        label="Preview"
        style={{
          alignSelf: "center",
          paddingBottom: 16,
        }}
      />
    </>
  );
};

export default DailySummaryExample;
