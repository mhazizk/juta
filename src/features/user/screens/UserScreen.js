import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import UserHeaderComponent from "../../../components/UserHeader";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories, useGlobalFeatureSwitch, useGlobalLogbooks,
  useGlobalRepeatedTransactions, useGlobalUserAccount
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const UserScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { userAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets } = useGlobalBudgets();
  const { repeatedTransactions } = useGlobalRepeatedTransactions();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      setTimeout(() => {
        dispatchBadgeCounter({
          type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB,
          payload: "0",
        });
      }, 1);
    }
  }, [isFocus]);

  return (
    <>
      <CustomScrollView>
        {userAccount && (
          <>
            <UserHeaderComponent />
            <ListSection>
              {/* // TAG : My Profile */}
              <ListItem
                pressable
                leftLabel="My Account"
                iconLeftName="person"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.myAccountScreen)}
              />
              {/* // TAG : My Groups */}
              {/* <ListItem
            pressable
            leftLabel="My Groups"
            iconLeftName="people"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.myGroupsScreen)}
          /> */}
              {/* // TAG : My Logbooks */}
              <ListItem
                pressable
                leftLabel="My Logbooks"
                rightLabel={`${logbooks?.logbooks?.length} logbook(s)`}
                iconLeftName="book"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.myLogbooksScreen)}
              />
              {/* // TAG : My Categories */}
              <ListItem
                pressable
                leftLabel="My Categories"
                rightLabel={`${
                  categories?.categories?.expense?.length +
                  categories?.categories?.income?.length
                } categories`}
                iconLeftName="pricetags"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.myCategoriesScreen)
                }
              />
              {/* // TAG : My Budget */}
              <ListItem
                pressable
                leftLabel="My Budgets"
                rightLabel={
                  Date.now() <= budgets?.budgets[0]?.finish_date
                    ? "Active"
                    : "Inactive"
                }
                iconLeftName="piggy-bank"
                iconPack="FontAwesome5"
                onPress={() => navigation.navigate(screenList.myBudgetsScreen)}
              />
              {/* // TAG : My Loans */}
              <ListItem
                pressable
                leftLabel="My Loans"
                iconLeftName="cash"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.myLoansScreen)}
              />
              {/* // TAG : My Repeated Transactions */}
              {/* <ListItem
                pressable
                leftLabel="My Repeated Transactions"
                iconLeftName="repeat"
                rightLabel={
                  (repeatedTransactions.repeatedTransactions.length || "No") +
                  " transaction(s)"
                }
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.myRepeatedTransactionsScreen)
                }
              /> */}
            </ListSection>
            <ListSection>
              {/* // TAG : Settings */}
              <ListItem
                pressable
                leftLabel="Settings"
                iconLeftName="build"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.settingsScreen)}
              />
              {/* // TODO : Hold this feature */}
              {/* // TAG: Feature Wishlist */}
              {/* <ListItem
                pressable
                disabled={
                  !getFeatureLimit(
                    { globalFeatureSwitch,
                      subscriptionPlan: userAccount?.subscription?.plan,
                   featureName: FEATURE_NAME.FEATURE_WISHLIST}
                  )
                }
                leftLabel="Feature Wishlist"
                iconLeftName="bulb"
                iconPack="IonIcons"
                onPress={() => {
                  if (
                    !getFeatureLimit(
                      { globalFeatureSwitch,
                        subscriptionPlan: userAccount?.subscription?.plan,
                     featureName: FEATURE_NAME.FEATURE_WISHLIST}
                    )
                  ) {
                    Alert.alert(
                      "Upgrade to premium",
                      "This feature is only available for premium users.",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Upgrade",
                          onPress: () =>
                            navigation.navigate(
                              screenList.mySubscriptionScreen
                            ),
                        },
                      ]
                    );
                  } else {
                    navigation.navigate(screenList.featureWishlistScreen);
                  }
                }}
              /> */}
              {/* // TAG : About */}
              <ListItem
                pressable
                leftLabel="About"
                iconLeftName="information-circle"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.aboutScreen)}
              />
              {/* // TAG : Developer*/}
              {__DEV__ && (
                <ListItem
                  pressable
                  leftLabel="Developer"
                  iconLeftName="code"
                  iconPack="IonIcons"
                  onPress={() =>
                    navigation.navigate(screenList.developerSettingsScreen)
                  }
                />
              )}
            </ListSection>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default UserScreen;
