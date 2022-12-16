import { useEffect, useState } from "react";
import {
  Text,
  TouchableNativeFeedback,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import Chart from "../../../components/Chart";
import ChartTab from "../../../components/ChartTab";
import { TransactionListItem } from "../../../components/List";
import { TextPrimary } from "../../../components/Text";
import TopExpenses from "../../../components/TopExpenses";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../../modules/GlobalContext";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";
import ExpenseChartPreview from "../../../components/ExpenseChartPreview";
import IncomeChartPreview from "../../../components/IncomeChartPreview";
import RecentTransactions from "../search/RecentTransactions";

const DashboardScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [date, setDate] = useState();

  const checkmark = require("../../../assets/img/checkmark.png");

  useEffect(() => {
    // in epoch time
    setDate(Date.now());
  }, []);

  // convert epoch number in date
  const getHours = new Date(date).getHours();
  // console.log(getHours)

  return (
    <>
      {/* <StatusBar style="light" /> */}
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* Bleeding Header Color */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "20%",
            backgroundColor: appSettings.theme.style.colors.header,
            borderBottomRightRadius: 500,
          }}
        />

        {/* //! Header Section */}
        <View
          style={{
            // backgroundColor: appSettings.theme.style.colors.header,
            flexDirection: "column",
            paddingHorizontal: 16,
          }}
        >
          <TextPrimary
            label={
              getHours <= 4
                ? "Good Night"
                : 4 < getHours && getHours <= 10
                ? "Good Morning"
                : 10 < getHours && getHours <= 15
                ? "Good Afternoon"
                : 15 < getHours && getHours <= 21
                ? "Good Evening"
                : 21 < getHours && getHours <= 24
                ? "Good Night"
                : "Good Day"
            }
            style={{ color: appSettings.theme.style.colors.textHeader }}
          />
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <TextPrimary
              label={userAccount?.profile?.nickname}
              style={{
                fontWeight: "bold",
                fontSize: 36,
                color: appSettings.theme.style.colors.textHeader,
              }}
            />
            <Image
              source={checkmark}
              style={{ width: 20, height: 20, marginLeft: 4 }}
            />
          </View>
        </View>

        {/* //! Carousel Section */}
        <View
          style={{
            paddingTop: 32,
            flexDirection: "column",
          }}
        >
          {/* <ChartTab /> */}
          <Carousel
            loop
            autoPlay
            scrollAnimationDuration={1500}
            width={Dimensions.get("window").width}
            height={200}
            data={["expense", "income"]}
            key={(index) => index}
            renderItem={({ index }) => (
              <>
                {/* Container */}
                <View
                  style={{
                    // backgroundColor: appSettings.theme.style.colors.background,
                    padding: 16,
                  }}
                >
                  {/* Card */}
                  <View
                    style={{
                      backgroundColor: appSettings.theme.style.colors.secondary,
                      padding: 16,
                      borderRadius: 16,
                      height: "100%",
                    }}
                  >
                    {/* <TextPrimary label={index === 0 ? "Expense" : "Income"} /> */}
                    {<ExpenseChartPreview />}
                    {/* {index === 1 && <IncomeChartPreview />} */}
                  </View>
                </View>
              </>
            )}
          />
        </View>
        {/* <Chart /> */}

        {/* //! Recent Transactions Section */}
        <View
          style={{
            flex: 1,
            paddingTop: 32,
            flexDirection: "column",
          }}
        >
          <RecentTransactions />
        </View>
      </View>
      {/* <TransactionListItem
              /> */}
    </>
  );
};

export default DashboardScreen;
