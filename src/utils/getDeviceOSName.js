import * as Device from "expo-device";
import { Platform } from "react-native";

const getDeviceOSName = () => {
  return Platform.OS === "android" ? "Android" : "iOS";
  // return Device.osName;
};

export default getDeviceOSName;
