import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
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

const NewBudgetScreen = ({ navigation }) => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  // const [date, setDate] = useState(new Date());

  const [newBudget, setNewBudget] = useState({
    uid: appSettings.uid,
    budget_id: uuid.v4(),
    budget_name: "Monthly Budget",
    repeat: false,
    limit: 0,
    start_date: +new Date().setHours(0, 0, 0, 0),
    finish_date: new Date(Date.now() + 2629746000).setHours(0, 0, 0, 0),
    _timestamps: {
      created_at: Date.now(),
      updated_at: Date.now(),
      created_by: userAccount.uid,
      updated_by: userAccount.uid,
    },
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
          : new Date(newBudget.start_date + 1000 * 60 * 60 * 24),
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
                modalType: "textInput",
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
          {/* // TAG : Start date */}
          <ListItem
            pressable
            iconLeftName="calendar"
            iconPack="IonIcons"
            iconRightName="chevron-forward"
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
              showDatePicker({ mode: "start" });
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
              showDatePicker({ mode: "finish" });
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
