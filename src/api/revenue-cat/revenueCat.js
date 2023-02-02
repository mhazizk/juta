import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import env from "../../config/env";
import SubscriptionTypeCard from "../../features/subscription/components/SubscriptionTypeCard";
import { useGlobalUserAccount } from "../../reducers/GlobalContext";
import firestore from "../firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../firebase/firestoreCollectionNames";
import getRevenueCatOfferings from "./getRevenueCatOfferings";

const RevenueCatMapOfferings = () => {
  const { userAccount } = useGlobalUserAccount();
  const [offerings, setOfferings] = useState(null);
  useEffect(() => {
    getRevenueCatOfferings()
      .then((offerings) => {
        // console.log(offerings);
        setOfferings(offerings.current.availablePackages.map((pkg) => pkg));
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      // console.log(customerInfo);
      console.log(customerInfo.activeSubscriptions);
      //   if (customerInfo.entitlements.active.premium !== undefined) {
      //     console.log("PURCHASED via listener");
      //     firestore.setData(FIRESTORE_COLLECTION_NAMES.USERS, userAccount.uid, {
      //       ...userAccount,
      //       subscription: {
      //         ...userAccount.subscription,
      //         active: true,
      //         date: Date.now(),
      //       },
      //     });
      //   }
    });
  }, []);

  return (
    <>
      {!offerings && <Loading />}
      {offerings &&
        offerings.map((offering) => {
          return (
            <ListSection>
              <ListItem
                pressable
                leftLabel={offering.identifier}
                onPress={async () => {
                  // Using Offerings/Packages
                  try {
                    const { customerInfo, productIdentifier } =
                      await Purchases.purchasePackage(offering);
                    if (
                      typeof customerInfo.entitlements.active.premium !==
                      "undefined"
                    ) {
                      // Unlock that great "pro" content
                      console.log("PURCHASED");
                      //   await firestore.setData(
                      //     FIRESTORE_COLLECTION_NAMES.USERS,
                      //     userAccount.uid,
                      //     {
                      //       ...userAccount,
                      //       subscription: {
                      //         ...userAccount.subscription,
                      //         active: true,
                      //         date: Date.now(),
                      //         expiry: offering.identifier.includes("monthly")
                      //           ? Date.now() + 1000 * 60 * 60 * 24 * 30
                      //           : Date.now() + 1000 * 60 * 60 * 24 * 365,
                      //         plan: `premium ${offering.identifier}`,
                      //       },
                      //     }
                      //   );
                    }
                  } catch (e) {
                    if (!e.userCancelled) {
                      console.log("ERROR", e);
                    }
                  }

                  //   // -----
                  //   // If you are NOT using Offerings/Packages:
                  //   await Purchases.purchaseProduct("product_id");

                  //   // Or, optionally provide the product type as the third parameter
                  //   // Defaults to PURCHASE_TYPE.SUBS
                  //   await Purchases.purchaseProduct(
                  //     "product_id",
                  //     null,
                  //     Purchases.PURCHASE_TYPE.INAPP
                  //   );
                }}
              />
            </ListSection>
          );
        })}
    </>
  );
};

export default RevenueCatMapOfferings;
