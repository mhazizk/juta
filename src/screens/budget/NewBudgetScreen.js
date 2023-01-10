import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { TextInput, TouchableNativeFeedback, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const NewBudgetScreen = ({ navigation }) => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [date, setDate] = useState(new Date());

  const [newBudget, setNewBudget] = useState({
    uid: appSettings.uid,
    budget_id: Math.floor(Math.random() * 1000000000),
    budget_name: "Monthly Budget",
    repeat: false,
    limit: 0,
    start_date: +new Date().setHours(0, 0, 0, 0),
    finish_date: Date.now() + 2629746000,
  });

  useEffect(() => {
    console.log(newBudget);
  }, [newBudget]);

  // TAG : Function Section

  // Set Date in Date Picker
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setNewBudget({
      ...newBudget,
      start_date: new Date(currentDate).getTime(),
    });
  };

  // Set Date in Date Picker
  const onChangeFinish = (event, selectedDate) => {
    const currentDate = selectedDate;
    setNewBudget({
      ...newBudget,
      finish_date: new Date(currentDate).getTime(),
    });
  };

  // Date Picker
  const showMode = ({ currentMode, mode }) => {
    DateTimePickerAndroid.open({
      value:
        mode === "start"
          ? new Date(newBudget.start_date)
          : new Date(newBudget.finish_date),
      onChange: mode === "start" ? onChangeStart : onChangeFinish,
      mode: currentMode,
      is24Hour: true,
      minimumDate:
        mode === "start"
          ? new Date().setHours(0, 0, 0, 0)
          : new Date(newBudget.start_date),
    });
  };

  // Date Picker
  const showDatePicker = ({ mode }) => {
    showMode({ currentMode: "date", mode: mode });
  };

  const checkFinalBudget = () => {
    switch (true) {
      case !newBudget.budget_name.length:
        return alert("Please enter a budget name");
      case !newBudget.limit:
        return alert("Please enter a budget limit");
      case !newBudget.start_date:
        return alert("Please select a budget start date");
      case !newBudget.finish_date:
        return alert("Please select a budget finish date");

      default:
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.BUDGETS,
            newBudget.budget_id,
            newBudget
          );
        }, 1);
        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving Budget ...",
          loadingType: "insertBudget",
          insertBudget: newBudget,
          initialBudgetInsertCounter: budgets.budgetInsertCounter,
        });
    }
  };

  return (
    <>
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
              setNewBudget({
                ...newBudget,
                budget_name: string,
              });
            }}
            clearButtonMode="while-editing"
            defaultValue={newBudget.budget_name}
            value={newBudget.budget_name}
          />
          {newBudget.budget_name && (
            <IonIcons
              onPress={() => setNewBudget({ ...newBudget, budget_name: "" })}
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
              default: !newBudget.limit
                ? null
                : utils.GetFormattedNumber({
                    value: newBudget.limit,
                    currency: appSettings.logbookSettings.defaultCurrency.name,
                  }),
              selected: (string) => {
                const removedThousands = string
                  ? parseFloat(
                      parseFloat(string.replace(/[, ]/g, "")).toFixed(2)
                    )
                  : 0;
                console.log({ removedThousands });
                setNewBudget({
                  ...newBudget,
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
                  { backgroundColor: appSettings.theme.style.colors.secondary },
                ]}
              >
                <TextSecondary
                  label={appSettings.logbookSettings.defaultCurrency.symbol}
                  style={{ paddingRight: 8 }}
                />
                <TextPrimary
                  label={
                    newBudget.limit > 15
                      ? utils
                          .GetFormattedNumber({
                            value: newBudget.limit,
                            currency:
                              appSettings.logbookSettings.defaultCurrency.name,
                          })
                          .slice(0, 15) + "..."
                      : utils.GetFormattedNumber({
                          value: newBudget.limit,
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
                  { backgroundColor: appSettings.theme.style.colors.secondary },
                ]}
              >
                <TextPrimary
                  label={new Date(newBudget.start_date).toDateString()}
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
                  { backgroundColor: appSettings.theme.style.colors.secondary },
                ]}
              >
                <TextPrimary
                  label={new Date(newBudget.finish_date).toDateString()}
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
            setNewBudget({ ...newBudget, repeat: !newBudget.repeat })
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
                    backgroundColor: newBudget.repeat
                      ? appSettings.theme.style.colors.primary
                      : "transparent",
                    height: 20,
                    width: 20,
                    borderColor: newBudget.repeat
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
                    name={newBudget.repeat ? "checkmark-sharp" : undefined}
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
          {/* // TAG : cancel Button */}
          <View style={{ paddingRight: 8 }}>
            <ButtonSecondary
              label="Cancel"
              width={150}
              onPress={() => navigation.goBack()}
            />
          </View>

          {/* // TAG : Save Button */}
          <View style={{ paddingLeft: 8 }}>
            <ButtonPrimary
              label="Save"
              width={150}
              onPress={() => {
                checkFinalBudget();
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default NewBudgetScreen;
