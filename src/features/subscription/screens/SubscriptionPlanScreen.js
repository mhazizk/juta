import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import ListSection from "../../../components/List/ListSection";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import SubscriptionFeatures from "../components/SubscriptionFeatures";
import SubscriptionTypeCard from "../components/SubscriptionTypeCard";
import subscriptionTypes from "../model/subscriptionType";

const SubscriptionPlanScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();
  const [isLoading, setIsLoading] = useState(false);
  const [yearlySaving, setYearlySaving] = useState(null);

  useEffect(() => {
    getYearlySaving();
  }, []);

  useEffect(() => {
    if (userAccount) {
      setTimeout(async () => {
        firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          userAccount
        );
      }, 1);
    }
  }, [userAccount]);

  const getYearlySaving = () => {
    const yearlyPrice = subscriptionTypes.find((subscriptionType) => {
      return subscriptionType.id === "yearly";
    }).price;

    const monthlyToYear = subscriptionTypes.find((subscriptionType) => {
      return subscriptionType.id === "monthly";
    }).price;

    const yearlySaving = monthlyToYear * 12 - yearlyPrice;
    setYearlySaving(yearlySaving);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {userAccount && !isLoading && (
          <>
            <View
              style={{
                position: "absolute",
                top: 90,
                left: Dimensions.get("window").width / 2 - 24 - 48,
                zIndex: 1,
              }}
            >
              <Svg width="48" height="48" viewBox="0 0 512 512">
                <Path
                  fill={appSettings.theme.style.colors.warn}
                  d="M208 512a24.84 24.84 0 0 1-23.34-16l-39.84-103.6a16.06 16.06 0 0 0-9.19-9.19L32 343.34a25 25 0 0 1 0-46.68l103.6-39.84a16.06 16.06 0 0 0 9.19-9.19L184.66 144a25 25 0 0 1 46.68 0l39.84 103.6a16.06 16.06 0 0 0 9.19 9.19l103 39.63a25.49 25.49 0 0 1 16.63 24.1a24.82 24.82 0 0 1-16 22.82l-103.6 39.84a16.06 16.06 0 0 0-9.19 9.19L231.34 496A24.84 24.84 0 0 1 208 512Zm66.85-254.84ZM88 176a14.67 14.67 0 0 1-13.69-9.4l-16.86-43.84a7.28 7.28 0 0 0-4.21-4.21L9.4 101.69a14.67 14.67 0 0 1 0-27.38l43.84-16.86a7.31 7.31 0 0 0 4.21-4.21L74.16 9.79A15 15 0 0 1 86.23.11a14.67 14.67 0 0 1 15.46 9.29l16.86 43.84a7.31 7.31 0 0 0 4.21 4.21l43.84 16.86a14.67 14.67 0 0 1 0 27.38l-43.84 16.86a7.28 7.28 0 0 0-4.21 4.21l-16.86 43.84A14.67 14.67 0 0 1 88 176Zm312 80a16 16 0 0 1-14.93-10.26l-22.84-59.37a8 8 0 0 0-4.6-4.6l-59.37-22.84a16 16 0 0 1 0-29.86l59.37-22.84a8 8 0 0 0 4.6-4.6l22.67-58.95a16.45 16.45 0 0 1 13.17-10.57a16 16 0 0 1 16.86 10.15l22.84 59.37a8 8 0 0 0 4.6 4.6l59.37 22.84a16 16 0 0 1 0 29.86l-59.37 22.84a8 8 0 0 0-4.6 4.6l-22.84 59.37A16 16 0 0 1 400 256Z"
                />
              </Svg>
            </View>
            <View
              style={{
                position: "absolute",
                top: 18,
                right: Dimensions.get("window").width / 2 - 72,
                zIndex: 1,
                transform: [{ scaleY: -1 }, { scale: 1 }],
              }}
            >
              <Svg width="48" height="48" viewBox="0 0 512 512">
                <Path
                  fill={appSettings.theme.style.colors.warn}
                  d="M208 512a24.84 24.84 0 0 1-23.34-16l-39.84-103.6a16.06 16.06 0 0 0-9.19-9.19L32 343.34a25 25 0 0 1 0-46.68l103.6-39.84a16.06 16.06 0 0 0 9.19-9.19L184.66 144a25 25 0 0 1 46.68 0l39.84 103.6a16.06 16.06 0 0 0 9.19 9.19l103 39.63a25.49 25.49 0 0 1 16.63 24.1a24.82 24.82 0 0 1-16 22.82l-103.6 39.84a16.06 16.06 0 0 0-9.19 9.19L231.34 496A24.84 24.84 0 0 1 208 512Zm66.85-254.84ZM88 176a14.67 14.67 0 0 1-13.69-9.4l-16.86-43.84a7.28 7.28 0 0 0-4.21-4.21L9.4 101.69a14.67 14.67 0 0 1 0-27.38l43.84-16.86a7.31 7.31 0 0 0 4.21-4.21L74.16 9.79A15 15 0 0 1 86.23.11a14.67 14.67 0 0 1 15.46 9.29l16.86 43.84a7.31 7.31 0 0 0 4.21 4.21l43.84 16.86a14.67 14.67 0 0 1 0 27.38l-43.84 16.86a7.28 7.28 0 0 0-4.21 4.21l-16.86 43.84A14.67 14.67 0 0 1 88 176Zm312 80a16 16 0 0 1-14.93-10.26l-22.84-59.37a8 8 0 0 0-4.6-4.6l-59.37-22.84a16 16 0 0 1 0-29.86l59.37-22.84a8 8 0 0 0 4.6-4.6l22.67-58.95a16.45 16.45 0 0 1 13.17-10.57a16 16 0 0 1 16.86 10.15l22.84 59.37a8 8 0 0 0 4.6 4.6l59.37 22.84a16 16 0 0 1 0 29.86l-59.37 22.84a8 8 0 0 0-4.6 4.6l-22.84 59.37A16 16 0 0 1 400 256Z"
                />
              </Svg>
            </View>

            <Image
              source={require("../../../assets/img/checkmark.png")}
              style={{
                marginTop: 32,
                alignSelf: "center",
                width: 100,
                height: 100,
              }}
            />

            <TextPrimary
              label={`Choose your subscription plan\nand enjoy the benefits`}
              style={{
                fontSize: 24,
                textAlign: "center",
                paddingVertical: 16,
                // paddingHorizontal: 32,
              }}
            />

            <SubscriptionFeatures subscription={userAccount?.subscription} />

            <TextPrimary
              label="Subscription Plan"
              style={{
                paddingVertical: 16,
                paddingHorizontal: 32,
              }}
            />
            <ListSection>
              {subscriptionTypes.map((subscriptionType) => (
                <>
                  <SubscriptionTypeCard
                    yearlySaving={yearlySaving}
                    key={subscriptionType.id}
                    currentSubscriptionType={userAccount?.subscription?.type}
                    subscriptionType={subscriptionType}
                    index={subscriptionType.id}
                    onPress={()=>{}}
                  />
                </>
              ))}
            </ListSection>
          </>
        )}
        {isLoading && (
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appSettings.theme.style.colors.background,
              }}
            >
              <Loading />
              <TextPrimary label="Loading..." />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default SubscriptionPlanScreen;
