import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import UserHeaderComponent from "../../../components/UserHeader";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets, useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount
} from "../../../reducers/GlobalContext";
import SubscriptionFeatures from "../components/SubscriptionFeatures";
import SubscriptionStatus from "../components/SubscriptionStatus";

const AccountSubscriptionScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks } = useGlobalLogbooks();
  const { budgets } = useGlobalBudgets();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const [isLoading, setIsLoading] = useState(false);

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
            <UserHeaderComponent />
            <SubscriptionStatus subscription={userAccount?.subscription} />
            <SubscriptionFeatures
              subscription={userAccount?.subscription}
              showCurrent={true}
            />
            {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}
            <ListSection>
              {/* // TAG : Subscription Plan */}
              <ListItem
                pressable
                leftLabel="Other Subscription Plan"
                iconLeftName="pricetag"
                iconRightName="chevron-forward"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.subscriptionPlanScreen)
                }
              />
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

export default AccountSubscriptionScreen;
