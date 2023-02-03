import { useEffect, useState } from "react";
import { FlatList, Platform } from "react-native";
import Purchases from "react-native-purchases";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import env from "../../config/env";
import PackageItem from "../../features/subscription/components/PackageItem";
import SubscriptionTypeCard from "../../features/subscription/components/SubscriptionTypeCard";
import { useGlobalUserAccount } from "../../reducers/GlobalContext";
import firestore from "../firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../firebase/firestoreCollectionNames";
import getRevenueCatOfferings from "./getRevenueCatOfferings";
import updateSubscriptionStatus from "./updateSubscriptionStatus";

const RevenueCatMapOfferings = () => {
  const { userAccount } = useGlobalUserAccount();
  const [offerings, setOfferings] = useState(null);
  useEffect(() => {
    getRevenueCatOfferings()
      .then((offerings) => {
        // console.log(offerings);
        setOfferings(offerings.current.availablePackages);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    // updateSubscriptionStatus(userAccount);
  }, []);

  return (
    <>
      {!offerings && <Loading />}
      {offerings && (
        <ListSection>
          <PackageItem
            onPress={() => {}}
            purchasePackage={{
              identifier: "free",
              product: {
                title: "Free",
                description: "Free",
                price: 0,
                priceString: "0",
              },
            }}
          />
          <FlatList
            data={offerings}
            keyExtractor={(item) => item?.identifier}
            renderItem={({ item }) => (
              <>
                {offerings && (
                  <PackageItem
                    purchasePackage={item}
                    //   yearlySaving={yearlySaving}
                    onPress={async () => {
                      // Using Offerings/Packages
                      try {
                        const { customerInfo, productIdentifier } =
                          await Purchases.purchasePackage(item);
                        if (
                          typeof customerInfo.entitlements.active.premium !==
                          "undefined"
                        ) {
                          // Unlock that great "pro" content
                          console.log("PURCHASED");
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.USERS,
                            userAccount.uid,
                            {
                              ...userAccount,
                              subscription: {
                                ...userAccount.subscription,
                                active: true,
                                date: Date.now(),
                                expiry: item.identifier.includes("monthly")
                                  ? Date.now() + 1000 * 60 * 60 * 24 * 30
                                  : Date.now() + 1000 * 60 * 60 * 24 * 365,
                                plan: `premium ${item.identifier}`,
                              },
                            }
                          );
                        }
                      } catch (e) {
                        if (!e.userCancelled) {
                          console.log("ERROR", e);
                        }
                      }
                    }}
                  />
                )}
              </>
            )}
          />
        </ListSection>
      )}
    </>
  );
};

export default RevenueCatMapOfferings;

// regex to find string between two underscore
// _.*?_
