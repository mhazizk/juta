import { View } from "react-native";
import ListSection from "../../../components/List/ListSection";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";

const SubscriptionStatus = ({ subscription }) => {
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
            label={"Since: " + new Date(subscription.date).toDateString()}
          />
        </View>
      </ListSection>
    </>
  );
};

export default SubscriptionStatus;
