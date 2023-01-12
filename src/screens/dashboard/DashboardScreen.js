import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CoinsImg from "../../../src/assets/img/coins.png";
import { ImgButton } from "../../components/Button";
import { CustomBarChart } from "../../components/charts/CustomBarChart";
import Loading from "../../components/Loading";
import { MyBudgetsPreview } from "../../components/MyBudgetsPreview";
import RecentTransactions from "../../components/RecentTransactions";
import { TextPrimary, TextSecondary } from "../../components/Text";
import TotalExpenseWidget from "../../components/TotalExpenseWidget";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });
  const [date, setDate] = useState();
  const [graph, setGraph] = useState({
    status: "empty",
    rangeDay: 7,
    graphData: {
      mainGraph: [],
      shadowGraph: [],
      limitLine: [],
    },
  });
  const [screenLoading, setScreenLoading] = useState(false);

  const cardHeight = 200 - 16; // 200 is the height of card in the carousel
  const checkmark = require("../../../src/assets/img/checkmark.png");
  const isFocus = useIsFocused();

  const findTransactions = useMemo(() => {
    return () => {
      // console.log("findTransactions");
      utils.FindTransactionsToPlot({
        expenseOnly: true,
        appSettings: appSettings,
        groupSorted: sortedTransactions.groupSorted,
        logbooks: logbooks,
        categories: categories,
        budgets: budgets,
        graph: graph,
        activeBudget: activeBudget,
        setGraph: (item) => setGraph(item),
        setActiveBudget: (item) => setActiveBudget(item),
      });
    };
    // }, [sortedTransactions, budgets, graph, activeBudget]);
  }, [sortedTransactions, budgets, graph, activeBudget]);

  useEffect(() => {
    // in epoch time
    findTransactions();
    setDate(Date.now());
  }, []);

  useEffect(() => {
    if (isFocus) {
      setScreenLoading(true);
    }
  }, [isFocus]);

  useEffect(() => {
    if (screenLoading) {
      setTimeout(() => {
        findTransactions();
        setDate(Date.now());
        setScreenLoading(false);
      }, 1);
    }
  }, [screenLoading]);

  useEffect(() => {
    // console.log("graph", graph);
  }, [graph]);

  useEffect(() => {
    // console.log("activeBudget", activeBudget);
  }, [activeBudget]);

  // convert epoch number in date
  const getHours = new Date(date).getHours();
  // console.log(getHours)

  return (
    <>
      {/* Loading */}
      {screenLoading && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      )}
      {/* <StatusBar style="light" /> */}
      {!screenLoading && (
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
              right: 0,
              width: "100%",
              height: "25%",
              backgroundColor: appSettings.theme.style.colors.header,
              // borderBottomRightRadius: 16,
              // borderBottomLeftRadius: 16,
            }}
          />

          {/* // SECTION : Header Section */}
          <View
            style={{
              // backgroundColor: appSettings.theme.style.colors.header,
              flexDirection: "column",
              padding: 16,
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
              {userAccount?.displayName && (
                <TextPrimary
                  label={userAccount?.displayName}
                  style={{
                    fontWeight: "bold",
                    fontSize: 36,
                    color: appSettings.theme.style.colors.textHeader,
                  }}
                />
              )}
              {userAccount?.premium && (
                <Image
                  source={checkmark}
                  style={{
                    tintColor: appSettings.theme.style.colors.textHeader,
                    width: 20,
                    height: 20,
                    marginLeft: 4,
                  }}
                />
              )}
            </View>
          </View>

          {appSettings.dashboardSettings.showTotalExpenseWidget && (
            <TotalExpenseWidget
              graph={graph}
              activeBudget={activeBudget}
              cardHeight={cardHeight}
              onPress={() => navigation.navigate(screenList.analyticsScreen)}
            />
          )}

          {/* <Chart /> */}

          {/* <ScrollView
            style={{
              flex: 1,
              // paddingTop: 16,
              flexDirection: "column",
            }}
          > */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 32,
              paddingHorizontal: 16,
            }}
          >
            {/* // TAG : My Logbooks Widget */}
            {appSettings.dashboardSettings.showMyLogbooksWidget && (
              <ImgButton
                label="My Logbooks"
                textColor={appSettings.theme.style.colors.black}
                iconName="book"
                iconColor="#48ADFF"
                iconPack="IonIcons"
                boxColor="#90CEFF"
                boxHeight={150}
                boxWidth={screenWidth / 2 - 24}
                onPress={() => navigation.navigate(screenList.myLogbooksScreen)}
              />
            )}
            {/* // TAG : My Budgets Widget */}
            {appSettings.dashboardSettings.showMyBudgetsWidget && (
              <MyBudgetsPreview
                isFocused={isFocus}
                boxWidth={screenWidth / 2 - 24}
                onPress={() => navigation.navigate(screenList.myBudgetsScreen)}
              />
            )}
          </View>
          {/* // TAG : Recent Transactions */}
          {appSettings.dashboardSettings.showRecentTransactions && (
            <RecentTransactions
              onPress={({ transaction, selectedLogbook }) => {
                navigation.navigate(screenList.transactionPreviewScreen, {
                  transaction: transaction,
                  selectedLogbook: selectedLogbook,
                });
              }}
            />
          )}
          {/* </ScrollView> */}
        </View>
      )}
    </>
  );
};

export default DashboardScreen;
