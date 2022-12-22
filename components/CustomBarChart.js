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
import { useGlobalAppSettings } from "../modules/GlobalContext";
import { hexToRgb } from "../modules/HexToRGB";

export const CustomBarChart = ({
  //   Graph Data
  mainGraph,
  shadowGraph,
  limitLine,
  //   Graph Size
  width,
  height,
  //   Color
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
      case max < 1000:
        return `${max} k`;
      case max >= 1000:
        return `${(max / 1000).toFixed(1)} M`;
      default:
        return `${max} k`;
    }
  };

  const chartConfig = {
    // backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    fillShadowGradientFrom: "#ff0000",
    fillShadowGradientTo: "#fff000",
    color: (opacity = 1) => hexToRgb({ hex: successColor, opacity: opacity }),
    labelColor: (opacity = 1) =>
      hexToRgb({ hex: successColor, opacity: opacity }),
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };
  return (
    <View
      style={{
        backgroundColor: "transparent",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {limitLine && (
        <View style={{ position: "absolute", zIndex: 1 }}>
          {/* <VictoryLine
            animate={{ duration: 1000 }}
            standalone={true}
            data={limitLine}
            height={height}
            width={width + 32}
            maxDomain={{
              y:
                shadowGraph[0].y > limitLine[0].y
                  ? shadowGraph[0].y
                  : limitLine[0].y,
            }}
            style={{
              data: {
                // stroke: hexToRgb({ hex: textColor, opacity: 0.5 }),
                stroke: hexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 1,
                }),
                strokeLinecap: "round",
                // strokeDasharray: "18, 18",
                strokeDasharray: 16,
                strokeDashoffset: -10,
                strokeLinejoin: "round",
                //   borderRadius: 8,
                strokeWidth: 3,
              },
            }}
          /> */}
        </View>
      )}
      <VictoryGroup
        // padding={{ top: 0, bottom: 48, left: 80, right: 22 }}
        padding={{ top: 0, bottom: 36, left: 46, right: 0 }}
        height={height || 200}
        width={width || 200}
        domainPadding={{ x: [maxAmount().length * 8, 30] }}
        // domainPadding={{ x: [56, 30] }}
        maxDomain={{ y: shadowGraph[0].y }}
        animate={{ duration: 1000 }}
      >
        {/* Shadow Graph */}
        <VictoryBar
          fixLabelOverlap={true}
          //   labels={({ datum }) => datum.x}
          //   labelComponent={<VictoryLabel dy={24} />}
          alignment="middle"
          height={height}
          //   domainPadding={{ x: 10, y: 100 }}
          barWidth={barWidth}
          cornerRadius={{ top: 8, bottom: 8 }}
          style={{ data: { fill: shadowBarColor } }}
          data={shadowGraph}
        />
        {/* Main Graph */}
        <VictoryBar
          fixLabelOverlap={true}
          labels={({ datum }) => datum.x}
          labelComponent={
            <VictoryLabel
              y={height}
              textAnchor="middle"
              style={{
                fill: ({ datum }) =>
                  datum.x ===
                  new Date().toLocaleDateString(appSettings.locale, {
                    weekday: "short",
                  })
                    ? primaryColor
                    : textColor,
              }}
            />
          }
          alignment="middle"
          barWidth={barWidth}
          cornerRadius={{ top: 8, bottom: 8 }}
          style={{
            data: {
              fill: ({ datum }) => {
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
              },
            },
          }}
          data={mainGraph}
        />

        {/* Limit Line */}
        {limitLine && (
          <VictoryLine
            animate={{ duration: 1000 }}
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
                // stroke: hexToRgb({ hex: textColor, opacity: 0.5 }),
                stroke: hexToRgb({
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

        <VictoryGroup domainPadding={{ x: 0 }} animate={{ duration: 1000 }}>
          {/* Bottom Amount */}
          <VictoryLabel
            datum={{ x: 0.3, y: 0 }}
            verticalAnchor="end"
            textAnchor="end"
            text={`0`}
            //   backgroundPadding={{ right: 8 }}
            style={{ fill: textColor, fontSize: 14, textAlign: "right" }}
          />

          {/* Limit Amount */}
          {limitLine && (
            <VictoryLabel
              datum={{ x: 0.3, y: limitLine[0].y }}
              textAnchor="end"
              text={`${(limitLine[0].y / 1000).toFixed(0)} k`}
              // backgroundPadding={{ right: 0 }}
              style={{ fill: primaryColor, fontSize: 14, textAlign: "right" }}
            />
          )}

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
        </VictoryGroup>
      </VictoryGroup>
    </View>
  );
};
