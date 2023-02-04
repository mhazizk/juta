import { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import configureRevenueCat from "../../../api/revenue-cat/configureRevenueCat";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import Purchases from "react-native-purchases";
import { TextPrimary } from "../../../components/Text";
import Loading from "../../../components/Loading";

const SubscriptionHistoryScreen = () => {
  const { appSettings } = useGlobalAppSettings();
  const [subscriptionHistory, setSubscriptionHistory] = useState(null);
  useEffect(() => {
    configureRevenueCat();
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
      }
    );
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: appSettings.theme.style.colors.background,
        minHeight: "100%",
      }}
    >
      {!subscriptionHistory && <Loading />}
      {subscriptionHistory && (
        <ListSection>
          <FlatList
            data={subscriptionHistory}
            keyExtractor={(item) => item.productId}
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
                      <TextPrimary label={"Expiration date : " + item.expirationDate} />
                    </View>
                  </>
                )}
              </>
            )}
          />
        </ListSection>
      )}
    </ScrollView>
  );
};

export default SubscriptionHistoryScreen;
