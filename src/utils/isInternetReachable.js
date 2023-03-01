import * as Network from "expo-network";
/**
 * Checks if internet is reachable
 *
 * @returns true if internet is reachable, false otherwise
 */
const isInternetReachable = async () => {
  return Network.getNetworkStateAsync()
    .then((networkState) => {
      return networkState.isInternetReachable ? true : false;
    })
    .catch((err) => console.log(err));
};
export default isInternetReachable;
