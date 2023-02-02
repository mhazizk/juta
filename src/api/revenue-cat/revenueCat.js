import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import env from "../../config/env";
import SubscriptionTypeCard from "../../features/subscription/components/SubscriptionTypeCard";

const configByPlatform = async () => {
  if (Platform.OS == "android") {
    return Purchases.configure({ apiKey: env.revenueCat.googleApiKey });
  } else {
    return;
    // await Purchases.configure({ apiKey: APIKeys.apple });
  }
};

const getOfferingsFromRC = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings;
};

const RevenueCatMapOfferings = ({ onPress }) => {
  const [offerings, setOfferings] = useState(null);
  useEffect(() => {
    configByPlatform();
    getOfferingsFromRC().then((offerings) => {
      setOfferings(
        offerings.current.availablePackages.map((p) => p.product.identifier)
      );
    });
  }, []);

  return (
    <>
      {!offerings && <Loading />}
      {offerings &&
        offerings.map((offering) => {
          return (
            <ListSection>
              <ListItem leftLabel={offering} />
            </ListSection>
          );
        })}
    </>
  );
};

export default RevenueCatMapOfferings;
