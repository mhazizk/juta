import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { useEffect, useState } from "react";
import * as utils from "../../../utils";
import ReportSection from "../components/ReportSection";
import Loading from "../../../components/Loading";
import getReportSectionProps from "../model/getReportSectionProps";

const MyReportsScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sections.length) {
      const newSections = getReportSectionProps("monthly");
      getTransactionListAndGraphData(newSections);
    }
  }, []);

  useEffect(() => {
    if (sections?.length > 0) {
      setIsLoading(false);
    }
  }, [sections]);

  const getTransactionListAndGraphData = (sections) => {
    if (sections.length > 0) {
      const newSections = [];
      sections.forEach((section) => {
        const newData = {
          ...section.data,
        };
        utils.getTopCategoryListInRange({
          appSettings,
          globalCurrencyRates,
          logbooks: logbooks.logbooks,
          categories: categories.categories,
          groupSorted: sortedTransactions.groupSorted,
          transactionTypeToGet: "all",
          startDateInMillis: section.startDateInMillis,
          endDateInMillis: section.endDateInMillis,
          callback: ({
            allCategoryList,
            expenseCategoryList,
            incomeCategoryList,
          }) => {
            const totalIncome = incomeCategoryList.reduce((total, category) => {
              return total + category.totalAmount;
            }, 0);
            const totalExpense = expenseCategoryList.reduce(
              (total, category) => {
                return total + category.totalAmount;
              },
              0
            );

            newData.expenseCategoryList = expenseCategoryList;
            newData.incomeCategoryList = incomeCategoryList;
            newData.totalIncome = totalIncome;
            newData.totalExpense = totalExpense;
            newData.incomeGraph = incomeCategoryList.map((item) => {
              return {
                x: item.category.name,
                y: item.totalAmount,
                iconPack: item.category.icon.pack,
                iconName: item.category.icon.name,
                categoryName: item.category.name,
              };
            });
            newData.expenseGraph = expenseCategoryList.map((item) => {
              return {
                x: item.category.name,
                y: item.totalAmount,
                iconPack: item.category.icon.pack,
                iconName: item.category.icon.name,
                categoryName: item.category.name,
              };
            });
          },
        });
        newSections.push({
          ...section,
          data: newData,
        });
      });
      return setSections(newSections);
    }
  };

  return (
    <CustomScrollView
      nestedScrollEnabled
      contentContainerStyle={{
        justifyContent: isLoading ? "center" : "flex-start",
      }}
    >
      {!isLoading && <ReportSection sections={sections} />}
      {isLoading && <Loading />}
    </CustomScrollView>
  );
};

export default MyReportsScreen;
