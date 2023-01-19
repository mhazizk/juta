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
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary, TextSecondary } from "../../../components/Text";

const EditRepeatedTransactionScreen = ({ route, navigation }) => {
  // TAG : useRef State //
  const inputNotes = useRef(null);
  const inputAmount = useRef(null);

  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
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

          <ListSection>
            {/* // TAG : Repeat start date */}
            <ListItem
              pressable
              iconPack="IonIcons"
              leftLabel="Repeat start date"
              iconLeftName="calendar"
              rightLabel={new Date(
                localRepeatedTransaction.repeat_start_date
              ).toDateString()}
              iconRightName="chevron-forward"
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
            />
            {/* // TAG : Repeat Frequency */}
            <ListItem
              pressable
              iconPack="IonIcons"
              leftLabel="Repeat Frequency"
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
                      //   transactions: [transaction.transaction_id],
                    });
                  },
                  default: localRepeatedTransaction.repeat_type,
                });
              }}
            />
            <TextPrimary
              label={
                "Next transaction : " +
                new Date(
                  localRepeatedTransaction.next_repeat_date
                ).toDateString()
              }
              style={{
                paddingVertical: 8,
                paddingHorizontal: 50,
              }}
            />
          </ListSection>
          <ListSection>
            <ButtonPrimary label="Save and apply for next repeated transactions" />
          </ListSection>
          <ListSection>
            <ButtonPrimary label="Save and apply for all repeated transactions" />
          </ListSection>
          <ListSection>
            <ButtonSecondaryDanger label="Delete all of this repeated transactions" />
          </ListSection>
          <ListSection>
            <ButtonSecondaryDanger label="Delete all of this previous repeated transactions" />
          </ListSection>
        </ScrollView>
      )}
    </>
  );
};

export default EditRepeatedTransactionScreen;
