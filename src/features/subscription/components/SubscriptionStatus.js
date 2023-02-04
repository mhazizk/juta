import { TouchableNativeFeedback, View } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";

const SubscriptionStatus = ({ subscription, onPress }) => {
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <ListSection
        backgroundColor={
          subscription.plan === "premium"
            ? appSettings.theme.style.colors.success
            : appSettings.theme.style.colors.warn
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
            label={"Since : " + new Date(subscription.joinDate).toDateString()}
          />
          <TextButtonPrimary
            label={
              "Expires in : " +
              new Date(subscription.expirationDate).toDateString()
            }
          />
        </View>
      </ListSection>
      {subscription.plan !== "premium" && (
        <ListSection backgroundColor={appSettings.theme.style.colors.success}>
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
      {subscription.plan !== "premium" && (
        <>
          <ListSection>
            <ListItem
              pressable
              leftLabel="Manage subscription"
              iconRightName={"chevron-forward-outline"}
              onPress={()=>{}}
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
      )}
    </>
  );
};

export default SubscriptionStatus;
