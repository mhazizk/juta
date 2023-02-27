module.exports = ({ config }) => {
  const name = "Juta";

  const appVersion = "0.7.11-alpha";
  const androidVersionCode = 23;
  const iosBuildNumber = "1";

  return {
    ...config,
    name: name,
    version: appVersion,
    android: {
      ...config.android,
      versionCode: androidVersionCode,
    },
    ios: {
      ...config.ios,
      buildNumber: iosBuildNumber,
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
