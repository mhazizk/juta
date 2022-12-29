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

  const cardHeight = 200;
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
    console.log("graph", graph);
  }, [graph]);

  useEffect(() => {
    console.log("activeBudget", activeBudget);
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

          {/* //! Header Section */}
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
              // paddingTop: 16,
              flexDirection: "column",
            }}
          >
            {/* <ChartTab /> */}
            <Carousel
              loop
              autoPlay
              autoPlayInterval={2000}
              scrollAnimationDuration={3000}
              width={screenWidth}
              height={cardHeight}
              data={["expense", "income"]}
              key={(index) => index}
              renderItem={({ index }) => (
                <>
                  {/* Container */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Analytics Screen")}
                    style={{
                      shadowColor: appSettings.theme.style.colors.foreground,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 16,
                      elevation: 5,
                    }}
                  >
                    <View
                      style={{
                        // backgroundColor: appSettings.theme.style.colors.background,
                        padding: 16,
                      }}
                    >
                      {/* Card */}
                      <View
                        style={{
                          backgroundColor:
                            // appSettings.theme.style.colors.secondary,
                            "#FFE088",
                          padding: 16,
                          borderRadius: 16,
                          height: "100%",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {graph.status !== "done" && (
                          <View
                            style={{
                              height: "100%",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            }}
                          >
                            <TextPrimary
                              style={{
                                zIndex: 1,
                                color: appSettings.theme.style.colors.black,
                                textAlign: "center",
                                textAlignVertical: "center",
                              }}
                              label={`Add transactions to see your ${
                                index === 0 ? "expenses" : "income"
                              } graph here`}
                            />
                          </View>
                        )}

                        {graph.status === "done" && (
                          <>
                            <View
                              style={{
                                height: "100%",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <TextSecondary
                                  label={appSettings.currency.symbol}
                                  style={{
                                    paddingRight: 4,
                                    color: appSettings.theme.style.colors.black,
                                  }}
                                />
                                <TextPrimary
                                  style={{
                                    fontSize: 32,
                                    fontWeight: "bold",
                                    color: appSettings.theme.style.colors.black,
                                  }}
                                  label={utils.FormatCurrency({
                                    amount: activeBudget.spent,
                                    currency: appSettings.currency.name,
                                  })}
                                />
                              </View>
                              <TextPrimary
                                style={{
                                  zIndex: 1,
                                  color: appSettings.theme.style.colors.black,
                                }}
                                label="Total Expense this week"
                              />
                            </View>

                            <View
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                zIndex: 0,
                              }}
                            >
                              <CustomBarChart
                                //   Graph Data
                                mainGraph={
                                  graph.status === "done"
                                    ? graph.graphData.mainGraph
                                    : null
                                }
                                shadowGraph={
                                  graph.status === "done"
                                    ? graph.graphData.shadowGraph
                                    : null
                                }
                                limitLine={
                                  graph.status === "done" &&
                                  graph.graphData.limitLine.length
                                    ? graph.graphData.limitLine
                                    : null
                                }
                                symbol={appSettings.currency.symbol}
                                rangeDay={graph.rangeDay}
                                //  Graph Style
                                successColor={
                                  appSettings.theme.style.colors.success
                                }
                                primaryColor={utils.HexToRgb({
                                  hex: appSettings.theme.style.colors.white,
                                  opacity: 0.1,
                                })}
                                overBudgetBarColor={
                                  appSettings.theme.style.colors.danger
                                }
                                warnBudgetBarColor={
                                  appSettings.theme.style.colors.warn
                                }
                                shadowBarColor={utils.HexToRgb({
                                  hex: appSettings.theme.style.colors.success,
                                  opacity: 0,
                                })}
                                width={Dimensions.get("window").width - 32}
                                height={cardHeight - 64}
                                textColor={
                                  appSettings.theme.style.text.textSecondary
                                    .color
                                }
                                barRadius={8}
                                barWidth={
                                  graph.rangeDay === 7
                                    ? 28
                                    : graph.rangeDay === 30
                                    ? 8
                                    : 16
                                }
                              />
                            </View>
                          </>
                        )}
                        {/* {index === 1 && <IncomeChartPreview />} */}
                        {graph.status !== "done" && (
                          <Image
                            source={CoinsImg}
                            style={{
                              position: "absolute",
                              // top: 0,
                              right: -50,
                              bottom: -50,
                              // left: 0,
                              zIndex: 0,
                              width: 250,
                              height: 250,
                              opacity: 0.5,
                              resizeMode: "contain",
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
          </View>
          {/* <Chart /> */}

          {/* //! Recent Transactions Section */}
          {/* <ScrollView
            style={{
              flex: 1,
              // paddingTop: 16,
              flexDirection: "column",
            }}
          > */}
          {/* My Budget */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 32,
              paddingHorizontal: 16,
            }}
          >
            <ImgButton
              label="My Logbooks"
              textColor={appSettings.theme.style.colors.black}
              iconName="book"
              iconColor="#48ADFF"
              iconPack="IonIcons"
              boxColor="#90CEFF"
              boxHeight={150}
              boxWidth={screenWidth / 2 - 24}
              onPress={() => navigation.navigate("My Logbooks Screen")}
            />
            <MyBudgetsPreview
              isFocused={isFocus}
              boxWidth={screenWidth / 2 - 24}
              onPress={() => navigation.navigate("My Budgets Screen")}
            />
          </View>
          {/* <MyBudget
            onPress={(item) => {
              navigation.navigate("Logbook Preview Screen", {
                logbook: item,
              });
            }}
          /> */}
          {/* <MyLogbooks
            onPress={(item) => {
              navigation.navigate("Logbook Preview Screen", {
                logbook: item,
              });
            }}
          /> */}
          <RecentTransactions
            onPress={({ transaction, selectedLogbook }) => {
              navigation.navigate("Transaction Preview Screen", {
                transaction: transaction,
                selectedLogbook: selectedLogbook,
              });
            }}
          />
          {/* </ScrollView> */}
        </View>
      )}
    </>
  );
};

export default DashboardScreen;
