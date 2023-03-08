import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { TextPrimary } from "../../../components/Text";
import ListSection from "../../../components/List/ListSection";
import * as utils from "../../../utils";
import DateRange from "./DateRange";
import IncomeExpenseDeviation from "./IncomeExpenseDeviation";

const ReportSection = ({ totalSectionLength, sections }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const screenWidth = Dimensions.get("window").width;
  const carouselRef = useRef();
  const [prevIndex, setPrevIndex] = useState(sections.length - 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

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
          <TextPrimary label={sections[prevIndex]?.title} />
        </TouchableOpacity>
        <TextPrimary
          label={sections[currentIndex]?.title}
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
          <TextPrimary label={sections[nextIndex]?.title} />
        </TouchableOpacity>
      </View>

      <Carousel
        loop
        scrollAnimationDuration={2000}
        style={{
          backgroundColor: globalTheme.colors.background,
          width: screenWidth,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
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
          const thisSection = sections[index];
          const prevIndex = index - 1 < 0 ? sections.length - 1 : index - 1;
          const nextIndex = index + 1 > sections.length - 1 ? 0 : index + 1;
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

                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: utils.hexToRgb({
                          hex: globalTheme.colors.listSection,
                          opacity: 0.07,
                        }),
                        borderRadius: 16,
                        padding: 16,
                        marginHorizontal: 8,
                      }}
                    >
                      <TextPrimary label={thisSection?.title} />
                      <TextPrimary label={thisSection?.data.totalIncome} />
                      <TextPrimary label={thisSection?.data.totalExpense} />
                    </View>
                  </View>
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
