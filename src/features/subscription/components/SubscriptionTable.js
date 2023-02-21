import { View } from "react-native";
import { ListTable } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalBudgets,
  useGlobalLogbooks,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import featureSwitch from "../model/subscriptionFeatureList";

const SubscriptionTable = ({ subscription, showCurrent = false }) => {
  const { globalTheme } = useGlobalTheme();
  const { logbooks } = useGlobalLogbooks();
  const { budgets } = useGlobalBudgets();

  return (
    <>
      <ListSection>
        <View
          style={{
            // display: "flex",
            flexDirection: "column",
            width: "100%",
            // justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingVertical: 8,
            }}
          >
            <ListTable
              titleMode={true}
              leftLabel="Features"
              middleLabel="Free"
              rightLabel="Premium"
            />
          </View>
          <ListSection noMargin={true}>
            <View
              style={{
                paddingTop: 8,
              }}
            />
            {featureSwitch.map((feature) => {
              return (
                <ListTable
                  pressable={false}
                  key={feature.name}
                  iconLeftName={feature.iconName}
                  leftLabel={feature.name}
                  middleLabel={feature.free}
                  middleLabelColor={
                    feature.free < feature.premium
                      ? globalTheme.colors.foreground
                      : globalTheme.colors.success
                  }
                  rightLabel={
                    feature.premium > 99 ? "Unlimited" : feature.premium
                  }
                  rightLabelColor={globalTheme.colors.success}
                />
              );
            })}
            <View
              style={{
                paddingBottom: 8,
              }}
            />
          </ListSection>
        </View>
      </ListSection>
    </>
  );
};

export default SubscriptionTable;
