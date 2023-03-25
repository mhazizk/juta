module.exports = ({ config }) => {
  const name = "Juta";
  const expoProjectID = "4c20a6fe-d8c0-40a2-9324-2f39af56f8a3";
  const channelNameOptions = ["production", "staging", "development"];

  const appVersion = "0.9.2";
  const androidVersionCode = 31;

  // Follow apple guidelines for build number e.g. "1.0.0" with no additional characters
  // For eas submit, the Transporter will get the version from eas.version
  // So to make it safe, we will use the same version for build number

  const iosBuildNumber = "0.8.7";

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
      eas: {
        projectId: expoProjectID,
      },
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "mhazizk",
            project: "juta-app",
            authToken: process.env.SENTRY_AUTH_TOKEN,
          },
        },
      ],
    },
  };
};
