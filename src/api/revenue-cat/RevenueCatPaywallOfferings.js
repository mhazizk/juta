import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import Purchases from "react-native-purchases";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import PackageItem from "../../features/subscription/components/PackageItem";
import { useGlobalUserAccount } from "../../reducers/GlobalContext";
import getRevenueCatOfferings from "./getRevenueCatOfferings";

const RevenueCatPaywallOfferings = ({ onSuccess }) => {
  const { userAccount } = useGlobalUserAccount();
  const [offerings, setOfferings] = useState(null);
  const [monthToYearPrice, setMonthToYearPrice] = useState(null);

  useEffect(() => {
    try {
      getRevenueCatOfferings()
        .then((offerings) => {
          // console.log(offerings);
          setOfferings(offerings.current.availablePackages);
        })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (offerings) {
      getYearlySaving();
    }
    console.log(JSON.stringify({ offerings }, null, 2));
  }, [offerings]);
  const getYearlySaving = () => {
    // const yearlyPrice = subscriptionTypes.find((subscriptionType) => {
    //   return subscriptionType.id === "yearly";
    // }).price;
    const yearlyPrice = offerings.find((pkg) => {
      return pkg.product.identifier.includes("y");
    }).product.price;

    const monthlyPrice = offerings.find((pkg) => {
      return pkg.product.identifier.includes("m");
    }).product.price;

    const monthToYearPrice = monthlyPrice * 12;
    setMonthToYearPrice(monthToYearPrice);
  };

  return (
    <>
      {(!offerings || !monthToYearPrice) && <Loading />}
      {offerings && monthToYearPrice && (
        <ListSection>
          {/* <PackageItem
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
          /> */}
          <FlatList
            data={offerings}
            keyExtractor={(item) => item?.identifier}
            renderItem={({ item }) => (
              <>
                {offerings && (
                  <PackageItem
                    purchasePackage={item}
                    monthToYearPrice={monthToYearPrice}
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
                          onSuccess();
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

export default RevenueCatPaywallOfferings;
