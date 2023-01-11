import * as Device from "expo-device";
import * as Application from "expo-application";

const getDeviceId = async () => {
  const deviceID = Device.brand;
  if (deviceID === "iOS") {
    return await Application.getIosIdForVendorAsync();
  }
  return Application.androidId;
};

export default getDeviceId;
