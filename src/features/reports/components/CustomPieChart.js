import { Dimensions, View } from "react-native";
import {
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryPie,
} from "victory-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import svg, { G } from "react-native-svg";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import getColorShadesForChart from "../../../utils/getColorShadesForChart";
import { useMemo, useState } from "react";

/**
 * Custom pie chart component
 *
 * @param mode - `income` or `expense`. Default is `expense`
 * @returns
 */
const CustomPieChart = ({
  useDarkGraphColorShades = false,
  mode = "expense",
  data,
  showUpLine = false,
  showDownLine = false,
  showRightLine = false,
  showLeftLine = false,
  graphHeightAndWidth = null,
  adjustTop = 0,
  adjustRight = 0,
  adjustBottom = 0,
  adjustLeft = 0,
  zIndex = 0,
  iconColor = null,
  enteringAnimation = null,
  animateGraph = false,
  onPress,
}) => {
  const { globalTheme } = useGlobalTheme();
  const width = graphHeightAndWidth || Dimensions.get("window").width;
  const height = graphHeightAndWidth || width;

  const [incomeColorShades, setIncomeColorShades] = useState([]);
  const [expenseColorShades, setExpenseColorShades] = useState([]);

  useMemo(() => {
    const {
      lighterColorShades: newExpenseColorShades,
      darkerColorShades: newExpenseColorDarkerShades,
    } = getColorShadesForChart(
      data.length + 1,
      globalTheme.colors.danger,
      // "#b90d57",
      1
    );
    useDarkGraphColorShades &&
      setExpenseColorShades(newExpenseColorDarkerShades);
    !useDarkGraphColorShades && setExpenseColorShades(newExpenseColorShades);

    const {
      lighterColorShades: newIncomeColorShades,
      darkerColorShades: newIncomeColorDarkerShades,
    } = getColorShadesForChart(data.length + 1, globalTheme.colors.success, 1);

    useDarkGraphColorShades && setIncomeColorShades(newIncomeColorDarkerShades);
    !useDarkGraphColorShades && setIncomeColorShades(newIncomeColorShades);
  }, [
    data.length,
    globalTheme.colors.danger,
    globalTheme.colors.success,
    useDarkGraphColorShades,
  ]);

  const colorScale = mode === "income" ? incomeColorShades : expenseColorShades;
  return (
    <>
      <Animated.View
        entering={enteringAnimation}
        style={{
          position: "relative",
          width: graphHeightAndWidth || width,
          height: graphHeightAndWidth || height,
          alignItems: "center",
          top: adjustTop,
          right: adjustRight,
          bottom: adjustBottom,
          left: adjustLeft,
          justifyContent: "center",
          zIndex: zIndex,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: zIndex,
          }}
        >
          <VictoryPie
            colorScale={[
              utils.hexToRgb({
                hex: iconColor || globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            ]}
            padAngle={({ datum }) => datum.y / 10}
            // innerRadius={140}
            radius={graphHeightAndWidth * 0.9 || 147}
            innerRadius={graphHeightAndWidth * 0.8 || 140}
            data={[{ x: "", y: 100 }]}
            labels={() => null}
          />
        </View>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: zIndex,
          }}
        >
          {!!data?.length && (
            <VictoryPie
              colorScale={colorScale}
              animate={{ duration: 2000, easing: "circleIn" }}
              //   padAngle={({ datum }) => datum.y / 10}
              padAngle={graphHeightAndWidth * 0.05 || 4}
              cornerRadius={graphHeightAndWidth * 0.1 || 8}
              // cornerRadius={({ datum }) => datum.y * 5}
              radius={graphHeightAndWidth * 0.7 || 130}
              innerRadius={graphHeightAndWidth * 0.5 || 90}
              data={data}
              //   labels={({ datum }) => `${datum.x}: ${datum.y}`}
              labelComponent={<IconLabel iconColor={iconColor} />}
            />
          )}
        </View>
        {!data?.length && (
          <View
            style={{
              backgroundColor: utils.hexToRgb({
                hex: iconColor || globalTheme.colors.listSection,
                opacity: 0.07,
              }),
              width: graphHeightAndWidth || width / 2,
              height: graphHeightAndWidth || height / 2,
              borderRadius: graphHeightAndWidth / 2 || height / 4,
              alignItems: "center",
              justifyContent: "center",
              padding: graphHeightAndWidth * 0.1 || 16,
              overflow: "visible",
            }}
          >
            <TextPrimary
              label={`No ${mode} data`}
              style={{
                fontSize: graphHeightAndWidth ? 10 : 14,
                textAlign: "center",
                color: iconColor || globalTheme.text.textPrimary.color,
              }}
            />
          </View>
        )}

        {showUpLine && (
          <View
            style={{
              position: "absolute",
              top: 0,
              height: 50,
              width: 8,
              backgroundColor: utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            }}
          />
        )}
        {showDownLine && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              height: 50,
              width: 8,
              backgroundColor: utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            }}
          />
        )}
        {showRightLine && (
          <View
            style={{
              position: "absolute",
              right: 0,
              width: 50,
              height: 8,
              backgroundColor: utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            }}
          />
        )}
        {showLeftLine && (
          <View
            style={{
              position: "absolute",
              left: 0,
              width: 50,
              height: 8,
              backgroundColor: utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            }}
          />
        )}
      </Animated.View>
    </>
  );
};
export default CustomPieChart;

const IconLabel = (props) => {
  const { globalTheme } = useGlobalTheme();
  const { index, x, y, datum, width, height, iconColor } = props;
  const cat = datum._y >= 0 ? "😻" : "😹";
  return (
    <G x={x} y={y}>
      <View
        style={{
          position: "absolute",
          //   margin: 16,
          //   width: width,
          //   height: height,
          top: y - 16,
          left: x - 16,
          //   backgroundColor: "red",
          alignItems: "center",
        }}
      >
        <IonIcons
          name={datum.iconName}
          size={20}
          color={iconColor || globalTheme.colors.foreground}
          style={{
            padding: 8,
            //   margin: 8,
          }}
        />
        {/* <TextPrimary
          label={datum.categoryName}
          style={{
            textAlign: "center",
          }}
        /> */}
      </View>
    </G>
  );
};
