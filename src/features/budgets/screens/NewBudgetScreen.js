import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
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
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import uuid from "react-native-uuid";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import ListSection from "../../../components/List/ListSection";
import { ListItem } from "../../../components/List";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import BUDGET_TYPE_CONSTANTS from "../../../constants/budgetTypeConstants";
import BUDGET_SETTINGS_CONSTANTS from "../../../constants/budgetSettingsConstants";
import newBudgetModel from "../model/newBudgetModel";

const NewBudgetScreen = ({ navigation }) => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  const [newBudget, setNewBudget] = useState(() => {
    return newBudgetModel({
      appSettings,
      userAccountUid: userAccount.uid,
    });
  });

  const inputBudgetName = useRef();

  useEffect(() => {
    console.log(newBudget);
  }, [newBudget]);

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
        }, 5000);
        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving Budget...",
          loadingType: LOADING_TYPES.BUDGETS.INSERT_ONE,
          insertBudget: newBudget,
          reducerUpdatedAt: Date.now(),
        });
    }
  };

  return (
    <>
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
              placeholder="Type budget name..."
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
                setNewBudget({
                  ...newBudget,
                  budget_name: string,
                });
              }}
              clearButtonMode="never"
              defaultValue={newBudget.budget_name}
              value={newBudget.budget_name}
            />
            {newBudget.budget_name && (
              <IonIcons
                onPress={() => setNewBudget({ ...newBudget, budget_name: "" })}
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
              newBudget.limit.toString().length > 15
                ? utils
                    .getFormattedNumber({
                      value: newBudget.limit,
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })
                    .slice(0, 15) + "..."
                : utils.getFormattedNumber({
                    value: newBudget.limit,
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
                title: "Set budget limit",
                placeholder: "Enter budget limit ...",
                keyboardType: "numeric",
                inputType: "number",
                defaultOption: !newBudget.limit
                  ? null
                  : utils.getFormattedNumber({
                      value: newBudget.limit,
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
                  setNewBudget({
                    ...newBudget,
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
                return budget.id === newBudget.budget_type;
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
                    return budget.id === newBudget.budget_type;
                  }) || null,
                props: BUDGET_TYPE_CONSTANTS.OPTIONS,
                selected: (item) => {
                  const today = Date.now();
                  let startDateInMillis = newBudget.start_date;
                  let finishDateInMillis = newBudget.finish_date;
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
                  setNewBudget({
                    ...newBudget,
                    budget_type: item.id,
                    start_date: startDateInMillis,
                    finish_date: finishDateInMillis,
                  });
                },
              });
            }}
          />
          {/* // TAG : Month to start */}
          {newBudget.budget_type === "MONTHLY" && (
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
                    if (index === new Date(newBudget.start_date).getMonth()) {
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
                          index === new Date(newBudget.start_date).getMonth()
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
                    setNewBudget({
                      ...newBudget,
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
            pressable={newBudget.budget_type === "CUSTOM"}
            iconLeftName="calendar"
            iconPack="IonIcons"
            iconRightName={
              newBudget.budget_type === "CUSTOM" ? "chevron-forward" : null
            }
            leftLabel="Start date"
            useRightLabelContainer
            rightLabel={new Date(newBudget.start_date).toDateString()}
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
              const finishDate = utils.getCustomDate(newBudget.finish_date);

              switch (Platform.OS) {
                case "android":
                  return utils.datePicker({
                    initialDateInMillis: newBudget.start_date,
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
                    defaultOption: newBudget.start_date,
                    // minimumDateInMillis: new Date(
                    //   new Date().setHours(0, 0, 0, 0)
                    // ).getTime(),
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
            pressable={newBudget.budget_type === "CUSTOM"}
            iconLeftName="calendar"
            iconPack="IonIcons"
            iconRightName={
              newBudget.budget_type === "CUSTOM" ? "chevron-forward" : null
            }
            leftLabel="Finish date"
            useRightLabelContainer
            rightLabel={new Date(newBudget.finish_date).toDateString()}
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
                    initialDateInMillis: newBudget.finish_date,
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
                    defaultOption: newBudget.finish_date,
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
            selected={newBudget.repeat}
            primaryLabel="Repeat after finish"
            secondaryLabel="Automatically create new budget after finish date"
            checkboxPlacement="left"
            onPress={() => {
              setNewBudget({ ...newBudget, repeat: !newBudget.repeat });
            }}
          /> */}
        </ListSection>

        {/* // TAG : Info  */}
        {newBudget.budget_type !== "CUSTOM" && (
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
          {/* // TAG : Cancel Button */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <ButtonSecondary
              label="Cancel"
              onPress={() => navigation.goBack()}
            />
          </View>

          {/* // TAG : Save Button */}
          <View style={{ flex: 2, paddingLeft: 8 }}>
            <ButtonPrimary
              label="Save"
              onPress={() => {
                checkFinalBudget();
              }}
            />
          </View>
        </ActionButtonWrapper>
      </CustomScrollView>
    </>
  );
};

export default NewBudgetScreen;
