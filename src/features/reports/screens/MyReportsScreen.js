import { View, Text } from "react-native";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import IncomeExpenseDeviation from "../components/IncomeExpenseDeviation";
import IonIcons from "react-native-vector-icons/Ionicons";
import DateRange from "../components/DateRange";
import { useState } from "react";
import * as utils from "../../../utils";
import ReportSection from "../components/ReportSection";
import reportSectionPropsModel from "../model/reportSectionPropsModel";

const MyReportsScreen = ({ route, navigation }) => {
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { budgets } = useGlobalBudgets();
  const [startViewDate, setStartViewDate] = useState(() => {
    const dateAtMidnight = new Date().setHours(0, 0, 0, 0);
    return utils.getFirstDateOfTheMonth(new Date(dateAtMidnight).getTime());
  });
  const [endViewDate, setEndViewDate] = useState(() => {
    const dateAtMidnight = new Date().setHours(23, 59, 59, 999);

    return utils.getLastDateOfTheMonth(new Date(dateAtMidnight).getTime());
  });
  return (
    <CustomScrollView nestedScrollEnabled>
      <ReportSection
        totalSectionLength={reportSectionPropsModel.totalSectionLength}
        sections={reportSectionPropsModel.sections}
      />
    </CustomScrollView>
  );
};

export default MyReportsScreen;
