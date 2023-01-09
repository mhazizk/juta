import { getAnalytics, isSupported } from "firebase/analytics";
import app from "./app";

const analytics = isSupported()
  .then(() => getAnalytics(app))
  .catch(() => {
    alert("Analytics is not supported on this device");
  });

export default analytics;
