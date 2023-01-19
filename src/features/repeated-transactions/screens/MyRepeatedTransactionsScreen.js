import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import screenList from "../../../navigations/ScreenList";

const MyRepeatedTransactionsScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();

  return (
    <>
      {repeatedTransactions.length > 0 && (
        <ScrollView
          style={{
            minHeight: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <>
            <TextPrimary
              label="Repeated Transactions"
              style={{
                paddingVertical: 16,
                paddingHorizontal: 32,
              }}
            />
            <ListSection>
              {repeatedTransactions.map((repeatSection) => {
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
                      defaultColor: appSettings.theme.style.colors.foreground,
                    })}
                    iconRightName="ellipse"
                    iconRightColor={
                      repeatSection.repeat_status === "active"
                        ? appSettings.theme.style.colors.success
                        : appSettings.theme.style.colors.danger
                    }
                    iconRightSize={12}
                    rightLabel={utils.GetFormattedNumber({
                      value: repeatSection.repeat_amount,
                      currency: utils.FindById.findLogbookById({
                        id: repeatSection.repeat_logbook_id,
                        logbooks: logbooks.logbooks,
                      }).logbook_currency?.name,
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
              })}
            </ListSection>
          </>
        </ScrollView>
      )}
      {!repeatedTransactions.length && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(screenList.newTransactionDetailsScreen);
          }}
        >
          <View
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: appSettings.theme.style.colors.background,
            }}
          >
            <IonIcons
              name="repeat"
              color={appSettings.theme.style.colors.secondary}
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
                color={appSettings.theme.style.colors.foreground}
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
