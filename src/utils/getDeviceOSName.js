import * as Device from "expo-device";
import * as Application from "expo-application";

const getDeviceOSName = () => {
  return Device.osName;
};

export default getDeviceOSName;
