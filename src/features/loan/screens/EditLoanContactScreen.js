import { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import ionIcons from "../../../assets/iconPacks/ionIcons";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoan,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import * as utils from "../../../utils";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";

const EditLoanContactScreen = ({ route, navigation }) => {
  const { fromScreen, targetScreen, loanContactTransactionDetails } =
    route.params;
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const [contact, setContact] = useState(route.params?.contact);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(globalLoan);
  }, []);

  const handleSave = () => {
    if (!contact.contact_name) {
      Alert.alert(
        "Contact name is required",
        "Please enter contact name",
        [
          {
            text: "OK",
            onPress: () => {
              inputRef.current.focus();
            },
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else {
      const newTimestamps = {
        ...globalLoan._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      };
      navigation.navigate(screenList.loadingScreen, {
        label: "Saving new contact...",
        loadingType: LOADING_TYPES.LOAN.PATCH_ONE_CONTACT,
        patchLoanContact: contact,
        loanContactTransactionDetails,
        targetScreen,
        newGlobalLoanTimestamps: newTimestamps,
      });
    }
  };

  const getLatestTransactionDate = (transactionDetails) => {
    let latestTransactionDate = 0;
    transactionDetails.forEach((transaction) => {
      if (transaction.details.date > latestTransactionDate) {
        latestTransactionDate = transaction.details.date;
      }
    });
    return latestTransactionDate;
  };

  return (
    <>
      {contact && (
        <CustomScrollView contentContainerStyle={{ flex: 1 }}>
          {/* // TAG : Contact Section */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingHorizontal: 16,
            }}
          >
            <IonIcons
              name="person"
              size={48}
              style={{ padding: 16 }}
              color={globalTheme.colors.foreground}
            />
            <TextInput
              ref={inputRef}
              maxLength={20}
              textAlign="center"
              returnKeyType="done"
              placeholder="Type contact name..."
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
                setContact({
                  ...contact,
                  contact_name: string,
                });
              }}
              clearButtonMode="while-editing"
              defaultValue={contact.contact_name}
              value={contact.contact_name}
            />

            {contact.contact_name && (
              <IonIcons
                onPress={() =>
                  setContact({
                    ...contact,
                    contact_name: "",
                  })
                }
                name="close-circle"
                size={20}
                style={{ padding: 16 }}
                color={globalTheme.colors.foreground}
              />
            )}
          </View>

          {/* // TAG : Contact Details */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary label="Contact Details" style={{ fontSize: 24 }} />
          </View>
          <ListSection>
            {/* // TAG : Contact Type Section */}
            <ListItem
              pressable
              iconLeftName="person"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Contact type"
              useRightLabelContainer
              rightLabel={
                contact.contact_type[0].toUpperCase() +
                contact.contact_type.substring(1)
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
                  title: "Contact type",
                  props: [
                    { name: "family" },
                    { name: "friend" },
                    { name: "colleague" },
                    { name: "individual" },
                    { name: "business" },
                    { name: "organization" },
                    { name: "non-profit" },
                    { name: "government" },
                  ],
                  modalType: MODAL_TYPE_CONSTANTS.LIST,
                  selected: (item) => {
                    setContact({
                      ...contact,
                      contact_type: item.name,
                    });
                  },
                  defaultOption: { name: contact.contact_type },
                });
              }}
            />
            {/* // TAG : Payment due date */}
            <ListItem
              pressable
              leftLabel="Payment due date"
              rightLabel={
                contact.payment_due_date
                  ? new Date(contact.payment_due_date).toDateString()
                  : "Not set yet"
              }
              iconPack="IonIcons"
              iconLeftName="calendar"
              iconRightName="chevron-forward"
              useRightLabelContainer
              // iconInRightContainerName='book'
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              rightLabelStyle={{
                color: globalTheme.text.textPrimary.color,
              }}
              onPress={() => {
                utils.datePicker({
                  minimumDateInMillis:
                    getLatestTransactionDate(loanContactTransactionDetails) ||
                    Date.now() + 1 * 24 * 60 * 60 * 1000,
                  initialDateInMillis:
                    getLatestTransactionDate(loanContactTransactionDetails) ||
                    Date.now() + 7 * 24 * 60 * 60 * 1000,
                  pickerStyle: "dateOnly",
                  callback: (dateInMillis) => {
                    setContact({
                      ...contact,
                      payment_due_date: dateInMillis,
                    });
                  },
                });
              }}
            />
          </ListSection>

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <ButtonSecondaryDanger
                label="Delete"
                onPress={() => {
                  Alert.alert(
                    "Delete contact",
                    `Are you sure you want to delete this contact?\nDeleting this contact will also delete all transactions associated with this contact.\nThis action cannot be undone.`,
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => {
                          navigation.navigate(screenList.loadingScreen, {
                            label: "Deleting contact...",
                            loadingType: LOADING_TYPES.LOAN.DELETE_ONE_CONTACT,
                            deleteLoanContact: contact,
                            deletedTransactions: loanContactTransactionDetails,
                            reducerUpdatedAt: Date.now(),
                            targetScreen: screenList.myLoansScreen,
                            newGlobalLoanTimestamps: {
                              ...globalLoan._timestamps,
                              updated_at: Date.now(),
                              updated_by: userAccount.uid,
                            },
                          });
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              />
            </View>

            {/* // TAG : Save Button */}
            <View style={{ flex: 2, paddingLeft: 8 }}>
              <ButtonPrimary
                label="Save"
                onPress={() => {
                  handleSave();
                }}
              />
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditLoanContactScreen;
