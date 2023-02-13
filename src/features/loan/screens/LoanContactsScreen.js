import { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import configureRevenueCat from "../../../api/revenue-cat/configureRevenueCat";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalLoan,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import Purchases from "react-native-purchases";
import { TextPrimary } from "../../../components/Text";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import loanContactModel from "../model/loanContactModel";
import screenList from "../../../navigations/ScreenList";

const LoanContactsScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
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
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                  }}
                >
                  <TextPrimary
                    label={`No contacts found\nStart adding contacts to create a loan`}
                  />
                </View>
              );
            }}
            renderItem={({ item }) => (
              <>
                {loanContacts.contacts.length > 0 && (
                  <>
                    <ListItem
                      pressable
                      leftLabel={item.name}
                      iconLeftName="account"
                      onPress={() => {
                        navigation.navigate(
                          screenList.loanContactPreviewScreen,
                          {
                            contact: item,
                          }
                        );
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

export default LoanContactsScreen;
