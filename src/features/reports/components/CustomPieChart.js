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

/**
 * Custom pie chart component
 *
 * @param mode - `income` or `expense`. Default is `expense`
 * @returns
 */
const CustomPieChart = ({
  mode = "expense",
  data,
  showUpLine = false,
  showDownLine = false,
  showRightLine = false,
  showLeftLine = false,
}) => {
  const { globalTheme } = useGlobalTheme();
  const width = Dimensions.get("window").width;
  const height = width;
  const colorScale = mode === "income" ? "green" : "red";
  return (
    <>
      <View
        style={{
          position: "relative",
          width: "100%",
          height: height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!data?.length && (
          <View
            style={{
              backgroundColor: utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
              width: width / 2,
              height: height / 2,
              borderRadius: height / 4,
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary
              label={`No ${mode} data`}
              style={{
                textAlign: "center",
              }}
            />
          </View>
        )}

        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
          }}
        >
          <VictoryPie
            colorScale={[
              utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
            ]}
            padAngle={({ datum }) => datum.y / 10}
            innerRadius={140}
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
          }}
        >
          <VictoryPie
            colorScale={colorScale}
            //   padAngle={({ datum }) => datum.y / 10}
            padAngle={4}
            cornerRadius={8}
            // cornerRadius={({ datum }) => datum.y * 5}
            radius={130}
            innerRadius={90}
            data={data}
            //   labels={({ datum }) => `${datum.x}: ${datum.y}`}
            labelComponent={<IconLabel />}
          />
        </View>
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
      </View>
    </>
  );
};
export default CustomPieChart;

const IconLabel = (props) => {
  const { globalTheme } = useGlobalTheme();
  const { index, x, y, datum, width, height } = props;
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
          color={globalTheme.colors.foreground}
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
