import { Platform } from "react-native";
import { getDeviceId, getDeviceName, getDeviceOSName } from "../../../utils";

/**
 * Returns a new device object with the last login time
 *
 * @param expoPushToken - The expo push token for push notification
 * @param deviceId - The device ID
 * @param deviceName - The device name
 * @param deviceOSName - The device OS name
 * @returns new device object
 */
const getNewDeviceIdentifier = ({
  expoPushToken,
  deviceId,
  deviceName,
  deviceOSName,
}) => {
  if (!deviceId && !deviceName && !deviceOSName) {
    deviceId = getDeviceId();
    deviceName = getDeviceName();
    deviceOSName = getDeviceOSName();

    return Promise.all([deviceId, deviceName, deviceOSName]).then((values) => {
      deviceId = values[0];
      deviceName = values[1];
      deviceOSName = values[2];

      const newDevice = {
        device_id: deviceId || Platform.OS,
        device_name: deviceName || Platform.OS,
        device_os_name: deviceOSName || Platform.OS,
        expo_push_token: expoPushToken || "",
        last_login: Date.now(),
      };

      return newDevice;
    });
  } else {
    const newDevice = {
      device_id: deviceId || Platform.OS,
      device_name: deviceName || Platform.OS,
      device_os_name: deviceOSName || Platform.OS,
      expo_push_token: expoPushToken || "",
      last_login: Date.now(),
    };

    return newDevice;
  }
};
export default getNewDeviceIdentifier;
