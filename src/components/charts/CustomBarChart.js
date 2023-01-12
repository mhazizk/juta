import { View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory-native";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import * as utils from "../../utils";
// import {get} from 'date-fns'

export const CustomBarChart = ({
  //   Graph Data
  mainGraph,
  shadowGraph,
  limitLine,
  rangeDay,
  //   Graph Size
  width,
  height,
  //   Color
  showAxisLabels,
  primaryColor,
  successColor,
  overBudgetBarColor,
  warnBudgetBarColor,
  shadowBarColor,
  textColor,
  barWidth,
  barRadius,
  style,
  symbol,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const maxAmount = () => {
    const max = (shadowGraph[0].y / 1000).toFixed(0);
    switch (true) {
      case max < 1:
        return `${shadowGraph[0].y}`;
      case 1 <= max < 1000:
        return `${max} k`;
      case max >= 1000:
        return `${(max / 1000).toFixed(1)} M`;
      default:
        return `${max}`;
    }
  };

  const chartConfig = {
    // backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    fillShadowGradientFrom: "#ff0000",
    fillShadowGradientTo: "#fff000",
    color: (opacity = 1) =>
      utils.HexToRgb({ hex: successColor, opacity: opacity }),
    labelColor: (opacity = 1) =>
      utils.HexToRgb({ hex: successColor, opacity: opacity }),
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };
  return (
    <>
      {mainGraph.length && shadowGraph.length && (
        <View
          View
          style={{
            backgroundColor: "transparent",
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <VictoryGroup
            // padding={{ top: 0, bottom: 48, left: 80, right: 22 }}
            padding={{
              top: 0,
              bottom: showAxisLabels ? 36 : 0,
              left: showAxisLabels ? 46 : 40,
              right: showAxisLabels ? 0 : 40,
            }}
            height={height || 200}
            width={width || 200}
            domainPadding={{ x: [maxAmount().length * 8, 30] }}
            // domainPadding={{ x: [56, 30] }}
            maxDomain={{ y: shadowGraph[0].y }}
            // animate={{ duration: 1000 }}
          >
            {/* Shadow Graph */}
            {showAxisLabels && (
              <VictoryBar
                fixLabelOverlap={true}
                //   labels={({ datum }) => datum.x}
                //   labelComponent={<VictoryLabel dy={24} />}
                alignment="middle"
                height={height}
                //   domainPadding={{ x: 10, y: 100 }}
                barWidth={barWidth}
                cornerRadius={{ top: barWidth / 4, bottom: barWidth / 4 }}
                style={{
                  data: {
                    fill: rangeDay === 7 ? shadowBarColor : "transparent",
                  },
                }}
                data={shadowGraph}
              />
            )}
            {/* Main Graph */}
            <VictoryBar
              data={mainGraph}
              fixLabelOverlap={true}
              alignment="middle"
              barWidth={barWidth}
              cornerRadius={{ top: barWidth / 4, bottom: barWidth / 4 }}
              labels={({ datum }) => {
                if (showAxisLabels) {
                  switch (rangeDay) {
                    case 7:
                      return new Date(datum.epochDate)
                        .toDateString()
                        .slice(0, 3);
                    // return datum.x;
                    case 30:
                      return [
                        new Date(datum.epochDate).getDate(),
                        new Date(datum.epochDate).toDateString().slice(4, 7),
                        // new Date(datum.epochDate).toDateString().split(" ")[0],
                        // new Date(datum.epochDate).toLocaleDateString(
                        //   appSettings.locale,
                        //   { month: "short" }
                        // ),
                      ];
                    case 365:
                      return [
                        new Date(datum.x).toDateString().slice(4, 7),
                        datum.year,
                      ];
                    // return [datum.x, datum.year];

                    default:
                      return datum.x;
                  }
                }
              }}
              style={{
                data: {
                  fill: ({ datum }) => {
                    if (showAxisLabels) {
                      if (limitLine) {
                        switch (true) {
                          case datum.y / limitLine[0].y < 0.8:
                            return successColor;
                          case datum.y / limitLine[0].y >= 0.8 &&
                            datum.y / limitLine[0].y < 1:
                            return warnBudgetBarColor;
                          case datum.y / limitLine[0].y >= 1:
                            return overBudgetBarColor;
                          default:
                            return primaryColor;
                        }
                      } else {
                        return primaryColor;
                      }
                    } else {
                      return primaryColor;
                    }
                  },
                },
              }}
              labelComponent={
                <VictoryLabel
                  y={rangeDay === 7 ? height : height - 24}
                  textAnchor={({ datum }) => {
                    switch (true) {
                      case rangeDay === 7:
                        return "middle";
                      case rangeDay === 30:
                        return datum.x === 1 ? "start" : "middle";
                      case rangeDay === 365:
                        return datum.x === 1 ? "start" : "middle";
                      default:
                        return "middle";
                    }
                  }}
                  verticalAnchor={rangeDay === 7 ? "end" : "start"}
                  style={{
                    fill: ({ datum }) => {
                      let epoch364Days;
                      let epoch180Days;
                      let epoch29Days;
                      let epoch15Days;
                      let epochNow;
                      let now;
                      let midMonth;
                      let lastMonth;
                      let midYear;
                      let lastYear;
                      let datumNow;
                      // let datumMidMonth;
                      // let datumLastMonth;
                      // let datumMidYear;
                      // let datumLastYear;

                      if (rangeDay === 365) {
                        datumNow = datum.month;
                        now = new Date().getMonth();
                        midYear = now - 6;
                        lastYear = now - 11;
                      }

                      if (rangeDay === 7 || rangeDay === 30) {
                        // Epoch
                        epoch364Days = 1000 * 60 * 60 * 24 * 364;
                        epoch180Days = 1000 * 60 * 60 * 24 * 180;
                        epoch29Days = 1000 * 60 * 60 * 24 * 29;
                        epoch15Days = 1000 * 60 * 60 * 24 * 15;

                        epochNow = Date.now();

                        // Month
                        now = new Date().toDateString();
                        midMonth = new Date(
                          epochNow - epoch15Days
                        ).toDateString();
                        lastMonth = new Date(
                          epochNow - epoch29Days
                        ).toDateString();
                        // Year
                        midYear = new Date(
                          epochNow - epoch180Days
                        ).toDateString();
                        lastYear = new Date(
                          epochNow - epoch364Days
                        ).toDateString();

                        // Datum
                        datumNow = new Date(datum.epochDate).toDateString();
                      }

                      switch (true) {
                        case rangeDay === 7:
                          return datumNow === now ? primaryColor : textColor;
                        case rangeDay === 30:
                          return datumNow === now
                            ? primaryColor
                            : datumNow === midMonth || datumNow === lastMonth
                            ? textColor
                            : "transparent";
                        case rangeDay === 365:
                          return datumNow === now
                            ? primaryColor
                            : datumNow === midYear || datumNow === lastYear
                            ? textColor
                            : "transparent";
                        default:
                          return "transparent";
                      }
                    },
                  }}
                />
              }
            />

            {/* Limit Line */}
            {limitLine && showAxisLabels && (
              <VictoryLine
                // animate={{ duration: 1000 }}
                standalone={true}
                data={limitLine}
                height={height}
                width={width}
                domainPadding={{ x: -32 }}
                maxDomain={{
                  y:
                    shadowGraph[0].y > limitLine[0].y
                      ? shadowGraph[0].y
                      : limitLine[0].y,
                }}
                style={{
                  data: {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 3,
                    // stroke: utils.HexToRgb({ hex: textColor, opacity: 0.5 }),
                    stroke: utils.HexToRgb({
                      hex: appSettings.theme.style.colors.foreground,
                      opacity: 1,
                    }),
                    strokeDasharray: "1, 8",
                    // strokeDasharray: 16,
                    // strokeDashoffset: -10,
                    //   borderRadius: 8,
                  },
                }}
              />
            )}

            {showAxisLabels && (
              <VictoryGroup
                domainPadding={{ x: 0 }}
                // animate={{ duration: 1000 }}
              >
                {/* Bottom Amount */}
                <VictoryLabel
                  datum={{ x: 0.3, y: 0 }}
                  verticalAnchor="end"
                  textAnchor="end"
                  text={`0`}
                  //   backgroundPadding={{ right: 8 }}
                  style={{ fill: textColor, fontSize: 14, textAlign: "right" }}
                />

                {/* Max Amount */}
                <VictoryLabel
                  datum={{
                    x: 0.3,
                    y: limitLine
                      ? limitLine[0].y > shadowGraph[0].y
                        ? limitLine[0].y
                        : shadowGraph[0].y
                      : shadowGraph[0].y,
                  }}
                  verticalAnchor="start"
                  textAnchor="end"
                  text={maxAmount()}
                  //   backgroundPadding={{ right: 0 }}
                  style={{ fill: textColor, fontSize: 14, textAlign: "right" }}
                />

                {/* Limit Amount */}
                {limitLine && (
                  <VictoryLabel
                    datum={{ x: 0.3, y: limitLine[0].y }}
                    textAnchor="end"
                    text={`${(limitLine[0].y / 1000).toFixed(0)} k`}
                    // backgroundPadding={{ right: 0 }}
                    style={{
                      fill: primaryColor,
                      fontSize: 14,
                      textAlign: "right",
                    }}
                  />
                )}
              </VictoryGroup>
            )}
          </VictoryGroup>
        </View>
      )}
    </>
  );
};