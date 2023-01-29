import * as Sentry from "sentry-expo";
import env from "../config/env";

const sentryInit = () => {
  return Sentry.init({
    dsn: env.sentryConfig.dsn,
    enableInExpoDevelopment: true,
    enableNative: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });
};
export default sentryInit;
