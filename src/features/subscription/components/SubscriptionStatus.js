import { TouchableNativeFeedback, View } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";

const SubscriptionStatus = ({ subscription, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <ListSection
        backgroundColor={
          subscription.plan === "premium"
            ? globalTheme.colors.success
            : globalTheme.colors.warn
        }
      >
        <View
          style={{
            padding: 16,
            alignItems: "center",
          }}
        >
          <TextButtonPrimary
            label={
              subscription.plan === "premium"
                ? "Premium Account"
                : "Free Account"
            }
            style={{ fontWeight: "bold" }}
          />
          <TextButtonPrimary
            label={
              "Joined since : " + new Date(subscription.joinDate).toDateString()
            }
          />
        </View>
      </ListSection>
      {subscription.plan !== "premium" && (
        <ListSection backgroundColor={globalTheme.colors.success}>
          <TouchableNativeFeedback
            onPress={() => {
              onPress(screenList.paywallScreen);
            }}
          >
            <View
              style={{
                padding: 16,
                alignItems: "center",
              }}
            >
              <TextButtonPrimary
                label="Upgrade to Premium"
                style={{ fontWeight: "bold" }}
              />
            </View>
          </TouchableNativeFeedback>
        </ListSection>
      )}
      <ListSection>
        <ListItem
          pressable
          leftLabel="Manage subscription"
          iconRightName={"chevron-forward-outline"}
          onPress={() => {}}
        />
        <ListItem
          pressable
          leftLabel="Subscription history"
          iconRightName={"chevron-forward-outline"}
          onPress={() => {
            onPress(screenList.subscriptionHistoryScreen);
          }}
        />
      </ListSection>
    </>
  );
};

export default SubscriptionStatus;
