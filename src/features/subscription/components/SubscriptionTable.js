import { View } from "react-native";
import { ListTable } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalBudgets,
  useGlobalLogbooks,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import subscriptionFeaturesModel from "../model/subscriptionFeaturesModel";

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
              // iconLeftName="ribbon"
              // iconLeftColor="transparent"
              leftLabel="Features"
              middleLabel={showCurrent ? "Current" : "Premium"}
              rightLabel={
                !showCurrent || subscription.plan === "free"
                  ? "Free"
                  : showCurrent && subscription.plan === "premium"
                  ? "premium"
                  : "free"
              }
            />
          </View>
          <ListSection noMargin={true}>
            <View
              style={{
                paddingTop: 8,
              }}
            />
            {subscriptionFeaturesModel.map((feature) => {
              return (
                <ListTable
                  pressable={false}
                  key={feature.name}
                  iconLeftName={feature.iconName}
                  leftLabel={feature.name}
                  middleLabelColor={
                    feature.premium > feature.free
                      ? globalTheme.colors.success
                      : globalTheme.colors.danger
                  }
                  middleLabel={feature.premium}
                  rightLabelColor={
                    feature.free < feature.premium
                      ? globalTheme.colors.danger
                      : globalTheme.colors.success
                  }
                  rightLabel={feature.free}
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
