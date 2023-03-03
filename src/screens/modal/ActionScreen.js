import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalFeatureSwitch,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import FEATURE_NAME from "../../features/subscription/model/featureName";
import getFeatureLimit from "../../features/subscription/logic/getFeatureLimit";
import createNewLogbookAndSyncToFirestore from "../../features/logbook/model/createNewLogbookAndSyncToFirestore";
import ActionButtonWrapper from "../../components/ActionButtonWrapper";

const ActionScreen = ({ route, navigation }) => {
  const [selected, setSelected] = useState();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { userAccount } = useGlobalUserAccount();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();

  useEffect(() => {
    // refresh
    // console.log(selected)
  }, [selected]);

  useEffect(() => {
    setSelected(route?.params?.default);
  }, []);

  return (
    <>
      {/* // TAG : Transparent Overlay */}
      <TouchableOpacity
        onPress={() => navigation.pop(1)}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}></View>
      </TouchableOpacity>

      {/* // TAG : Content card */}
      <View
        style={{
          backgroundColor: globalTheme.colors.background,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          maxHeight: "50%",
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,

          // flex:1
        }}
      >
        <View style={{ paddingTop: 16 }}>
          <TextPrimary label="New" style={{ fontSize: 24 }} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 300,
            paddingBottom: 16,
          }}
        >
          {/* // TAG : New Transaction */}
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                if (logbooks.logbooks.length < 1) {
                  Alert.alert(
                    "No logbooks found",
                    "Uh, oh, looks like you dont have any logbook to log your new transaction. Create new logbook first",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Create new logbook",
                        onPress: () => {
                          return navigation.navigate(screenList.modalScreen, {
                            modalType: "textInput",
                            title: "Create new logbook",
                            placeholder: "Enter new logbook name...",
                            selected: (item) => {
                              createNewLogbookAndSyncToFirestore({
                                dispatchLogbooks,
                                dispatchSortedTransactions,
                                logbookName: item,
                                uid: userAccount.uid,
                                defaultCurrency:
                                  appSettings.logbookSettings.defaultCurrency,
                              });

                              navigation.goBack();
                            },
                          });
                        },
                      },
                    ]
                  );
                } else {
                  navigation.goBack();
                  navigation.navigate(screenList.newTransactionDetailsScreen);
                }
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  // backgroundColor: globalTheme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="pencil"
                    size={48}
                    color={globalTheme.bottomTab.actionButton.backgroundColor}
                  />
                </View>
                <TextPrimary label="Transaction" />
              </View>
            </TouchableOpacity>
          </View>

          {/* // TAG : New Logbook */}
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                navigation.goBack();
                // get logbook limit from subscription plan
                const logbookLimit = getFeatureLimit({
                  globalFeatureSwitch,
                  featureName: FEATURE_NAME.LOGBOOKS,
                  subscriptionPlan: userAccount.subscription.plan,
                });

                // check if user has reached the limit
                if (logbooks.logbooks?.length >= logbookLimit) {
                  // show alert
                  Alert.alert(
                    "Logbook Limit Reached",
                    `You have reached the limit of ${logbookLimit} logbooks. Please upgrade your subscription to add more logbooks.`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Upgrade",
                        onPress: () => {
                          navigation.navigate(screenList.mySubscriptionScreen);
                        },
                      },
                    ]
                  );
                } else {
                  navigation.navigate(screenList.modalScreen, {
                    modalType: "textInput",
                    title: "Create new logbook",
                    placeholder: "Enter new logbook name...",
                    selected: (item) => {
                      createNewLogbookAndSyncToFirestore({
                        dispatchLogbooks,
                        dispatchSortedTransactions,
                        logbookName: item,
                        uid: userAccount.uid,
                        defaultCurrency:
                          appSettings.logbookSettings.defaultCurrency,
                      });
                      navigation.goBack();
                    },
                  });
                }
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  // backgroundColor: globalTheme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="book"
                    size={48}
                    color={globalTheme.bottomTab.actionButton.backgroundColor}
                  />
                </View>
                <TextPrimary label="Logbook" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* // TAG : Action Button */}
        <ActionButtonWrapper>
          {/* // TAG : Cancel Button */}
          <View style={{ paddingRight: 0 }}>
            <ButtonSecondary
              label="Cancel"
              width={284}
              onPress={() => navigation.goBack()}
            />
          </View>
        </ActionButtonWrapper>
      </View>
    </>
  );
};

export default ActionScreen;
