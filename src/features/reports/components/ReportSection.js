import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { TextPrimary } from "../../../components/Text";
import ListSection from "../../../components/List/ListSection";
import * as utils from "../../../utils";
import DateRange from "./DateRange";
import IncomeExpenseDeviation from "./IncomeExpenseDeviation";
import CustomPieChart from "./CustomPieChart";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import TransactionListSection from "../../../components/List/TransactionListSection";
import { TransactionListItem } from "../../../components/List";
import IonIcons from "react-native-vector-icons/Ionicons";

const ReportSection = ({ sections }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const [prevIndex, setPrevIndex] = useState(sections.length - 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const screenWidth = Dimensions.get("window").width;
  const carouselRef = useRef();

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("currentIndex", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    console.log(
      JSON.stringify(
        {
          fromState: "useEffect",
          prevIndex,
          currentIndex,
          nextIndex,
        },
        null,
        2
      )
    );
  }, [currentIndex, prevIndex, nextIndex]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 0,
          alingItems: "center",
          width: "100%",
        }}
      >
        {/* // TAG : Prev Section */}
        <TouchableOpacity
          onPress={() => {
            carouselRef.current?.scrollTo({ index: prevIndex, animated: true });
          }}
          style={{
            minWidth: "25%",
            paddingVertical: 16,
            paddingRight: 16,
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <TextPrimary
            label={
              sections[
                carouselRef.current?.getCurrentIndex() - 1 < 0
                  ? sections.length - 1
                  : carouselRef.current?.getCurrentIndex() - 1 || prevIndex
              ]?.title
            }
          />
        </TouchableOpacity>
        <TextPrimary
          label={
            sections[carouselRef.current?.getCurrentIndex() || currentIndex]
              ?.title
          }
          style={{
            position: "absolute",
            top: "25%",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        />
        {/* // TAG : Next Section */}
        <TouchableOpacity
          onPress={() => {
            carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
          }}
          style={{
            minWidth: "25%",
            paddingVertical: 16,
            alignItems: "flex-end",
            paddingLeft: 16,
            zIndex: 1,
          }}
        >
          <TextPrimary
            label={
              sections[
                carouselRef.current?.getCurrentIndex() + 1 > sections.length - 1
                  ? 0
                  : carouselRef.current?.getCurrentIndex() + 1 || nextIndex
              ]?.title
            }
          />
        </TouchableOpacity>
      </View>

      <Carousel
        loop={false}
        defaultIndex={sections.length - 1}
        scrollAnimationDuration={2000}
        style={{
          backgroundColor: globalTheme.colors.background,
          width: screenWidth,
          alignItems: "center",
          justifyContent: "center",
          //   padding: 16,
          marginBottom: 16,
        }}
        ref={carouselRef}
        width={screenWidth - 16}
        data={sections.map((item, index) => index)}
        key={(index) => index}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          const thisCurrentIndex = Number(absoluteProgress.toFixed(0));

          const thisNextIndex = thisCurrentIndex + 1;
          const thisPrevIndex = thisCurrentIndex - 1;
          const isCurrentIndexDifferent = currentIndex !== thisCurrentIndex;
          const isNextIndexDifferent = nextIndex !== thisNextIndex;
          const isPrevIndexDifferent = prevIndex !== thisPrevIndex;
          let currentIndexToSet = currentIndex;
          let nextIndexToSet = nextIndex;
          let prevIndexToSet = prevIndex;
          if (isCurrentIndexDifferent) {
            switch (true) {
              case thisCurrentIndex < 0:
                currentIndexToSet = 0;
                break;
              case thisCurrentIndex > sections.length - 1:
                currentIndexToSet = 0;
                break;

              default:
                currentIndexToSet = thisCurrentIndex;
                break;
            }
          }
          if (isNextIndexDifferent) {
            switch (true) {
              case currentIndexToSet === 0:
                nextIndexToSet = 1;
                break;
              case thisNextIndex < 0:
                nextIndexToSet = sections.length - 1;
                break;
              case thisNextIndex > sections.length - 1:
                nextIndexToSet = 0;
                break;

              default:
                nextIndexToSet = thisNextIndex;
                break;
            }
          }
          if (isPrevIndexDifferent) {
            switch (true) {
              case thisPrevIndex < 0:
                prevIndexToSet = sections.length - 1;
                break;
              case thisPrevIndex > sections.length - 1:
                prevIndexToSet = 0;
                break;

              default:
                prevIndexToSet = thisPrevIndex;
                break;
            }
          }

          setCurrentIndex(currentIndexToSet);
          setPrevIndex(prevIndexToSet);
          setNextIndex(nextIndexToSet);
        }}
        renderItem={({ index }) => {
          const carouselIndex = index;
          const thisSection = sections[carouselIndex];
          const prevIndex =
            carouselIndex - 1 < 0 ? sections.length - 1 : carouselIndex - 1;
          const nextIndex =
            carouselIndex + 1 > sections.length - 1 ? 0 : carouselIndex + 1;
          const nextSection = sections[nextIndex];
          const prevSection = sections[prevIndex];
          return (
            <>
              {!!sections.length && (
                <>
                  <View
                    style={{
                      marginHorizontal: 8,
                      alignItems: "center",
                    }}
                  >
                    <DateRange
                      startDateInMillis={thisSection.startDateInMillis}
                      endDateInMillis={thisSection.endDateInMillis}
                    />
                    <IncomeExpenseDeviation
                      totalIncome={thisSection.data.totalIncome}
                      totalExpense={thisSection.data.totalExpense}
                    />
                  </View>
                  <CustomScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      backgroundColor: "transparent",
                    }}
                  >
                    {/* // TAG : Income chart */}
                    <TextPrimary
                      label="Income"
                      style={{
                        fontWeight: "bold",
                        paddingTop: 16,
                      }}
                    />
                    <CustomPieChart
                      mode="income"
                      data={sections[carouselIndex]?.data?.incomeGraph}
                      showDownLine={true}
                    />
                    <FlatList
                      data={thisSection?.data?.incomeCategoryList}
                      nestedScrollEnabled={true}
                      keyExtractor={(item) => item?.category.id}
                      contentContainerStyle={{
                        // flex: 0,
                        // height: "100%",
                        paddingBottom: 16,
                        // paddingHorizontal: 16,
                        alignItems: "center",
                      }}
                      style={{
                        width: "100%",
                      }}
                      ListFooterComponent={() => {
                        return (
                          <>
                            <View
                              style={{
                                backgroundColor: "transparent",
                                width: "100%",
                                height: 72,
                                alignItems: "center",
                                justifyContent: "center",
                                // padding: 16,
                              }}
                            >
                              <IonIcons
                                name="chevron-down"
                                size={64}
                                color={utils.hexToRgb({
                                  hex: globalTheme.colors.listSection,
                                  opacity: 1,
                                })}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                }}
                              />

                              <View
                                style={{
                                  position: "absolute",
                                  // minWidth: "100%",
                                  top: 0,
                                  height: 100,
                                  width: 8,
                                  backgroundColor: utils.hexToRgb({
                                    hex: globalTheme.colors.listSection,
                                    opacity: 0.07,
                                  }),
                                }}
                              />
                            </View>
                          </>
                        );
                      }}
                      renderItem={({ item, index }) => {
                        const flatListIndex = index;
                        const { category, totalAmount } = item;
                        const isFirstItem = flatListIndex === 0;
                        const isLastItem =
                          flatListIndex ===
                          thisSection.data.incomeCategoryList.length - 1;
                        return (
                          <>
                            <TransactionListSection
                              noMargin={true}
                              isFirstItem={isFirstItem}
                              isLastItem={isLastItem}
                            >
                              {!!sections[carouselIndex]?.data
                                ?.expenseCategoryList.length && (
                                <TransactionListItem
                                  onPress={() => {}}
                                  categoryName={utils.upperCaseThisFirstLetter(
                                    category.name
                                  )}
                                  rightLabel={utils.getFormattedNumber({
                                    value: totalAmount,
                                    currencyIsoCode:
                                      appSettings.logbookSettings
                                        .defaultCurrency.isoCode,
                                    negativeSymbol:
                                      appSettings.logbookSettings
                                        .negativeCurrencySymbol,
                                  })}
                                  iconLeftColor={
                                    category.icon.color === "default"
                                      ? globalTheme.colors.primary
                                      : category.icon.color
                                  }
                                  iconLeftName={category.icon.name}
                                  logbookCurrency={
                                    appSettings.logbookSettings.defaultCurrency
                                  }
                                  transactionAmount={totalAmount}
                                />
                              )}
                            </TransactionListSection>
                          </>
                        );
                      }}
                    />

                    {/* // TAG : Expense chart */}
                    <TextPrimary
                      label="Expense"
                      style={{
                        fontWeight: "bold",
                      }}
                    />
                    <CustomPieChart
                      mode="expense"
                      data={sections[carouselIndex]?.data?.expenseGraph}
                      showUpLine={true}
                      showDownLine={
                        !!sections[carouselIndex]?.data?.expenseGraph.length
                          ? true
                          : false
                      }
                    />
                    <FlatList
                      data={thisSection?.data?.expenseCategoryList}
                      nestedScrollEnabled={true}
                      keyExtractor={(item) => item?.category.id}
                      contentContainerStyle={{
                        // height: "100%",
                        paddingBottom: 16,
                        // paddingHorizontal: 16,
                        alignItems: "center",
                        // backgroundColor: "red",
                      }}
                      style={{
                        width: "100%",
                      }}
                      ListFooterComponent={() => {
                        return (
                          <>
                            <View
                              style={{
                                backgroundColor: "red",
                                width: "100%",
                                height: 64,
                                alignItems: "center",
                                justifyContent: "center",
                                // padding: 16,
                              }}
                            />
                          </>
                        );
                      }}
                      renderItem={({ item, index }) => {
                        const flatListIndex = index;
                        const { category, totalAmount } = item;
                        const isFirstItem = flatListIndex === 0;
                        const isLastItem =
                          flatListIndex ===
                          thisSection.data.expenseCategoryList.length - 1;
                        return (
                          <>
                            <TransactionListSection
                              isFirstItem={isFirstItem}
                              isLastItem={isLastItem}
                            >
                              {!!sections[carouselIndex]?.data
                                ?.expenseCategoryList.length && (
                                <TransactionListItem
                                  onPress={() => {}}
                                  categoryName={utils.upperCaseThisFirstLetter(
                                    category.name
                                  )}
                                  rightLabel={utils.getFormattedNumber({
                                    value: totalAmount,
                                    currencyIsoCode:
                                      appSettings.logbookSettings
                                        .defaultCurrency.isoCode,
                                    negativeSymbol:
                                      appSettings.logbookSettings
                                        .negativeCurrencySymbol,
                                  })}
                                  iconLeftColor={
                                    category.icon.color === "default"
                                      ? globalTheme.colors.primary
                                      : category.icon.color
                                  }
                                  iconLeftName={category.icon.name}
                                  logbookCurrency={
                                    appSettings.logbookSettings.defaultCurrency
                                  }
                                  transactionAmount={totalAmount}
                                />
                              )}
                            </TransactionListSection>
                          </>
                        );
                      }}
                    />
                  </CustomScrollView>
                </>
              )}
            </>
          );
        }}
      />
    </>
  );
};

export default ReportSection;
