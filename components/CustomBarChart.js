import { View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
} from "victory-native";
import { useGlobalAppSettings } from "../modules/GlobalContext";
import { hexToRgb } from "../modules/HexToRGB";

export const CustomBarChart = ({
  mainGraph,
  shadowGraph,
  limitLine,
  width,
  height,
  mainBarColor,
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
  const chartConfig = {
    // backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    fillShadowGradientFrom: "#ff0000",
    fillShadowGradientTo: "#fff000",
    color: (opacity = 1) => hexToRgb({ hex: mainBarColor, opacity: opacity }),
    labelColor: (opacity = 1) =>
      hexToRgb({ hex: mainBarColor, opacity: opacity }),
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };
  return (
    <View
      style={{
        backgroundColor: appSettings.theme.style.colors.secondary,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
      }}
    >
      {/* <BarChart
        data={data}
        width={width || 200}
        height={height || 200}
        yAxisLabel={symbol}
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={{
          borderRadius: barRadius,
          backgroundColor: "transparent",
        }}
        fromZero={true}
        showValuesOnTopOfBars={true}
        withVerticalLines={false}
        withHorizontalLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withInnerLines={false}
        withOuterLines={false}
        withCustomBarColorFromData={true}
        flatColor={true}
        barPercentage={barWidth}
        showBarTops={true}
        onDataPointClick={onPress}
      /> */}

      {limitLine && (
        <View style={{ position: "absolute", zIndex: 1 }}>
          <VictoryLine
            animate={100}
            standalone={true}
            data={limitLine}
            height={height}
            width={width}
            style={{
              data: {
                // stroke: hexToRgb({ hex: textColor, opacity: 0.5 }),
                stroke: hexToRgb({
                  hex: appSettings.theme.style.colors.secondary,
                  opacity: 1,
                }),
                strokeLinecap: "round",
                // strokeDasharray: "18, 18",
                // strokeDasharray: 16,
                // strokeDashoffset: 18,
                strokeLinejoin: "round",
                //   borderRadius: 8,
                strokeWidth: ({ data }) => data.length,
              },
            }}
          />
        </View>
      )}
      <VictoryGroup
        padding={{ top: -24, bottom: 36, left: 36, right: 36 }}
        height={height || 200}
        width={width || 200}
        domainPadding={{ x: 32, y: 32 }}
        //   maxDomain={{ y: 50_000 }}
        animate={100}
      >
        {/* Limit Line */}

        {/* Shadow Graph */}
        <VictoryBar
          fixLabelOverlap={true}
          //   labels={({ datum }) => datum.x}
          //   labelComponent={<VictoryLabel dy={24} />}
          alignment="middle"
          height={height}
          //   domainPadding={{ y: 100 }}
          //   padding={{ top: 0, bottom: 36, left: 36, right: 36 }}
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
              y={height + 4}
              textAnchor="middle"
              style={{ fill: textColor }}
            />
          }
          alignment="middle"
          barWidth={barWidth}
          cornerRadius={{ top: 8, bottom: 8 }}
          style={{
            data: {
              fill: ({ datum }) => {
                switch (true) {
                  case datum.y / limitLine[0].y < 0.8:
                    return mainBarColor;
                  case datum.y / limitLine[0].y >= 0.8 &&
                    datum.y / limitLine[0].y < 1:
                    return warnBudgetBarColor;
                  case datum.y / limitLine[0].y >= 1:
                    return overBudgetBarColor;
                  default:
                    return mainBarColor;
                }
              },
            },
          }}
          data={mainGraph}
        />
      </VictoryGroup>
    </View>
  );
};
