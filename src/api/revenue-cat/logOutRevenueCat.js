import Purchases from "react-native-purchases";

const logOutRevenueCat = async () => {
  return Purchases.logOut()
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      // alert(error.message);
      return Promise.reject(error);
    });
};

export default logOutRevenueCat;