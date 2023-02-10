import { Alert, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import screenList from "../../../navigations/ScreenList";
import getSubscriptionLimit from "../../subscription/logic/getSubscriptionLimit";
import SUBSCRIPTION_LIMIT from "../../subscription/model/subscriptionLimit";
import { useEffect } from "react";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const MyRepeatedTransactionsScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { userAccount } = useGlobalUserAccount();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { repeatedTransactions } = useGlobalRepeatedTransactions();

  useEffect(() => {}, []);

  return (
    <>
      {repeatedTransactions.repeatedTransactions.length > 0 && (
        <CustomScrollView
          contentContainerStyle={{
            justifyContent: "flex-start",
          }}
        >
          <>
            <TextPrimary
              label="Repeated Transactions"
              style={{
                alignSelf: "flex-start",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            />
            <ListSection>
              {repeatedTransactions.repeatedTransactions.map(
                (repeatSection) => {
                  return (
                    <ListItem
                      key={repeatSection.repeat_id}
                      pressable
                      leftLabel={utils.FindById.findCategoryNameById({
                        id: repeatSection.repeat_category_id,
                        categories: categories.categories,
                      })}
                      secondaryLabel={repeatSection.repeat_notes}
                      thirdLabel={
                        "Next : " +
                        new Date(repeatSection.next_repeat_date).toDateString()
                      }
                      iconLeftName={utils.FindById.findCategoryIconNameById({
                        id: repeatSection.repeat_category_id,
                        categories: categories.categories,
                      })}
                      iconLeftColor={utils.FindById.findCategoryColorById({
                        id: repeatSection.repeat_category_id,
                        categories: categories.categories,
                        defaultColor: globalTheme.colors.foreground,
                      })}
                      iconRightName="ellipse"
                      iconRightColor={
                        repeatSection.repeat_status === "active"
                          ? globalTheme.colors.success
                          : globalTheme.colors.danger
                      }
                      iconRightSize={12}
                      rightLabel={utils.getFormattedNumber({
                        value: repeatSection.repeat_amount,
                        currency: utils.FindById.findLogbookById({
                          id: repeatSection.repeat_logbook_id,
                          logbooks: logbooks.logbooks,
                        }).logbook_currency?.name,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      })}
                      iconPack="IonIcons"
                      onPress={() => {
                        navigation.navigate(
                          screenList.repeatedTransactionDetailsScreen,
                          { repeatSection }
                        );
                      }}
                    />
                  );
                }
              )}
            </ListSection>
          </>
        </CustomScrollView>
      )}
      {!repeatedTransactions.repeatedTransactions.length && (
        <TouchableOpacity
          onPress={() => {
            if (
              !getSubscriptionLimit(
                userAccount.subscription.plan,
                SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS
              )
            ) {
              Alert.alert(
                "Upgrade to Premium",
                "You can create repeated transactions only in Premium Account",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Upgrade",
                    onPress: () =>
                      navigation.navigate(screenList.mySubscriptionScreen),
                  },
                ],
                { cancelable: false }
              );
            } else {
              navigation.navigate(screenList.newTransactionDetailsScreen);
            }
          }}
        >
          <View
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: globalTheme.colors.background,
            }}
          >
            <IonIcons
              name="repeat"
              color={globalTheme.colors.secondary}
              size={48}
              style={{
                // transform: [{ scaleX: -1 }],
                paddingBottom: 16,
              }}
            />
            <TextSecondary
              label={`You don't have repeated transactions yet.\n Start creating one`}
              style={{ textAlign: "center" }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <IonIcons
                name="add"
                size={18}
                color={globalTheme.colors.foreground}
              />
              <TextPrimary label="Create New Repeated Transaction" />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};
export default MyRepeatedTransactionsScreen;
