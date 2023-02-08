import { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import configureRevenueCat from "../../../api/revenue-cat/configureRevenueCat";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import Purchases from "react-native-purchases";
import { TextPrimary } from "../../../components/Text";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const SubscriptionHistoryScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionHistory, setSubscriptionHistory] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    configureRevenueCat(userAccount.uid);
    Promise.all([Purchases.getCustomerInfo(), Purchases.getOfferings()]).then(
      (data) => {
        const info = data[0];
        const {
          current: { availablePackages },
        } = data[1];
        // current.availablePackages;
        const allPurchaseDates = info.allPurchaseDates;
        const allExpirationDates = info.allExpirationDates;
        const merge = Object.keys(allPurchaseDates).map((key) => {
          return {
            productId: key,
            productName: availablePackages.find((pkg) => {
              return pkg.product.identifier === key;
            }).product.description,
            purchaseDate: new Date(allPurchaseDates[key]).toDateString(),
            expirationDate: new Date(allExpirationDates[key]).toDateString(),
          };
        });
        console.log(merge);
        setSubscriptionHistory(merge);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <CustomScrollView>
      {isLoading && <Loading />}
      {!isLoading && (
        <ListSection marginTop={16}>
          <FlatList
            data={subscriptionHistory}
            keyExtractor={(item) => item.productId}
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
                  <TextPrimary label={"No subscription history found"} />
                </View>
              );
            }}
            renderItem={({ item }) => (
              <>
                {subscriptionHistory && (
                  <>
                    <View
                      style={{
                        padding: 16,
                      }}
                    >
                      <TextPrimary
                        label={item.productName}
                        style={{
                          fontWeight: "bold",
                        }}
                      />
                      <TextPrimary
                        label={"Purchase date : " + item.purchaseDate}
                      />
                      <TextPrimary
                        label={"Expiration date : " + item.expirationDate}
                      />
                    </View>
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

export default SubscriptionHistoryScreen;
