import * as Device from "expo-device";
import * as Application from "expo-application";

const getDeviceName = () => {
  return Device.deviceName;
};

export default getDeviceName;
