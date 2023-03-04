import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Alert, Platform, TextInput, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import {
  ButtonPrimary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import * as utils from "../../../utils";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";

const EditBudgetScreen = ({ navigation, route }) => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [date, setDate] = useState(new Date());

  const [patchBudget, setPatchBudget] = useState(null);

  useEffect(() => {
    if (route.params.budget) {
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
        const finalPatchBudget = {
          ...patchBudget,
          _timestamps: {
            ...patchBudget._timestamps,
            updated_at: Date.now(),
            updated_by: userAccount.uid,
          },
        };
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.BUDGETS,
            finalPatchBudget.budget_id,
            finalPatchBudget
          );
        }, 5000);
        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving Budget...",
          loadingType: LOADING_TYPES.BUDGETS.PATCH_ONE,
          patchBudget: finalPatchBudget,
          reducerUpdatedAt: Date.now(),
        });
    }
  };

  return (
    <>
      {patchBudget && (
        <CustomScrollView>
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
              color={globalTheme.colors.foreground}
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
              placeholderTextColor={globalTheme.text.textSecondary.color}
              style={[
                {
                  ...globalTheme.text.textPrimary,
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
              clearButtonMode="never"
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
                color={globalTheme.colors.foreground}
              />
            )}
          </View>

          {/* // TAG : Budget Details */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary label="Budget Details" style={{ fontSize: 24 }} />
          </View>
          <ListSection>
            {/* // TAG : Budget limit */}
            <ListItem
              pressable
              iconLeftName="cash"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Budget limit"
              useRightLabelContainer
              rightLabel={`${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${
                patchBudget.limit.toString().length > 15
                  ? utils
                      .getFormattedNumber({
                        value: patchBudget.limit,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      })
                      .slice(0, 15) + "..."
                  : utils.getFormattedNumber({
                      value: patchBudget.limit,
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })
              }`}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              onPress={() => {
                navigation.navigate(screenList.modalScreen, {
                  modalType: MODAL_TYPE_CONSTANTS.TEXT_INPUT,
                  title: "Budget Limit",
                  placeholder: "Enter budget limit ...",
                  keyboardType: "numeric",
                  inputType: "number",
                  defaultOption: !patchBudget.limit
                    ? null
                    : utils.getFormattedNumber({
                        value: patchBudget.limit,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
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
                });
              }}
            />
            {/* // TAG : Start date */}
            <ListItem
              pressable
              iconLeftName="calendar"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Start date"
              useRightLabelContainer
              rightLabel={new Date(patchBudget.start_date).toDateString()}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              onPress={() => {
                const finishDate = utils.getCustomDate(patchBudget.finish_date);

                switch (Platform.OS) {
                  case "android":
                    return utils.datePicker({
                      initialDateInMillis: patchBudget.start_date,
                      pickerStyle: "dateOnly",
                      callback: (dateInMillis) => {
                        const startDate = utils.getCustomDate(dateInMillis);
                        if (startDate > finishDate) {
                          setNewBudget({
                            ...newBudget,
                            start_date: dateInMillis,
                            finish_date: dateInMillis + 1000 * 60 * 60 * 24 * 1,
                          });
                        } else {
                          setNewBudget({
                            ...newBudget,
                            start_date: dateInMillis,
                          });
                        }
                      },
                    });

                  case "ios":
                    return navigation.navigate(screenList.modalScreen, {
                      title: "Select date",
                      modalType: MODAL_TYPE_CONSTANTS.DATE_PICKER,
                      defaultOption: patchBudget.start_date,
                      minimumDateInMillis: new Date(
                        new Date().setHours(0, 0, 0, 0)
                      ).getTime(),
                      selected: (dateInMillis) => {
                        const startDate = utils.getCustomDate(dateInMillis);
                        if (startDate > finishDate) {
                          setNewBudget({
                            ...newBudget,
                            start_date: dateInMillis,
                            finish_date: dateInMillis + 1000 * 60 * 60 * 24 * 1,
                          });
                        } else {
                          setNewBudget({
                            ...newBudget,
                            start_date: dateInMillis,
                          });
                        }
                      },
                    });
                }
              }}
            />
            {/* // TAG : Finish date */}
            <ListItem
              pressable
              iconLeftName="calendar"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Finish date"
              useRightLabelContainer
              rightLabel={new Date(patchBudget.finish_date).toDateString()}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              onPress={() => {
                switch (Platform.OS) {
                  case "android":
                    return utils.datePicker({
                      initialDateInMillis: patchBudget.finish_date,
                      minimumDateInMillis:
                        newBudget.start_date + 1000 * 60 * 60 * 24,
                      pickerStyle: "dateOnly",
                      callback: (dateInMillis) => {
                        setNewBudget({
                          ...newBudget,
                          finish_date: dateInMillis,
                        });
                      },
                    });

                  case "ios":
                    return navigation.navigate(screenList.modalScreen, {
                      title: "Select date",
                      modalType: MODAL_TYPE_CONSTANTS.DATE_PICKER,
                      defaultOption: patchBudget.finish_date,
                      minimumDateInMillis:
                        newBudget.start_date + 1000 * 60 * 60 * 24,
                      selected: (dateInMillis) => {
                        const dateAtMidnightInMillis = new Date(
                          dateInMillis
                        ).setHours(23, 59, 59, 999);
                        setNewBudget({
                          ...newBudget,
                          finish_date: dateAtMidnightInMillis,
                        });
                      },
                    });
                }
              }}
            />
            {/* // TAG : Repeat */}
            {/* <CheckList
              singleChecklist
              pressable
              item={true}
              selected={patchBudget.repeat}
              primaryLabel="Repeat after finish"
              secondaryLabel="Automatically create new budget after finish date"
              checkboxPlacement="left"
              onPress={() => {
                setPatchBudget({ ...patchBudget, repeat: !patchBudget.repeat });
              }}
            /> */}
          </ListSection>

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Delete Button */}
            <View style={{ flex: 1 }}>
              <ButtonSecondaryDanger
                label="Delete"
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
                        text: "Delete",
                        onPress: () => {
                          setTimeout(async () => {
                            await firestore.deleteData(
                              FIRESTORE_COLLECTION_NAMES.BUDGETS,
                              patchBudget.budget_id
                            );
                          }, 5000);

                          navigation.navigate(screenList.loadingScreen, {
                            label: "Deleting Budget...",
                            loadingType: LOADING_TYPES.BUDGETS.DELETE_ONE,
                            deleteBudget: patchBudget,
                            reducerUpdatedAt: Date.now(),
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
                onPress={() => {
                  checkFinalBudget();
                }}
              />
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditBudgetScreen;
