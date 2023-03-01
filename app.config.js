module.exports = ({ config }) => {
  const name = "Juta";
  const expoProjectID = "4c20a6fe-d8c0-40a2-9324-2f39af56f8a3";
  const channelNameOptions = ["production", "staging", "development"];

  const appVersion = "0.8.2-alpha";
  const androidVersionCode = 26;
  const iosBuildNumber = "1";

  const channelName = channelNameOptions[0];

  return {
    ...config,
    name: name,
    version: appVersion,
    jsEngine: "hermes",
    android: {
      ...config.android,
      versionCode: androidVersionCode,
    },
    ios: {
      ...config.ios,
      buildNumber: iosBuildNumber,
    },
    updates: {
      ...config.updates,
      url: `https://u.expo.dev/${expoProjectID}`,
    },
    extra: {
      ...config.extra,
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "mhazizk",
            project: "juta-app",
            authToken:
              "c699f2c2e84f4bee8606a9146aa0c45717a7664b477c4679a2004dc10a01d067",
          },
        },
      ],
    },
  };
};
