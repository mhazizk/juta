import { StatusBar } from "expo-status-bar";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ListItem, ListTable } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import subscriptionFeaturesModel from "../model/subscriptionFeaturesModel";

const SubscriptionFeatures = ({ subscription }) => {
  // const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  // const statHeight = StatusBar.currentHeight;
  return (
    <>
      <View>{subscription.plan === "free" && freeSubscription()}</View>
    </>
  );
};

export default SubscriptionFeatures;

const freeSubscription = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const checkmark = require("../../../assets/img/checkmark.png");

  return (
    <>
      <TextPrimary
        label="Free Features"
        style={{
          paddingVertical: 16,
          paddingHorizontal: 32,
        }}
      />
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
        <ListSection>
          {subscriptionFeaturesModel.map((feature) => {
            return (
              <ListTable
                iconLeftName="checkmark"
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
