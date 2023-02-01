module.exports = ({ config }) => {
  const appVersion = "0.5.8-firebase@9.4.0";
  const androidVersionCode = 8;
  const iosBuildNumber = 1;

  return {
    ...config,
    version: appVersion,
    android: {
      ...config.android,
      versionCode: androidVersionCode,
    },
    extra: {
      ...config.extra,
      //   hooks: {
      //     postPublish: [
      //       {
      //         file: "sentry-expo/upload-sourcemaps",
      //         config: {
      //           organization: "mhazizk",
      //           project: "juta-app",
      //           authToken: process.env.PROD_SENTRY_AUTH_TOKEN,
      //         },
      //       },
      //     ],
      //   },
    //   secretKey: {
        //   DEV FIREBASE
        DEV_FIREBASE_API_KEY: process.env.DEV_FIREBASE_API_KEY,
        DEV_FIREBASE_PROJECT_ID: process.env.DEV_FIREBASE_PROJECT_ID,
        DEV_FIREBASE_AUTH_DOMAIN: process.env.DEV_FIREBASE_AUTH_DOMAIN,
        DEV_FIREBASE_STORAGE_BUCKET: process.env.DEV_FIREBASE_STORAGE_BUCKET,
        DEV_FIREBASE_MESSAGING_SENDER_ID:
          process.env.DEV_FIREBASE_MESSAGING_SENDER_ID,
        DEV_FIREBASE_APP_ID: process.env.DEV_FIREBASE_APP_ID,
        DEV_FIREBASE_MEASUREMENT_ID: process.env.DEV_FIREBASE_MEASUREMENT_ID,
        // PROD FIREBASE
        PROD_FIREBASE_API_KEY: process.env.PROD_FIREBASE_API_KEY,
        PROD_FIREBASE_PROJECT_ID: process.env.PORD_FIREBASE_PROJECT_ID,
        PROD_FIREBASE_AUTH_DOMAIN: process.env.PROD_FIREBASE_AUTH_DOMAIN,
        PROD_FIREBASE_STORAGE_BUCKET: process.env.PROD_FIREBASE_STORAGE_BUCKET,
        PROD_FIREBASE_MESSAGING_SENDER_ID:
          process.env.PROD_FIREBASE_MESSAGING_SENDER_ID,
        PROD_FIREBASE_APP_ID: process.env.PROD_FIREBASE_APP_ID,
        PROD_FIREBASE_MEASUREMENT_ID: process.env.PROD_FIREBASE_MEASUREMENT_ID,
        // PROD LOGSNAG
        PROD_LOGSNAG_API_KEY: process.env.PROD_LOGSNAG_API_KEY,
        PROD_LOGSNAG_API_URL: process.env.PROD_LOGSNAG_API_URL,
        // PROD SENTRY
        PROD_SENTRY_DSN: process.env.PROD_SENTRY_DSN,
        PROD_SENTRY_AUTH_TOKEN: process.env.PROD_SENTRY_AUTH_TOKEN,
    //   },
    },
  };

  //   expoConfig.ios.buildNumber = iosBuildNumber;
};
