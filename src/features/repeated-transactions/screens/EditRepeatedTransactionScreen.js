import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ButtonPrimary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import RadioButtonList from "../../../components/List/RadioButtonList";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";
import LOADING_TYPES from "../../../screens/modal/loading.type";

const EditRepeatedTransactionScreen = ({ route, navigation }) => {
  // TAG : useRef State //
  const inputNotes = useRef(null);
  const inputAmount = useRef(null);

  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { userAccount } = useGlobalUserAccount();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [apply, setApply] = useState({
    applyTo: "next",
    options: [
      { name: "Next repeated transactions only", value: "next" },
      { name: "All repeated transactions", value: "all" },
    ],
  });
  const [localRepeatedTransaction, setLocalRepeatedTransaction] =
    useState(null);

  useEffect(() => {
    if (route?.params?.repeatSection) {
      setLocalRepeatedTransaction(route.params.repeatSection);
      setSelectedCategory(
        utils.FindById.findCategoryById({
          id: route.params.repeatSection.repeat_category_id,
          categories: categories.categories,
          transaction: route.params.repeatSection,
        })
      );
      const logbook = utils.FindById.findLogbookById({
        id: route.params.repeatSection.repeat_logbook_id,
        logbooks: logbooks.logbooks,
      });
      setSelectedLogbook({
        ...logbook,
        name: logbook.logbook_name,
      });
    }
  }, []);

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    switch (event.type) {
      case "dismissed":
        break;
      case "set":
        setLocalRepeatedTransaction({
          ...localRepeatedTransaction,
          repeat_start_date: new Date(currentDate).getTime(),
          next_repeat_date:
            new Date(currentDate).getTime() +
            localRepeatedTransaction.repeat_type.range *
              (localRepeatedTransaction.transactions.length + 1),
        });
        break;
      case "neutralButtonPressed":
        const now = Date.now();
        setLocalRepeatedTransaction({
          ...localRepeatedTransaction,
          repeat_start_date: now,
          next_repeat_date:
            now +
            localRepeatedTransaction.repeat_type.range *
              (localRepeatedTransaction.transactions.length + 1),
        });
        break;

      default:
        break;
    }
  };

  // Set Date in Date Picker
  const onChangeFinish = (event, selectedDate) => {
    const currentDate = selectedDate;
    switch (event.type) {
      case "dismissed":
        break;

      case "set":
        setLocalRepeatedTransaction({
          ...localRepeatedTransaction,
          repeat_finish_date: new Date(currentDate).getTime(),
        });
        break;

      case "neutralButtonPressed":
        setLocalRepeatedTransaction({
          ...localRepeatedTransaction,
          repeat_finish_date: null,
        });
        break;

      default:
        break;
    }
  };

  // Date Picker
  const showMode = ({ currentMode, mode }) => {
    DateTimePickerAndroid.open({
      value:
        mode === "start"
          ? new Date(localRepeatedTransaction.repeat_start_date)
          : new Date(localRepeatedTransaction.repeat_finish_date),
      onChange: mode === "start" ? onChangeStart : onChangeFinish,
      mode: currentMode,
      is24Hour: true,
      neutralButtonLabel: mode === "start" ? "today" : "forever",
      positiveButtonLabel: "select",
      minimumDate:
        mode === "start"
          ? //   ? new Date().setHours(0, 0, 0, 0)
            null
          : new Date(
              localRepeatedTransaction.repeat_start_date + 1000 * 60 * 60 * 24
            ),
    });
  };

  // Date Picker
  const showDatePicker = ({ mode }) => {
    showMode({ currentMode: "date", mode: mode });
  };

  return (
    <>
      {localRepeatedTransaction && selectedCategory && selectedLogbook && (
        <ScrollView
          contentContainerStyle={{
            minHeight: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          {/* // TAG : Amount Section */}
          <TouchableOpacity
            onPress={() => inputAmount.current.focus()}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: Dimensions.get("window").height / 3,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TextSecondary
                label={selectedLogbook.logbook_currency.symbol}
                style={{
                  paddingRight: 8,
                  color:
                    localRepeatedTransaction.repeat_in_out === "income"
                      ? appSettings.theme.style.colors.incomeSymbol
                      : appSettings.theme.style.text.textSecondary.color,
                }}
              />
              <TextInput
                ref={inputAmount}
                maxLength={20}
                textAlign="center"
                returnKeyType="done"
                keyboardType="number-pad"
                // placeholder={Intl.NumberFormat("en-US", {
                //   style: "decimal",
                //   minimumFractionDigits: 2,
                //   maximumFractionDigits: 2,
                // }).format(transaction.details.amount)}
                // placeholderTextColor={
                //   appSettings.theme.style.text.textSecondary.color
                // }
                placeholder={utils.GetFormattedNumber({
                  value: localRepeatedTransaction.repeat_amount,
                  currency: appSettings.logbookSettings.defaultCurrency.name,
                })}
                placeholderTextColor={
                  appSettings.theme.style.text.textSecondary.color
                }
                style={[
                  {
                    ...appSettings.theme.style.text.textPrimary,
                    paddingLeft: 0,
                    paddingVertical: 16,
                    paddingRight: 16,
                    minHeight: 36,
                    fontSize: 36,
                  },
                  {
                    color:
                      localRepeatedTransaction.repeat_in_out === "income"
                        ? appSettings.theme.style.colors.incomeAmount
                        : appSettings.theme.style.text.textPrimary.color,
                  },
                ]}
                onChangeText={(string) => {
                  let float = 0;
                  if (string) {
                    // console.log({ string });
                    float = utils.RemoveNumberSeparator({
                      value: string,
                      currency: selectedLogbook.logbook_currency.name,
                    });
                  }
                  setLocalRepeatedTransaction({
                    ...localRepeatedTransaction,
                    repeat_amount: float,
                  });
                }}
                clearButtonMode="while-editing"
                defaultValue={utils.GetFormattedNumber({
                  value: localRepeatedTransaction.repeat_amount,
                  currency: selectedLogbook.logbook_currency.name,
                })}
                value={utils.GetFormattedNumber({
                  value: localRepeatedTransaction.repeat_amount,
                  currency: selectedLogbook.logbook_currency.name,
                })}
              />
            </View>
            {localRepeatedTransaction?.repeat_amount !== 0 && (
              <IonIcons
                onPress={() =>
                  setLocalRepeatedTransaction({
                    ...localRepeatedTransaction,
                    repeat_amount: 0,
                  })
                }
                name="close-circle"
                size={20}
                style={{ padding: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
            )}
          </TouchableOpacity>
          {/* // TAG : Apply Changes */}
          <TextPrimary
            label="Transaction Details"
            style={{
              paddingVertical: 8,
              paddingHorizontal: 32,
            }}
          />
          <ListSection>
            {/* // TAG : Repeat status */}
            <ListItem
              pressable
              leftLabel="Status"
              iconLeftName="ellipse"
              iconLeftColor={
                localRepeatedTransaction.repeat_status === "active"
                  ? appSettings.theme.style.colors.success
                  : appSettings.theme.style.colors.danger
              }
              iconPack="IonIcons"
              rightLabel={
                localRepeatedTransaction?.repeat_status[0].toUpperCase() +
                localRepeatedTransaction?.repeat_status.slice(1)
              }
              iconRightName="chevron-forward"
              iconColorInContainer={
                localRepeatedTransaction.repeat_status === "active"
                  ? appSettings.theme.style.colors.success
                  : appSettings.theme.style.colors.danger
              }
              useRightLabelContainer
              iconInRightContainerName="ellipse"
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor:
                  localRepeatedTransaction.repeat_in_out === "income"
                    ? "#c3f4f4"
                    : appSettings.theme.style.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  localRepeatedTransaction.repeat_in_out === "income"
                    ? "#00695c"
                    : appSettings.theme.style.text.textPrimary.color,
              }}
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Status",
                  modalType: "list",
                  mainButtonLabel: "Select",
                  props: [
                    {
                      name: "active",
                      repeat_status: "active",
                      icon: {
                        name: "ellipse",
                        color: appSettings.theme.style.colors.success,
                        pack: "IonIcons",
                      },
                    },
                    {
                      name: "inactive",
                      repeat_status: "inactive",
                      icon: {
                        name: "ellipse",
                        color: appSettings.theme.style.colors.danger,
                        pack: "IonIcons",
                      },
                    },
                  ],

                  iconProps: {
                    name: "ellipse",
                    pack: "IonIcons",
                  },
                  selected: (item) => {
                    setLocalRepeatedTransaction({
                      ...localRepeatedTransaction,
                      repeat_status: item.repeat_status,
                    });
                  },
                  default: { name: localRepeatedTransaction.repeat_status },
                })
              }
            />
          </ListSection>
          <ListSection>
            {/* // TAG : In Logbook */}
            <ListItem
              pressable
              leftLabel="In Logbook"
              rightLabel={
                !selectedLogbook?.name
                  ? "Pick Logbook"
                  : selectedLogbook?.name[0].toUpperCase() +
                    selectedLogbook?.name?.substring(1)
              }
              iconPack="IonIcons"
              iconLeftName="book"
              iconRightName="chevron-forward"
              useRightLabelContainer
              //   iconInRightContainerName='book'
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor:
                  localRepeatedTransaction.repeat_in_out === "income"
                    ? "#c3f4f4"
                    : appSettings.theme.style.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  localRepeatedTransaction.repeat_in_out === "income"
                    ? "#00695c"
                    : appSettings.theme.style.text.textPrimary.color,
              }}
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Logbooks",
                  modalType: "list",
                  mainButtonLabel: "Select",
                  props: logbooks.logbooks.map((logbook) => {
                    return {
                      name: logbook.logbook_name,
                      logbook_id: logbook.logbook_id,
                      logbook_currency: logbook.logbook_currency,
                    };
                  }),

                  iconProps: {
                    name: "book",
                    pack: "IonIcons",
                  },
                  selected: (item) => {
                    setSelectedLogbook({
                      name: item.name,
                      logbook_id: item.logbook_id,
                      logbook_currency: item.logbook_currency,
                    });
                    setLocalRepeatedTransaction({
                      ...localRepeatedTransaction,
                      repeat_logbook_id: item.logbook_id,
                    });
                  },
                  default: { name: selectedLogbook?.name },
                })
              }
            />

            {/* // TAG : Category */}
            <ListItem
              pressable
              leftLabel="Category"
              rightLabel={
                selectedCategory?.name
                  ? selectedCategory?.name[0].toUpperCase() +
                    selectedCategory?.name.substring(1)
                  : "Pick Category"
              }
              iconPack="IonIcons"
              iconLeftName="pricetags"
              iconRightName="chevron-forward"
              useRightLabelContainer
              iconInRightContainerName={selectedCategory?.icon?.name}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor:
                  localRepeatedTransaction?.repeat_in_out === "income"
                    ? "#c3f4f4"
                    : appSettings.theme.style.colors.secondary,
              }}
              iconColorInContainer={
                selectedCategory?.icon?.color === "default"
                  ? appSettings.theme.style.colors.foreground
                  : selectedCategory?.icon?.color
                // transaction.details.in_out === "income"
                //   ? "#00695c"
                //   : appSettings.theme.style.text.textPrimary.color
              }
              rightLabelStyle={{
                color:
                  localRepeatedTransaction?.repeat_in_out === "income"
                    ? "#00695c"
                    : appSettings.theme.style.text.textPrimary.color,
              }}
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Category",
                  modalType: "list",
                  mainButtonLabel: "Select",
                  props:
                    localRepeatedTransaction?.repeat_in_out === "expense"
                      ? categories?.categories.expense
                      : categories?.categories.income,
                  selected: (item) => {
                    setSelectedCategory(item);
                    setLocalRepeatedTransaction({
                      ...localRepeatedTransaction,
                      repeat_category_id: item.id,
                    });
                  },
                  default: selectedCategory,
                })
              }
            />
          </ListSection>
          <ListSection>
            {/* // TAG : Notes Section */}
            <TouchableNativeFeedback onPress={() => inputNotes.current.focus()}>
              <View style={appSettings.theme.style.list.listContainer}>
                <IonIcons
                  name="document-text"
                  size={18}
                  style={{ paddingRight: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextPrimary label="Notes" style={{ flex: 1 }} />

                  {/* // TAG : Notes Input */}
                  <TextInput
                    ref={inputNotes}
                    textAlign="right"
                    returnKeyType="done"
                    keyboardType="default"
                    placeholder="Add additional notes ..."
                    placeholderTextColor={
                      appSettings.theme.style.text.textSecondary.color
                    }
                    style={{
                      ...appSettings.theme.style.text.textPrimary,
                      flex: 5,
                      height: 48,
                      borderRadius: 8,
                      fontSize: 16,
                    }}
                    onChangeText={(string) => {
                      setLocalRepeatedTransaction({
                        ...localRepeatedTransaction,
                        repeat_notes: string,
                      });
                    }}
                    clearButtonMode="while-editing"
                    defaultValue={localRepeatedTransaction.repeat_notes}
                    value={localRepeatedTransaction.repeat_notes}
                  />
                </View>
                {localRepeatedTransaction.repeat_notes && (
                  <IonIcons
                    onPress={() => {
                      setLocalRepeatedTransaction({
                        ...localRepeatedTransaction,
                        repeat_notes: "",
                      });
                    }}
                    name="close-circle"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                )}

                {/* </View> */}
                {/* <IonIcons name='pencil' size={18} style={{ paddingLeft: 16 }} /> */}
              </View>
            </TouchableNativeFeedback>
          </ListSection>
          {/* // TAG : Apply Changes */}
          <TextPrimary
            label="Apply changes to"
            style={{
              paddingVertical: 8,
              paddingHorizontal: 32,
            }}
          />
          <ListSection>
            <RadioButtonList
              items={apply.options.map((option) => {
                return {
                  name: option.name,
                  value: option.value,
                };
              })}
              selected={apply.applyTo}
              onChange={(item) => {
                setApply({
                  ...apply,
                  applyTo: item.value,
                });
              }}
            />
          </ListSection>

          <ListSection>
            {/* // TAG : Repeat start date */}
            <ListItem
              pressable
              disabled={apply.applyTo === "next"}
              iconPack="IonIcons"
              leftLabel="Repeat start date"
              iconLeftName="calendar"
              rightLabel={new Date(
                localRepeatedTransaction.repeat_start_date
              ).toDateString()}
              iconRightName="chevron-forward"
              onPress={() => {
                if (apply.applyTo === "all") {
                  showDatePicker({
                    mode: "start",
                  });
                }
              }}
            />
            {/* // TAG : Repeat finish date */}
            <ListItem
              pressable
              iconPack="IonIcons"
              leftLabel="Repeat finish date"
              iconLeftName="calendar"
              rightLabel={
                !localRepeatedTransaction.repeat_finish_date
                  ? "Forever"
                  : new Date(
                      localRepeatedTransaction.repeat_finish_date
                    ).toDateString()
              }
              iconRightName="chevron-forward"
              onPress={() => showDatePicker({ mode: "finish" })}
            />
            {/* // TAG : Repeat Frequency */}
            <ListItem
              pressable
              iconPack="IonIcons"
              leftLabel="Repeat frequency"
              iconLeftName="repeat"
              rightLabel={
                localRepeatedTransaction?.repeat_type.name[0].toUpperCase() +
                localRepeatedTransaction?.repeat_type.name.slice(1)
              }
              iconRightName="chevron-forward"
              onPress={() => {
                navigation.navigate(screenList.modalScreen, {
                  title: "Repeat Transaction",
                  modalType: "list",
                  mainButtonLabel: "Select",
                  iconProps: {
                    name: "repeat",
                    pack: "IonIcons",
                  },
                  props: [
                    // {
                    //   name: "no repeat",
                    //   id: "no_repeat",
                    //   range: 0,
                    // },
                    {
                      name: "every day",
                      id: "every_day",
                      range: 60 * 60 * 24 * 1000,
                    },
                    {
                      name: "every week",
                      id: "every_week",
                      range: 60 * 60 * 24 * 7 * 1000,
                    },
                    {
                      name: "every 2 weeks",
                      id: "every_2_weeks",
                      range: 60 * 60 * 24 * 14 * 1000,
                    },
                    {
                      name: "every month",
                      id: "every_month",
                      range: 60 * 60 * 24 * 30 * 1000,
                    },
                    {
                      name: "every year",
                      id: "every_year",
                      range: 60 * 60 * 24 * 365 * 1000,
                    },
                  ],
                  selected: (item) => {
                    // if (item.id === "no_repeat") {
                    //   setLocalRepeatedTransaction({
                    //     uid: userAccount.uid,
                    //     repeat_id: null,
                    //     repeat_type: item,
                    //     transactions: [],
                    //   });
                    // } else {
                    // }
                    setLocalRepeatedTransaction({
                      ...localRepeatedTransaction,
                      repeat_type: item,
                      next_repeat_date:
                        localRepeatedTransaction.repeat_start_date +
                        item.range *
                          (localRepeatedTransaction.transactions.length + 1),
                      //   transactions: [transaction.transaction_id],
                    });
                  },
                  default: localRepeatedTransaction.repeat_type,
                });
              }}
            />
            <TextPrimary
              label={`Next transaction : ${
                localRepeatedTransaction.next_repeat_date < Date.now()
                  ? new Date(
                      (
                        (Date.now() -
                          localRepeatedTransaction.repeat_start_date) /
                        localRepeatedTransaction.repeat_type.range
                      ).toFixed(0) *
                        localRepeatedTransaction.repeat_type.range +
                        localRepeatedTransaction.repeat_start_date
                    ).toDateString()
                  : new Date(
                      localRepeatedTransaction.next_repeat_date
                    ).toDateString()
              }`}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 50,
              }}
            />
          </ListSection>
          {apply.applyTo === "all" && (
            <>
              <ListSection>
                <View
                  style={
                    {
                      // paddingHorizontal: 16,
                    }
                  }
                >
                  <ListItem
                    iconLeftColor={appSettings.theme.style.colors.warn}
                    iconLeftName="warning"
                    leftLabel="Earlier logged transactions date will be adjusted to the new changes"
                  />
                  <ListItem
                    iconLeftColor={appSettings.theme.style.colors.warn}
                    iconLeftName="warning"
                    leftLabel={
                      route.params.repeatSection.transactions.length +
                      " transaction(s) will be affected"
                    }
                  />
                </View>
              </ListSection>
            </>
          )}

          {/* // TAG : Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 16,
              paddingBottom: 24,
              paddingHorizontal: 48,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondaryDanger
                label="Delete"
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Delete Repeated Transaction",
                    modalType: "list",
                    mainButtonLabel: "Delete",
                    iconProps: {
                      name: "trash",
                      //   color: appSettings.theme.style.colors.danger,
                      pack: "IonIcons",
                    },
                    props: [
                      {
                        name: "Stop and delete all repeated transactions",
                        id: "delete_all",
                      },
                      {
                        name: "Delete previous repeated transactions only",
                        id: "delete_previous",
                      },
                    ],
                    selected: (item) => {
                      setTimeout(() => {
                        handleDelete({
                          deleteId: item.id,
                          navigation,
                          groupSorted: sortedTransactions.groupSorted,
                          localRepeatedTransaction,
                          uid: userAccount.uid,
                        });
                      }, 1);
                    },
                    default: null,
                  });
                }}
              />
            </View>
            <View style={{ flex: 2, paddingRight: 8 }}>
              <ButtonPrimary
                label="Save and apply"
                onPress={() =>
                  handleSave({
                    uid: userAccount.uid,
                    applyTo: apply.applyTo,
                    localRepeatedTransaction,
                    navigation,
                    groupSorted: sortedTransactions.groupSorted,
                  })
                }
              />
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default EditRepeatedTransactionScreen;

const handleDelete = ({
  deleteId,
  navigation,
  groupSorted,
  localRepeatedTransaction,
  uid,
}) => {
  let opt;
  let transactionsToBeDeleted = [];

  localRepeatedTransaction.transactions.forEach((transactionId) => {
    groupSorted.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (transaction.transaction_id === transactionId) {
            transactionsToBeDeleted.push(transaction);
          }
        });
      });
    });
  });

  switch (true) {
    case deleteId === "delete_all":
      opt = {
        label: "Deleting ...",
        loadingType:
          LOADING_TYPES.REPEATED_TRANSACTIONS
            .DELETE_THIS_ONE_AND_ALL_TRANSACTIONS_INSIDE,
        repeatedTransaction: localRepeatedTransaction,
        deletedTransactions: transactionsToBeDeleted,
        reducerUpdatedAt: Date.now(),
      };
      break;

    case deleteId === "delete_previous":
      opt = {
        label: "Deleting ...",
        loadingType:
          LOADING_TYPES.REPEATED_TRANSACTIONS
            .DELETE_PREVIOUS_TRANSACTIONS_INSIDE_THIS_ONE,
        repeatedTransaction: {
          ...localRepeatedTransaction,
          transactions: [],
          _timestamps: {
            ...localRepeatedTransaction._timestamps,
            updated_at: Date.now(),
            updated_by: uid,
          },
        },
        deletedTransactions: transactionsToBeDeleted,
        reducerUpdatedAt: Date.now(),
      };
      break;
    default:
      break;
  }
  navigation.navigate(screenList.loadingScreen, opt);
};

const handleSave = ({
  uid,
  applyTo,
  localRepeatedTransaction,
  navigation,
  groupSorted,
}) => {
  const repeatSection = {
    ...localRepeatedTransaction,
    _timestamps: {
      ...localRepeatedTransaction._timestamps,
      updated_at: Date.now(),
      updated_by: uid,
    },
  };
  switch (true) {
    case applyTo === "next":
      navigation.navigate(screenList.loadingScreen, {
        label: "Saving ...",
        loadingType: LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_NEXT,
        repeatedTransaction: repeatSection,
        reducerUpdatedAt: Date.now(),
      });
      break;

    case applyTo === "all":
      const existingTransactionsInSection = [];
      //   find all transactions that are in the repeat section to be patched
      groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (transaction.repeat_id === repeatSection.repeat_id) {
              existingTransactionsInSection.push(transaction);
            }
          });
        });
      });

      //   sort transactions by date
      existingTransactionsInSection.sort((a, b) => {
        return a.details.date - b.details.date;
      });

      //   get number of transactions to be logged
      const numberOfTransactionsToBeLogged = (
        (Date.now() - repeatSection.repeat_start_date) /
        repeatSection.repeat_type.range
      ).toFixed(0);

      const existingTransactionsLength = existingTransactionsInSection.length;
      const newTransactionsLength =
        numberOfTransactionsToBeLogged - existingTransactionsLength;

      const newInsertedTransactions = [];
      const newPatchedTransactions = [];
      const newDeletedTransactions = [];

      switch (true) {
        case newTransactionsLength <= 0:
          //   patch all existing transactions
          for (let i = 0; i < existingTransactionsLength; i++) {
            // const n = i + 1;
            const n = i;

            const transaction = existingTransactionsInSection[i];
            const patchedTransaction = {
              ...transaction,
              logbook_id: repeatSection.repeat_logbook_id,
              details: {
                ...transaction.details,
                amount: repeatSection.repeat_amount,
                category_id: repeatSection.repeat_category_id,
                in_out: repeatSection.repeat_in_out,
                notes: repeatSection.repeat_notes,
                date:
                  repeatSection.repeat_start_date +
                  n * repeatSection.repeat_type.range,
              },
              _timestamps: {
                ...transaction._timestamps,
                updated_at: Date.now(),
                updated_by: uid,
              },
            };

            if (patchedTransaction.details.date <= Date.now()) {
              newPatchedTransactions.push(patchedTransaction);
            } else {
              newDeletedTransactions.push(patchedTransaction);
            }
          }

          break;

        case newTransactionsLength > 0:
          //   patch existing transactions
          for (let i = 0; i < existingTransactionsLength; i++) {
            // const n = i + 1;
            const n = i;

            const transaction = existingTransactionsInSection[i];
            const patchedTransaction = {
              ...transaction,
              logbook_id: repeatSection.repeat_logbook_id,
              details: {
                ...transaction.details,
                amount: repeatSection.repeat_amount,
                category_id: repeatSection.repeat_category_id,
                in_out: repeatSection.repeat_in_out,
                notes: repeatSection.repeat_notes,
                date:
                  repeatSection.repeat_start_date +
                  n * repeatSection.repeat_type.range,
              },
              _timestamps: {
                ...transaction._timestamps,
                updated_at: Date.now(),
                updated_by: uid,
              },
            };

            newPatchedTransactions.push(patchedTransaction);
          }
          //   create new transactions
          for (let i = 0; i < newTransactionsLength; i++) {
            const n = i + existingTransactionsLength;

            const newTransaction = {
              uid,
              transaction_id: uuid.v4(),
              logbook_id: repeatSection.repeat_logbook_id,
              repeat_id: repeatSection.repeat_id,
              details: {
                type: repeatSection.repeat_transaction_type,
                amount: repeatSection.repeat_amount,
                category_id: repeatSection.repeat_category_id,
                in_out: repeatSection.repeat_in_out,
                notes: repeatSection.repeat_notes,
                date:
                  repeatSection.repeat_start_date +
                  n * repeatSection.repeat_type.range,
              },
              _timestamps: {
                created_at: Date.now(),
                created_by: uid,
                updated_at: Date.now(),
                updated_by: uid,
              },
            };

            newInsertedTransactions.push(newTransaction);
          }

          break;

        default:
          break;
      }

      // //   TODO : continue this to loading screen and reducer
      // console.log(
      //   JSON.stringify({
      //     newInsertedTransactions,
      //   })
      // );
      // console.log(
      //   JSON.stringify({
      //     newPatchedTransactions,
      //   })
      // );
      // console.log(
      //   JSON.stringify({
      //     newDeletedTransactions,
      //   })
      // );

      console.log({
        insert: newInsertedTransactions.length,
        patch: newPatchedTransactions.length,
        delete: newDeletedTransactions.length,
      });

      return navigation.navigate(screenList.loadingScreen, {
        label: "Saving ...",
        loadingType: LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_ALL,
        repeatedTransaction: {
          ...repeatSection,
          transactions: [
            ...newInsertedTransactions.map(
              (transaction) => transaction.transaction_id
            ),
            ...newPatchedTransactions.map(
              (transaction) => transaction.transaction_id
            ),
          ],
        },
        insertedTransactions: newInsertedTransactions,
        patchedTransactions: newPatchedTransactions,
        deletedTransactions: newDeletedTransactions,
        reducerUpdatedAt: Date.now(),
      });

    // TODO : continue 'next' case

    default:
      console.log("masuk default");
      break;
  }
};
