import { Dimensions, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";
import { TextPrimary } from "../Text";

export const RoundProgressBar = ({
  //   data
  data,
  spent,
  limit,
  //   Styling
  width,
  height,
  radius,
  fontSize,
  label,
  strokeWidth,
  fontColor,
  color,
  backgroundColor,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <View>
        <ProgressChart
          data={data}
          width={width || Dimensions.get("window").width - 32}
          height={height || 220}
          strokeWidth={strokeWidth || 18}
          radius={radius || 80}
          hideLegend={true}
          chartConfig={{
            // backgroundColor:
            //   backgroundColor || globalTheme.colors.background,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) =>
              color
                ? utils.hexToRgb({ hex: color, opacity: opacity })
                : utils.hexToRgb({
                    hex:
                      spent / limit >= 1
                        ? globalTheme.colors.danger
                        : spent / limit >= 0.8
                        ? globalTheme.colors.warn
                        : globalTheme.colors.success,
                    opacity: opacity,
                  }),
            // color: (opacity = 1) =>globalTheme.colors.primary,
            labelColor: (opacity = 0.5) =>
              utils.hexToRgb({
                hex: globalTheme.colors.primary,
                opacity: opacity,
              }),
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          <TextPrimary
            label={`${parseFloat((spent / limit) * 100).toFixed(0)}%`}
            style={{
              textAlign: "center",
              fontSize: fontSize || 34,
              color:
                fontColor || globalTheme.text.textPrimary.color,
            }}
          />
          {label && <TextPrimary label={label} />}
        </View>
      </View>
    </>
  );
};
