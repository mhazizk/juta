import { useEffect, useState } from "react";
import {
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { globalStyles, globalTheme } from "../src/assets/themes/globalStyles";
import { TextPrimary, TextSecondary } from "./Text";

const ExpenseChartPreview = ({ onPress }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const [chartData, setChartData] = useState({
    data: [
      { date: 1, amount: 13000 },
      { date: 2, amount: 16500 },
      { date: 3, amount: 14250 },
      { date: 4, amount: 19000 },
      { date: 5, amount: 49000 },
    ],
  });

  useEffect(() => {
    // refresh
  }, []);

  return (
    <>
      {/* //! Summary Section */}
      <TouchableNativeFeedback onPress={() => onPress()}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
            // backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <TextSecondary label="Rp" />
              <TextPrimary
                label={150000}
                style={{ fontWeight: "bold", fontSize: 32 }}
              />
            </View>
            <TextSecondary label="Total Expense this Month" />
          </View>
          {/* <IonIcons name='analytics' color='black' size={36} /> */}

          <View style={{ position: "absolute", zIndex: 0 }}>
            <VictoryGroup theme={VictoryTheme.grayscale}>
              <VictoryLine
                data={chartData.data}
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },
                }}
                // animate={{ duration: 100 }}
                interpolation="natural"
                x="date"
                y="amount"
                style={{
                  data: { stroke: appSettings.theme.style.colors.foreground },
                }}
              />
            </VictoryGroup>
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export default ExpenseChartPreview;
