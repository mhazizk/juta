import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSecondaryDanger,
} from "../../components/Button";
import { TextPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const EditBudgetScreen = ({ navigation, route }) => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [date, setDate] = useState(new Date());

  const [patchBudget, setPatchBudget] = useState(null);

  useEffect(() => {
    if (route.params.budget) {
      // setPatchBudget({
      //   uid: route.params.budget.uid,
      //   budget_id: route.params.budget.budget_id,
      //   budget_name: route.params.budget.budget_name,
      //   repeat: route.params.budget.repeat,
      //   limit: route.params.budget.limit,
      //   start_date: route.params.budget.start_date,
      //   finish_date: route.params.budget.finish_date,
      // });
      setPatchBudget(route.params.budget);
    }
  }, []);

  useEffect(() => {
    console.log(patchBudget);
  }, [patchBudget]);

  useEffect(() => {}, [budgets]);

  // TAG : Function Section

  // Set Date in Date Picker
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setPatchBudget({
      ...patchBudget,
      start_date: new Date(currentDate).getTime(),
    });
  };

  // Set Date in Date Picker
  const onChangeFinish = (event, selectedDate) => {
    const currentDate = selectedDate;
    setPatchBudget({
      ...patchBudget,
      finish_date: new Date(currentDate).getTime(),
    });
  };

  // Date Picker
  const showMode = ({ currentMode, mode }) => {
    DateTimePickerAndroid.open({
      value:
        mode === "start"
          ? new Date(patchBudget.start_date)
          : new Date(patchBudget.finish_date),
      onChange: mode === "start" ? onChangeStart : onChangeFinish,
      mode: currentMode,
      is24Hour: true,
      minimumDate:
        mode === "start"
          ? new Date().setHours(0, 0, 0, 0)
          : new Date(patchBudget.start_date + 1000 * 60 * 60 * 24),
    });
  };

  // Date Picker
  const showDatePicker = ({ mode }) => {
    showMode({ currentMode: "date", mode: mode });
  };

  const checkFinalBudget = () => {
    switch (true) {
      case !patchBudget.budget_name.length:
        return alert("Please enter a budget name");
      case !patchBudget.limit:
        return alert("Please enter a budget limit limit");
      case !patchBudget.start_date:
        return alert("Please select a budget start date");
      case !patchBudget.finish_date:
        return alert("Please select a budget finish date");

      default:
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.BUDGETS,
            patchBudget.budget_id,
            patchBudget
          );
        }, 1);
        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving Budget ...",
          loadingType: "patchBudget",
          patchBudget: patchBudget,
          reducerUpdatedAt: Date.now(),
          // initialBudgetPatchCounter: budgets.budgetPatchCounter,
        });
    }
  };

  return (
    <>
      {patchBudget && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingHorizontal: 16,
            }}
          >
            <FontAwesome5Icon
              name="piggy-bank"
              color={appSettings.theme.style.colors.foreground}
              size={48}
              style={{
                transform: [{ scaleX: -1 }],
                paddingBottom: 16,
              }}
            />
            <TextInput
              maxLength={30}
              textAlign="center"
              returnKeyType="done"
              placeholder="Type budget name ..."
              placeholderTextColor={
                appSettings.theme.style.text.textSecondary.color
              }
              style={[
                {
                  ...appSettings.theme.style.text.textPrimary,
                  paddingLeft: 0,
                  paddingVertical: 16,
                  minHeight: 24,
                  fontSize: 24,
                },
                {},
              ]}
              onChangeText={(string) => {
                setPatchBudget({
                  ...patchBudget,
                  budget_name: string,
                });
              }}
              clearButtonMode="while-editing"
              defaultValue={patchBudget.budget_name}
              value={patchBudget.budget_name}
            />
            {patchBudget.budget_name && (
              <IonIcons
                onPress={() =>
                  setPatchBudget({ ...patchBudget, budget_name: "" })
                }
                name="close-circle"
                size={20}
                style={{ padding: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
            )}
          </View>
          {/* // TAG : Budget Details */}
          <View style={{ paddingHorizontal: 16 }}>
            <TextPrimary label="Budget Details" style={{ fontSize: 24 }} />
          </View>

          {/* // TAG : Limit Section */}
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate(screenList.modalScreen, {
                modalType: "textInput",
                title: "Budget Limit",
                placeholder: "Enter budget limit ...",
                keyboardType: "numeric",
                inputType: "number",
                default: !patchBudget.limit
                  ? null
                  : utils.GetFormattedNumber({
                      value: patchBudget.limit,
                      currency:
                        appSettings.logbookSettings.defaultCurrency.name,
                    }),
                selected: (string) => {
                  const removedThousands = string
                    ? parseFloat(
                        parseFloat(string.replace(/[, ]/g, "")).toFixed(2)
                      )
                    : 0;
                  console.log({ removedThousands });
                  setPatchBudget({
                    ...patchBudget,
                    limit: removedThousands,
                  });
                },
              })
            }
          >
            <View style={appSettings.theme.style.list.listContainer}>
              <View
                style={{
                  ...appSettings.theme.style.list.listItem,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="cash"
                  size={18}
                  style={{ paddingRight: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
                {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                <TextPrimary label="Budget Limit" style={{ flex: 1 }} />

                {/* // TAG : Container */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      flex: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                ></View>
                {/* // TAG : Right Side */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      maxWidth: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      borderRadius: 8,
                    },
                    {
                      backgroundColor: appSettings.theme.style.colors.secondary,
                    },
                  ]}
                >
                  <TextSecondary
                    label={appSettings.logbookSettings.defaultCurrency.symbol}
                    style={{ paddingRight: 8 }}
                  />
                  <TextPrimary
                    label={
                      patchBudget.limit > 15
                        ? utils
                            .GetFormattedNumber({
                              value: patchBudget.limit,
                              currency:
                                appSettings.logbookSettings.defaultCurrency
                                  .name,
                            })
                            .slice(0, 15) + "..."
                        : utils.GetFormattedNumber({
                            value: patchBudget.limit,
                            currency:
                              appSettings.logbookSettings.defaultCurrency.name,
                          })
                    }
                    numberOfLines={1}
                  />
                </View>
                <IonIcons
                  name="chevron-forward"
                  size={18}
                  style={{ paddingLeft: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Start Date Section */}
          <TouchableNativeFeedback
            onPress={() => showDatePicker({ mode: "start" })}
          >
            <View style={appSettings.theme.style.list.listContainer}>
              <View
                style={{
                  ...appSettings.theme.style.list.listItem,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="calendar"
                  size={18}
                  style={{ paddingRight: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
                {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                <TextPrimary label="Start Date" style={{ flex: 1 }} />

                {/* // TAG : Container */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      flex: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                ></View>
                {/* // TAG : Right Side */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      maxWidth: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      borderRadius: 8,
                    },
                    {
                      backgroundColor: appSettings.theme.style.colors.secondary,
                    },
                  ]}
                >
                  <TextPrimary
                    label={new Date(patchBudget.start_date).toDateString()}
                    numberOfLines={1}
                  />
                </View>
                <IonIcons
                  name="chevron-forward"
                  size={18}
                  style={{ paddingLeft: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              </View>
            </View>
          </TouchableNativeFeedback>
          {/* // TAG : Finish Date Section */}
          <TouchableNativeFeedback
            onPress={() => showDatePicker({ mode: "finish" })}
          >
            <View style={appSettings.theme.style.list.listContainer}>
              <View
                style={{
                  ...appSettings.theme.style.list.listItem,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="calendar"
                  size={18}
                  style={{ paddingRight: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
                {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                <TextPrimary label="Finish Date" style={{ flex: 1 }} />

                {/* // TAG : Container */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      flex: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                ></View>
                {/* // TAG : Right Side */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      maxWidth: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      borderRadius: 8,
                    },
                    {
                      backgroundColor: appSettings.theme.style.colors.secondary,
                    },
                  ]}
                >
                  <TextPrimary
                    label={new Date(patchBudget.finish_date).toDateString()}
                    numberOfLines={1}
                  />
                </View>
                <IonIcons
                  name="chevron-forward"
                  size={18}
                  style={{ paddingLeft: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              </View>
            </View>
          </TouchableNativeFeedback>
          {/* // TAG : Repeat Section */}
          <TouchableNativeFeedback
            onPress={() =>
              setPatchBudget({ ...patchBudget, repeat: !patchBudget.repeat })
            }
          >
            <View style={appSettings.theme.style.list.listContainer}>
              <View
                style={{
                  ...appSettings.theme.style.list.listItem,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="repeat"
                  size={18}
                  style={{ paddingRight: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
                {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                <TextPrimary label="Repeat after finish" style={{ flex: 1 }} />

                {/* // TAG : Container */}
                <View
                  style={[
                    {
                      flexDirection: "row",
                      flex: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  {/* // TAG : Right Side */}
                  <View
                    style={{
                      backgroundColor: patchBudget.repeat
                        ? appSettings.theme.style.colors.primary
                        : "transparent",
                      height: 20,
                      width: 20,
                      borderColor: patchBudget.repeat
                        ? "transparent"
                        : appSettings.theme.style.colors.secondary,
                      borderWidth: 1,
                      borderRadius: 8,
                      marginRight: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IonIcons
                      name={patchBudget.repeat ? "checkmark-sharp" : undefined}
                      size={16}
                      color={appSettings.theme.style.colors.background}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Line Separator */}
          <View
            style={{
              borderColor: appSettings.theme.style.colors.secondary,
              borderBottomWidth: 1,
              height: 0,
              width: "80%",
              alignSelf: "center",
              paddingTop: 16,
            }}
          ></View>

          {/* // TAG : Action Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            {/* // TAG : Cancel Button */}
            {/* <View style={{ paddingRight: 8, flex: 1 }}>
              <ButtonSecondary
                label="Cancel"
                // width={150}
                onPress={() => navigation.goBack()}
              />
            </View> */}

            {/* // TAG : Delete Button */}
            <View style={{ flex: 1 }}>
              <ButtonSecondaryDanger
                label="Delete"
                // width={150}
                onPress={() =>
                  Alert.alert(
                    "Delete Budget",
                    "Are you sure you want to delete this budget?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          setTimeout(async () => {
                            await firestore.deleteData(
                              FIRESTORE_COLLECTION_NAMES.BUDGETS,
                              patchBudget.budget_id
                            );
                          }, 5000);

                          navigation.navigate(screenList.loadingScreen, {
                            label: "Deleting Budget...",
                            loadingType: "deleteBudget",
                            deleteBudget: patchBudget,
                            reducerUpdatedAt: Date.now(),
                            // initialBudgetDeleteCounter:
                            //   budgets.budgetDeleteCounter,
                          });
                        },
                      },
                    ],
                    { cancelable: false }
                  )
                }
              />
            </View>

            {/* // TAG : Save Button */}
            <View style={{ paddingLeft: 8, flex: 2 }}>
              <ButtonPrimary
                label="Save"
                // width={150}
                onPress={() => {
                  checkFinalBudget();
                }}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default EditBudgetScreen;
