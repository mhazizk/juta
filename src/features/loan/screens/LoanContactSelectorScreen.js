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

const LoanContactSelectorScreen = ({ route, navigation }) => {
  const { selected, defaultOption } = route.params;
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { globalTheme } = useGlobalTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { globalLoan } = useGlobalLoan();
  return (
    <CustomScrollView>
      {isLoading && <Loading />}
      {!isLoading && (
        <ListSection marginTop={16}>
          <FlatList
            data={globalLoan.contacts}
            keyExtractor={(item) => item.uid}
            ListEmptyComponent={() => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(screenList.newLoanContactScreen, {
                      fromScreen: screenList.loanContactSelectorScreen,
                      targetScreen: screenList.loanContactSelectorScreen,
                    })
                  }
                >
                  <View
                    style={{
                      height: "100%",
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
              );
            }}
            renderItem={({ item }) => (
              <>
                {loanContacts.contacts.length > 0 && (
                  <>
                    <ListItem
                      pressable
                      leftLabel={item.contact_name}
                      iconLeftName="account"
                      iconRightName={
                        item.contact_uid === defaultOption
                          ? "checkmark-circle"
                          : null
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
      )}
    </CustomScrollView>
  );
};

export default LoanContactSelectorScreen;
