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
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import Loading from "../../../components/Loading";

const ReportSection = ({ sections, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const [isLoading, setIsLoading] = useState(true);
  // const [prevIndex, setPrevIndex] = useState(sections.length - 1);
  // const [currentIndex, setCurrentIndex] = useState(new Date().getMonth());
  // const [nextIndex, setNextIndex] = useState(1);
  const screenWidth = Dimensions.get("window").width;
  const carouselRef = useRef();
  const titleBarRef = useRef();

  const x = useSharedValue(0);
  const isSkip = useSharedValue(false);

  const animatedSideTitleStyle = useAnimatedStyle(() => {
    // const adjustedX = x.value > screenWidth / 4 ? screenWidth / 4 : x.value;
    // const opacityValue = x.value !== 0 ? 0 : 1;]
    const fixedValue = Number(x.value.toFixed(1));
    const isInteger = Number.isInteger(fixedValue);
    console.log("digitAfterDecimal", isInteger, fixedValue);
    const opacityValue = isInteger && !isSkip.value ? 1 : 0;
    return {
      // transform: [{ translateX: withSpring(adjustedX) }],
      opacity: withSpring(1),
    };
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);
  useEffect(() => {}, [isLoading]);

  // useEffect(() => {
  //   // console.log("currentIndex", currentIndex);
  // }, [currentIndex]);

  // useEffect(() => {
  //   console.log(
  //     JSON.stringify(
  //       {
  //         fromState: "useEffect",
  //         prevIndex,
  //         currentIndex,
  //         nextIndex,
  //       },
  //       null,
  //       2
  //     )
  //   );
  // }, [currentIndex]);

  return (
    <>
      {/* // TAG : TitleBar */}
      {isLoading && (
        <CustomScrollView
          contentContainerStyle={{
            justifyContent: "center",
          }}
        >
          <Loading />
        </CustomScrollView>
      )}

      {!isLoading && (
        <Carousel
          loop={false}
          windowSize={3}
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
          onScrollBegin={(index) => {
            // x.value = 1;
          }}
          onSnapToItem={(index) => {
            x.value = index;
          }}
          onScrollEnd={(index) => {
            // console.log("onScrollEnd", index);
            // x.value = 0;
          }}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
            // onActivated: (event) => {
            //   console.log("onActivated", event.nativeEvent.translationX);
            //   // x.value = event.nativeEvent.translationX;
            // },
            // onBegan: (event) => {
            //   x.value = 1.5;
            // },
            // onEnded: (event) => {
            //   console.log("onEnded", event.nativeEvent.translationX);
            //   // x.value = 0;
            // },
            // onCancelled: (event) => {
            //   console.log("onCancelled");
            //   // x.value = 0;
            // },
            // onFailed: (event) => {
            //   console.log("onFailed");
            //   x.value = 1;
            // },
          }}
          ref={carouselRef}
          width={screenWidth - 16}
          data={sections.map((item, index) => index)}
          key={(index) => index}
          onProgressChange={(offsetProgress, absoluteProgress) => {
            // const thisCurrentIndex = Number(absoluteProgress.toFixed(0));
            // if (isSkip.value) x.value = absoluteProgress;
            // const thisNextIndex = thisCurrentIndex + 1;
            // const thisPrevIndex = thisCurrentIndex - 1;
            // const isCurrentIndexDifferent = currentIndex !== thisCurrentIndex;
            // const isNextIndexDifferent = nextIndex !== thisNextIndex;
            // const isPrevIndexDifferent = prevIndex !== thisPrevIndex;
            // let currentIndexToSet = currentIndex;
            // let nextIndexToSet = nextIndex;
            // let prevIndexToSet = prevIndex;
            // if (isCurrentIndexDifferent) {
            //   switch (true) {
            //     case thisCurrentIndex < 0:
            //       currentIndexToSet = 0;
            //       break;
            //     case thisCurrentIndex > sections.length - 1:
            //       currentIndexToSet = 0;
            //       break;
            //     default:
            //       currentIndexToSet = thisCurrentIndex;
            //       break;
            //   }
            // }
            // if (isNextIndexDifferent) {
            //   switch (true) {
            //     case currentIndexToSet === 0:
            //       nextIndexToSet = 1;
            //       break;
            //     case thisNextIndex < 0:
            //       nextIndexToSet = sections.length - 1;
            //       break;
            //     case thisNextIndex > sections.length - 1:
            //       nextIndexToSet = 0;
            //       break;
            //     default:
            //       nextIndexToSet = thisNextIndex;
            //       break;
            //   }
            // }
            // if (isPrevIndexDifferent) {
            //   switch (true) {
            //     case thisPrevIndex < 0:
            //       prevIndexToSet = sections.length - 1;
            //       break;
            //     case thisPrevIndex > sections.length - 1:
            //       prevIndexToSet = 0;
            //       break;
            //     default:
            //       prevIndexToSet = thisPrevIndex;
            //       break;
            //   }
            // }
            // setCurrentIndex(currentIndexToSet);
            // setPrevIndex(prevIndexToSet);
            // setNextIndex(nextIndexToSet);
          }}
          renderItem={({ index }) => {
            const carouselIndex = index;
            const thisSection = sections[carouselIndex];
            // const prevIndex =
            //   carouselIndex - 1 < 0 ? sections.length - 1 : carouselIndex - 1;
            const prevIndex = carouselIndex - 1;
            const nextIndex = carouselIndex + 1;
            // const nextIndex =
            //   carouselIndex + 1 > sections.length - 1 ? 0 : carouselIndex + 1;
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
                      {/* // TAG : TitleBar */}
                      <View
                        ref={titleBarRef}
                        style={[
                          {
                            paddingHorizontal: 8,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 0,
                            alingItems: "center",
                            width: "100%",
                            zIndex: 2,
                          },
                          // animatedTitleStyle,
                        ]}
                      >
                        {/* // TAG : Prev Section */}
                        <TouchableOpacity
                          onPress={() => {
                            x.value = 1.5;
                            carouselRef.current?.scrollTo({
                              index: prevIndex,
                              animated: true,
                            });
                          }}
                          style={{
                            display: prevIndex < 0 ? "none" : "flex",
                            minWidth: "25%",
                            paddingVertical: 16,
                            paddingRight: 16,
                            alignItems: "flex-start",
                            zIndex: 2,
                          }}
                        >
                          <Animated.View style={animatedSideTitleStyle}>
                            <TextPrimary
                              label={
                                sections[
                                  carouselIndex - 1 < 0
                                    ? sections.length - 1
                                    : carouselIndex - 1 || prevIndex
                                ]?.title
                              }
                            />
                          </Animated.View>
                        </TouchableOpacity>
                        <Animated.View
                          style={[
                            {
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            },
                            // animatedMainTitleStyle,
                          ]}
                        >
                          <TextPrimary
                            label={sections[carouselIndex]?.title}
                            style={{
                              textAlign: "center",
                              fontSize: 20,
                              fontWeight: "bold",
                            }}
                          />
                        </Animated.View>

                        {/* // TAG : Next Section */}
                        <TouchableOpacity
                          onPress={() => {
                            x.value = 1.5;

                            carouselRef.current?.scrollTo({
                              index: nextIndex,
                              animated: true,
                            });
                          }}
                          style={{
                            display:
                              nextIndex > sections.length - 1 ? "none" : "flex",
                            minWidth: "25%",
                            paddingVertical: 16,
                            alignItems: "flex-end",
                            paddingLeft: 16,
                            zIndex: 2,
                          }}
                        >
                          <Animated.View style={animatedSideTitleStyle}>
                            <TextPrimary
                              label={
                                sections[
                                  carouselIndex + 1 > sections.length - 1
                                    ? 0
                                    : carouselIndex + 1 || nextIndex
                                ]?.title
                              }
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </View>

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
                                {!!thisSection?.data?.expenseCategoryList
                                  .length && (
                                  <TransactionListItem
                                    onPress={() =>
                                      onPress({
                                        category:
                                          thisSection?.data.incomeCategoryList[
                                            flatListIndex
                                          ].category,
                                        startDateInMillis:
                                          thisSection?.startDateInMillis,
                                        endDateInMillis:
                                          thisSection?.endDateInMillis,
                                      })
                                    }
                                    categoryName={utils.upperCaseThisFirstLetter(
                                      category.name
                                    )}
                                    rightLabel={utils.getFormattedNumber({
                                      value: totalAmount,
                                      currencyCountryName:
                                        appSettings.logbookSettings
                                          .defaultCurrency.name,
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
                                      appSettings.logbookSettings
                                        .defaultCurrency
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
                                  height: 16,
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
                                {!!thisSection?.data?.expenseCategoryList
                                  .length && (
                                  <TransactionListItem
                                    onPress={() =>
                                      onPress({
                                        category:
                                          thisSection?.data.expenseCategoryList[
                                            flatListIndex
                                          ].category,
                                        startDateInMillis:
                                          thisSection?.startDateInMillis,
                                        endDateInMillis:
                                          thisSection?.endDateInMillis,
                                      })
                                    }
                                    categoryName={utils.upperCaseThisFirstLetter(
                                      category.name
                                    )}
                                    rightLabel={utils.getFormattedNumber({
                                      value: totalAmount,
                                      currencyCountryName:
                                        appSettings.logbookSettings
                                          .defaultCurrency.name,
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
                                      appSettings.logbookSettings
                                        .defaultCurrency
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
      )}
    </>
  );
};

export default ReportSection;
