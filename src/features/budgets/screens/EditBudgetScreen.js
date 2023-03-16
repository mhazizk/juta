import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
import { TextPrimary, TextSecondary } from "../../../components/Text";
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
import BUDGET_SETTINGS_CONSTANTS from "../../../constants/budgetSettingsConstants";
import BUDGET_TYPE_CONSTANTS from "../../../constants/budgetTypeConstants";

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

  const inputBudgetName = useRef();

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
          <TouchableOpacity
            onPress={() => inputBudgetName.current.focus()}
            style={{
              minHeight: Dimensions.get("window").height / 2,
              minWidth: "100%",
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
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
                ref={inputBudgetName}
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
          </TouchableOpacity>

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
                        currencyCountryName:
                          appSettings.logbookSettings.defaultCurrency.name,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      })
                      .slice(0, 15) + "..."
                  : utils.getFormattedNumber({
                      value: patchBudget.limit,
                      currencyCountryName:
                        appSettings.logbookSettings.defaultCurrency.name,
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
                        currencyCountryName:
                          appSettings.logbookSettings.defaultCurrency.name,
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
          </ListSection>
          <ListSection>
            {/* // TAG : Budget type */}
            <ListItem
              pressable
              iconLeftName="pricetags"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Budget type"
              useRightLabelContainer
              rightLabel={
                BUDGET_TYPE_CONSTANTS.OPTIONS.find((budget) => {
                  return budget.id === patchBudget.budget_type;
                }).name
              }
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
                  modalType: MODAL_TYPE_CONSTANTS.LIST,
                  title: "Select budget type",
                  defaultOption:
                    BUDGET_TYPE_CONSTANTS.OPTIONS.find((budget) => {
                      return budget.id === patchBudget.budget_type;
                    }) || null,
                  props: BUDGET_TYPE_CONSTANTS.OPTIONS,
                  selected: (item) => {
                    const today = Date.now();
                    let startDateInMillis = patchBudget.start_date;
                    let finishDateInMillis = patchBudget.finish_date;
                    switch (item.id) {
                      case "YEARLY":
                        startDateInMillis = new Date(
                          new Date().getFullYear(),
                          0,
                          1,
                          0,
                          0,
                          0
                        ).getTime();
                        finishDateInMillis = utils.getNextDateInRange(
                          startDateInMillis,
                          "yearly"
                        );

                        break;
                      case "MONTHLY":
                        // startDate = utils.getFirstDateOfTheMonth(today).getTime();
                        startDateInMillis = new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          appSettings.budgetSettings.firstDateOfTheMonth,
                          0,
                          0,
                          0
                        ).getTime();

                        finishDateInMillis = utils.getNextDateInRange(
                          startDateInMillis,
                          "monthly"
                        );

                        break;
                      case "WEEKLY":
                        const getDay = new Date(today).getDay();
                        const userPreferredDayOfTheWeek =
                          BUDGET_SETTINGS_CONSTANTS.FIRST_DAY_OF_THE_WEEK.OPTIONS.findIndex(
                            (day) => {
                              return (
                                day ===
                                appSettings.budgetSettings.firstDayOfTheWeek
                              );
                            }
                          );
                        const different = userPreferredDayOfTheWeek - getDay;
                        startDateInMillis = new Date(
                          new Date().setDate(new Date().getDate() + different)
                        ).getTime();

                        finishDateInMillis = utils.getNextDateInRange(
                          startDateInMillis,
                          "weekly"
                        );
                        break;
                      case "CUSTOM":
                        break;

                      default:
                        break;
                    }
                    setPatchBudget({
                      ...patchBudget,
                      budget_type: item.id,
                      start_date: startDateInMillis,
                      finish_date: finishDateInMillis,
                    });
                  },
                });
              }}
            />
            {/* // TAG : Month to start */}
            {patchBudget.budget_type === "MONTHLY" && (
              <ListItem
                pressable
                iconLeftName="calendar"
                iconPack="IonIcons"
                iconRightName="chevron-forward"
                leftLabel="Month to start"
                useRightLabelContainer
                rightLabel={utils.upperCaseThisFirstLetter(
                  BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.find(
                    (month, index) => {
                      if (
                        index === new Date(patchBudget.start_date).getMonth()
                      ) {
                        return month;
                      }
                    }
                  )
                )}
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
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    title: "Select month to start",
                    props:
                      BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.map(
                        (budget, index) => {
                          return {
                            name: budget,
                            id: index,
                          };
                        }
                      ),
                    defaultOption: {
                      name: BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.find(
                        (month, index) => {
                          if (
                            index ===
                            new Date(patchBudget.start_date).getMonth()
                          ) {
                            return month;
                          }
                        }
                      ),
                    },
                    selected: (item) => {
                      const startDateInMillis = new Date(
                        new Date().getFullYear(),
                        BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.findIndex(
                          (month) => {
                            return month === item.name;
                          }
                        ),
                        appSettings.budgetSettings.firstDateOfTheMonth,
                        0,
                        0,
                        0
                      ).getTime();
                      setPatchBudget({
                        ...patchBudget,
                        start_date: startDateInMillis,
                        finish_date: utils.getNextDateInRange(
                          startDateInMillis,
                          "monthly"
                        ),
                      });
                    },
                  });
                }}
              />
            )}
          </ListSection>
          <ListSection>
            {/* // TAG : Start date */}
            <ListItem
              pressable={patchBudget.budget_type === "CUSTOM"}
              iconLeftName="calendar"
              iconPack="IonIcons"
              iconRightName={
                patchBudget.budget_type === "CUSTOM" ? "chevron-forward" : null
              }
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
                          setPatchBudget({
                            ...patchBudget,
                            start_date: dateInMillis,
                            finish_date: dateInMillis + 1000 * 60 * 60 * 24 * 1,
                          });
                        } else {
                          setPatchBudget({
                            ...patchBudget,
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
                          setPatchBudget({
                            ...patchBudget,
                            start_date: dateInMillis,
                            finish_date: dateInMillis + 1000 * 60 * 60 * 24 * 1,
                          });
                        } else {
                          setPatchBudget({
                            ...patchBudget,
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
              pressable={patchBudget.budget_type === "CUSTOM"}
              iconLeftName="calendar"
              iconPack="IonIcons"
              iconRightName={
                patchBudget.budget_type === "CUSTOM" ? "chevron-forward" : null
              }
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
                        patchBudget.start_date + 1000 * 60 * 60 * 24,
                      pickerStyle: "dateOnly",
                      callback: (dateInMillis) => {
                        setPatchBudget({
                          ...patchBudget,
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
                        patchBudget.start_date + 1000 * 60 * 60 * 24,
                      selected: (dateInMillis) => {
                        const dateAtMidnightInMillis = new Date(
                          dateInMillis
                        ).setHours(23, 59, 59, 999);
                        setPatchBudget({
                          ...patchBudget,
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

          {/* // TAG : Info  */}
          {patchBudget.budget_type !== "CUSTOM" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                // justifyContent: "flex-start",
                width: "100%",
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            >
              <IonIcons
                name="information-circle-outline"
                size={20}
                color={globalTheme.colors.secondary}
                style={{
                  paddingRight: 8,
                }}
              />
              <TextSecondary
                label="You can set your preferred start date at the Budget Settings section in Settings screen"
                style={{ flex: 1 }}
              />
            </View>
          )}

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
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
