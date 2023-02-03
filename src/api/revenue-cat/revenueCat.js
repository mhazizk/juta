import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import Purchases from "react-native-purchases";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import PackageItem from "../../features/subscription/components/PackageItem";
import { useGlobalUserAccount } from "../../reducers/GlobalContext";
import getRevenueCatOfferings from "./getRevenueCatOfferings";

const RevenueCatMapOfferings = () => {
  const { userAccount } = useGlobalUserAccount();
  const [offerings, setOfferings] = useState(null);
  const [yearlySaving, setYearlySaving] = useState(null);

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
    console.log(offerings);
  }, [offerings]);
  const a = [
    {
      identifier: "$rc_monthly",
      offeringIdentifier: "premium",
      packageType: "MONTHLY",
      product: {
        currencyCode: "IDR",
        description: "Monthly premium subscription",
        discounts: null,
        identifier: "juta_8.99_m",
        introPrice: null,
        price: 129000,
        priceString: "IDR 129,000.00",
        productCategory: "SUBSCRIPTION",
        productType: "AUTO_RENEWABLE_SUBSCRIPTION",
        subscriptionPeriod: "P1M",
        title: "Juta premium monthly subscription (Juta)",
      },
    },
    {
      identifier: "$rc_annual",
      offeringIdentifier: "premium",
      packageType: "ANNUAL",
      product: {
        currencyCode: "IDR",
        description: "Yearly premium subscription",
        discounts: null,
        identifier: "juta_89.99_y",
        introPrice: null,
        price: 1290000,
        priceString: "IDR 1,290,000.00",
        productCategory: "SUBSCRIPTION",
        productType: "AUTO_RENEWABLE_SUBSCRIPTION",
        subscriptionPeriod: "P1Y",
        title: "Juta premium yearly subscription (Juta)",
      },
    },
  ];
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

    const yearlySaving = monthlyPrice * 12 - yearlyPrice;
    setYearlySaving(yearlySaving);
  };

  return (
    <>
      {(!offerings || !yearlySaving) && <Loading />}
      {offerings && yearlySaving && (
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
                    yearlySaving={yearlySaving}
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
