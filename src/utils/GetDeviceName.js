import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";
const getDeviceName = () => {
  return Device.deviceName;
};

export default getDeviceName;
