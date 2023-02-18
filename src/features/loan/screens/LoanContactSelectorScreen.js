import { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalLoan,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import screenList from "../../../navigations/ScreenList";
import IonIcons from "react-native-vector-icons/Ionicons";
import * as utils from "../../../utils";

const LoanContactSelectorScreen = ({ route, navigation }) => {
  const defaultOption = route.params?.defaultOption;
  const selected = route.params?.selected;
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { globalTheme } = useGlobalTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { globalLoan } = useGlobalLoan();
  return (
    <CustomScrollView>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {!globalLoan.contacts.length && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(screenList.newLoanContactScreen, {
                  fromScreen: screenList.loanContactSelectorScreen,
                  targetScreen: screenList.newTransactionDetailsScreen,
                })
              }
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcons
                  name="person-add"
                  color={globalTheme.colors.secondary}
                  size={48}
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextSecondary
                  label={`No contacts found\nStart adding contacts to create a loan`}
                  style={{ textAlign: "center" }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                  }}
                >
                  <IonIcons
                    name="add"
                    size={18}
                    color={globalTheme.colors.foreground}
                  />
                  <TextPrimary label="Create new contact" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {globalLoan.contacts.length > 0 && (
            <>
              <ListSection marginTop={16}>
                {/* // TAG : Loan contacts */}
                <FlatList
                  data={globalLoan.contacts}
                  keyExtractor={(item) => item.contact_uid}
                  renderItem={({ item }) => (
                    <>
                      {globalLoan.contacts.length > 0 && (
                        <>
                          <ListItem
                            pressable
                            leftLabel={item.contact_name}
                            iconLeftName="person"
                            iconPack="IonIcons"
                            iconRightName="checkmark-circle"
                            iconRightColor={
                              defaultOption === item.contact_uid
                                ? globalTheme.colors.foreground
                                : "transparent"
                            }
                            rightLabel={
                              (item.transactions_id?.length || "No") +
                              " transactions"
                            }
                            onPress={() => {
                              selected(item);
                              navigation.goBack();
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                />
              </ListSection>
            </>
          )}
        </>
      )}
    </CustomScrollView>
  );
};

export default LoanContactSelectorScreen;
