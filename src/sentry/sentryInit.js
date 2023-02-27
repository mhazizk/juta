// import * as Sentry from "sentry-expo";
import * as Sentry from "@sentry/react-native";
import env from "../config/env";

const sentryInit = () => {
  return Sentry.init({
    dsn: env.SENTRY_CONFIG.SENTRY_DSN,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    enableInExpoDevelopment: true,
    attachScreenshot: true,
  });
};
export default sentryInit;
