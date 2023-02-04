import { View } from "react-native";
import { ListTable } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalLogbooks
} from "../../../reducers/GlobalContext";
import subscriptionFeaturesModel from "../model/subscriptionFeaturesModel";

const SubscriptionFeatures = ({ subscription, showCurrent = false }) => {
  // const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  // const statHeight = StatusBar.currentHeight;
  return (
    <>
      <View>{mapSubscription({ subscription, showCurrent })}</View>
    </>
  );
};

export default SubscriptionFeatures;

const mapSubscription = ({ subscription, showCurrent = false }) => {
  const { appSettings } = useGlobalAppSettings();
  const { logbooks } = useGlobalLogbooks();
  const { budgets } = useGlobalBudgets();

  const checkmark = require("../../../assets/img/checkmark.png");

  return (
    <>
      {/* <TextPrimary
        label="Free Features"
        style={{
          paddingVertical: 16,
          paddingHorizontal: 32,
        }}
      /> */}
      <View
        style={{
          // display: "flex",
          flexDirection: "column",
          // backgroundColor: appSettings.theme.style.colors.background,
          // width: "100%",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
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
        <ListSection>
          {subscriptionFeaturesModel.map((feature) => {
            return (
              <ListTable
                key={feature.name}
                iconLeftName={feature.iconName}
                leftLabel={feature.name}
                middleLabelColor={
                  feature.premium > feature.free
                    ? appSettings.theme.style.colors.success
                    : appSettings.theme.style.colors.danger
                }
                middleLabel={
                  !feature.premium
                    ? "No"
                    : feature.premium.toString() === "true"
                    ? "Yes"
                    : feature.premium
                }
                rightLabelColor={
                  feature.free < feature.premium
                    ? appSettings.theme.style.colors.danger
                    : appSettings.theme.style.colors.success
                }
                rightLabel={
                  !feature.free
                    ? "No"
                    : feature.free.toString() === "true"
                    ? "Yes"
                    : feature.free
                }
              />
            );
          })}
        </ListSection>
      </View>
    </>
  );
};
