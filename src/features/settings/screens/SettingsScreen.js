import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import CheckList from "../../../components/CheckList";
import { ListItem } from "../../../components/List";
import RadioButtonList from "../../../components/List/RadioButtonList";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCurrencyRates,
  useGlobalFeatureSwitch,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import * as utils from "../../../utils";
import SettingsHeaderList from "../../../components/List/SettingsHeaderList";
import ListSection from "../../../components/List/ListSection";
import Animated from "react-native-reanimated";
import getCurrencyRate from "../../../api/rapidapi/getCurrencyRate";
import FEATURE_NAME from "../../subscription/model/featureName";
import getFeatureLimit from "../../subscription/logic/getFeatureLimit";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import THEME_CONSTANTS from "../../../constants/themeConstants";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import NEGATIVE_CURRENCY_SYMBOL_CONSTANTS from "../../../constants/negativeCurrencySymbolConstants";
import LANGUAGE_CONSTANTS from "../../../constants/languageConstants";
import CURRENCY_CONSTANTS from "../../../constants/currencyConstants";
import FONT_SIZE_CONSTANTS from "../../../constants/fontSizeConstants";
import LOGBOOK_SETTINGS_CONSTANTS from "../../../constants/logbookSettingsConstants";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import BUDGET_SETTINGS_CONSTANTS from "../../../constants/budgetSettingsConstants";

const SettingsScreen = ({ navigation }) => {
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { budgets } = useGlobalBudgets();
  const [dashboardSettings, setDashboardSettings] = useState(
    appSettings.dashboardSettings
  );
  const [searchSettings, setSearchSettings] = useState(
    appSettings.searchSettings
  );
  const [logbookSettings, setLogbookSettings] = useState(
    appSettings.logbookSettings
  );
  const [budgetSettings, setBudgetSettings] = useState(
    appSettings.budgetSettings
  );
  const [currencyRates, setCurrencyRates] = useState(globalCurrencyRates);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    setTimeout(() => {
      dispatchGlobalCurrencyRates({
        type: REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET,
        payload: currencyRates,
      });
    }, 1);
  }, [currencyRates]);

  const _timestamps = {
    ...appSettings._timestamps,
    updated_at: Date.now(),
    updated_by: userAccount.uid,
  };

  useEffect(() => {
    if (!!budgetSettings) {
      const payload = {
        budgetSettings: budgetSettings,
        _timestamps: {
          ...appSettings._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      setTimeout(() => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: payload,
        });
      }, 1);
    }
  }, [budgetSettings]);

  useEffect(() => {
    if (!!logbookSettings) {
      const payload = {
        logbookSettings: logbookSettings,
        _timestamps: {
          ...appSettings._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      setTimeout(() => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: payload,
        });
      }, 1);
    }
  }, [logbookSettings]);

  useEffect(() => {
    if (!!dashboardSettings) {
      const payload = {
        dashboardSettings: dashboardSettings,
        _timestamps: {
          ...appSettings._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      setTimeout(() => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: payload,
        });
      }, 1);
    }
  }, [dashboardSettings]);

  useEffect(() => {
    if (!!searchSettings) {
      const payload = {
        searchSettings: searchSettings,
        _timestamps: {
          ...appSettings._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      setTimeout(() => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: payload,
        });
      }, 1);
    }
  }, [searchSettings]);

  // useEffect(() => {
  // }, [appSettings?.theme_id]);

  return (
    <>
      <CustomScrollView>
        {/* // SECTION : Personalization Section */}
        {appSettings && (
          <>
            <SettingsHeaderList
              label="Personalization"
              iconName="color-palette"
            />
            {/* // TAG : Other */}
            <ListSection>
              {/* // TAG : App Theme */}
              <ListItem
                pressable
                leftLabel="Theme"
                rightLabel={globalTheme.identifier.name}
                iconLeftName="contrast"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Select Theme",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    iconProps: {
                      name: "contrast",
                      pack: "IonIcons",
                    },
                    props: THEME_CONSTANTS.OPTIONS.sort((a, b) => {
                      return a.name.localeCompare(b.name);
                    }).map((theme) => theme),
                    defaultOption: THEME_CONSTANTS.OPTIONS.find((theme) => {
                      return theme.id === appSettings.theme_id;
                    }),
                    selected: (item) => {
                      const payload = {
                        theme_id: item.id,
                        _timestamps: {
                          ...appSettings._timestamps,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                      };
                      dispatchGlobalTheme({
                        type: REDUCER_ACTIONS.THEME.SET,
                        payload: item.id,
                      });
                      setTimeout(() => {
                        dispatchAppSettings({
                          type: REDUCER_ACTIONS.APP_SETTINGS.THEME.SET,
                          payload: item.id,
                        });
                      }, 1);
                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  })
                }
              />

              {/* // TAG : Font Size */}
              {/* <ListItem
                pressable
                leftLabel="Font Size"
                rightLabel={
                  appSettings.fontSize[0].toUpperCase() +
                  appSettings.fontSize.substring(1)
                }
                iconLeftName="text"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Font Size",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    props: FONT_SIZE_CONSTANTS.OPTIONS.map((option) => {
                      return { name: option };
                    }),
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.FONT_SIZE_CONSTANTS.SET,
                        payload: item.name,
                      }),
                    defaultOption: { name: appSettings.fontSize },
                  })
                }
              /> */}

              {/* // TAG : Language */}
              <ListItem
                pressable
                leftLabel="Language"
                rightLabel={
                  appSettings.language[0].toUpperCase() +
                  appSettings.language.substring(1)
                }
                iconLeftName="language"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Language",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    props: LANGUAGE_CONSTANTS.OPTIONS.map((option) => {
                      return { name: option.name, locale: option.locale };
                    }),
                    selected: (item) => {
                      // TODO : Add Language Support
                      // dispatchAppSettings({
                      //   type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                      //   payload: {
                      //     language: item.name,
                      //     locale: item.locale,
                      //   },
                      // });
                    },
                    defaultOption: { name: appSettings.language },
                  })
                }
              />
            </ListSection>
          </>
        )}

        {/* // TODO : Hide Dashboard Section for next release */}
        {/* // SECTION : Dashboard Section */}
        {dashboardSettings && (
          <>
            {/* <SettingsHeaderList
              label="Dashboard Settings"
              iconName="analytics"
            />
            <ListSection> */}
            {/* // TAG : Show Recent Transactions */}
            {/* <CheckList
                primaryLabel="Show Recent Transactions"
                item={true}
                selected={dashboardSettings.showRecentTransactions}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showRecentTransactions:
                      !dashboardSettings.showRecentTransactions,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Expense Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Expense Widget"
                item={true}
                selected={dashboardSettings.showTotalExpenseWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalExpenseWidget:
                      !dashboardSettings.showTotalExpenseWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Income Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Income Widget"
                item={true}
                selected={dashboardSettings.showTotalIncomeWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalIncomeWidget:
                      !dashboardSettings.showTotalIncomeWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Balance Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Balance Widget"
                item={true}
                selected={dashboardSettings.showTotalBalanceWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalBalanceWidget:
                      !dashboardSettings.showTotalBalanceWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show My Budgets Widget  */}
            {/* <CheckList
                primaryLabel="Show My Budgets Widget"
                item={true}
                selected={dashboardSettings.showMyBudgetsWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showMyBudgetsWidget: !dashboardSettings.showMyBudgetsWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show My Logbooks Widget  */}
            {/* <CheckList
                primaryLabel="Show My Logbooks Widget"
                item={true}
                selected={dashboardSettings.showMyLogbooksWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showMyLogbooksWidget:
                      !dashboardSettings.showMyLogbooksWidget,
                  });
                }}
              />
            </ListSection> */}
          </>
        )}

        {/* // TODO : Hide Search Section for next release */}
        {/* // SECTION : Search Section */}
        {searchSettings && (
          <>
            {/* <SettingsHeaderList label="Search Settings" iconName="search" />
            <ListSection> */}
            {/* // TAG : Transactions Search*/}
            {/* <CheckList
                primaryLabel="Transactions"
                item={true}
                selected={searchSettings.showTransactionsResult}
                onPress={() => {
                  setSearchSettings({
                    ...searchSettings,
                    showTransactionsResult:
                      !searchSettings.showTransactionsResult,
                  });
                }}
              /> */}
            {/* // TAG : Settings Search */}
            {/* <CheckList
                primaryLabel="Settings"
                item={true}
                selected={searchSettings.showSettingsResult}
                onPress={() => {
                  setSearchSettings({
                    ...searchSettings,
                    showSettingsResult: !searchSettings.showSettingsResult,
                  });
                }}
              />
            </ListSection> */}
          </>
        )}

        {/* // SECTION : Budget Section */}
        {budgetSettings && (
          <>
            <SettingsHeaderList label="Budget Settings" iconName="pie-chart" />
            <ListSection>
              {/* // TAG : First day of the week */}
              <ListItem
                pressable
                leftLabel="First day of the week"
                rightLabel={utils.upperCaseThisFirstLetter(
                  budgetSettings.firstDayOfTheWeek
                )}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set first day of the week",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    defaultOption: { name: budgetSettings.firstDayOfTheWeek },
                    props:
                      BUDGET_SETTINGS_CONSTANTS.FIRST_DAY_OF_THE_WEEK.OPTIONS.map(
                        (day) => {
                          return {
                            name: day,
                            value: day,
                          };
                        }
                      ),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        budgetSettings: {
                          ...appSettings.budgetSettings,
                          firstDayOfTheWeek: item.name,
                        },
                        _timestamps,
                      };

                      setBudgetSettings({
                        ...budgetSettings,
                        firstDayOfTheWeek: item.name,
                      });

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  });
                }}
              />
              {/* // TAG : First date of the month */}
              <ListItem
                pressable
                leftLabel="First date of the month"
                rightLabel={budgetSettings.firstDateOfTheMonth}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set first date of the month",
                    modalType: MODAL_TYPE_CONSTANTS.NUMBER_PICKER,
                    defaultOption: { name: budgetSettings.firstDateOfTheMonth },
                    props:
                      BUDGET_SETTINGS_CONSTANTS.FIRST_DATE_OF_THE_MONTH.OPTIONS().map(
                        (date) => {
                          return {
                            name: date,
                            value: date,
                          };
                        }
                      ),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        budgetSettings: {
                          ...appSettings.budgetSettings,
                          firstDateOfTheMonth: item.name,
                        },
                        _timestamps,
                      };

                      setBudgetSettings({
                        ...budgetSettings,
                        firstDateOfTheMonth: item.name,
                      });

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  });
                }}
              />
              {/* // TAG : First month of the year */}
              <ListItem
                pressable
                leftLabel="First month of the year"
                rightLabel={utils.upperCaseThisFirstLetter(
                  budgetSettings.firstMonthOfTheYear
                )}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set first month of the year",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    defaultOption: { name: budgetSettings.firstMonthOfTheYear },
                    props:
                      BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.map(
                        (day) => {
                          return {
                            name: day,
                            value: day,
                          };
                        }
                      ),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        budgetSettings: {
                          ...appSettings.budgetSettings,
                          firstMonthOfTheYear: item.name,
                        },
                        _timestamps,
                      };

                      setBudgetSettings({
                        ...budgetSettings,
                        firstMonthOfTheYear: item.name,
                      });

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  });
                }}
              />
            </ListSection>
          </>
        )}

        {/* // SECTION : Logbook Section */}
        {logbookSettings && (
          <>
            <SettingsHeaderList label="Logbook Settings" iconName="book" />
            {/* // TAG : Default Currency */}
            <TextPrimary
              label="Currency"
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            />
            <ListSection>
              {/* // TAG : Main currency */}
              <ListItem
                pressable
                iconLeftName="usd"
                leftLabel="Set default currency"
                thirdLabel="This currency also be used for all features in the app"
                rightLabel={
                  logbookSettings.defaultCurrency.currencyCode +
                  " / " +
                  logbookSettings.defaultCurrency.symbol
                }
                useRightLabelContainer={true}
                useFlagIcon
                flagIsoCode={logbookSettings.defaultCurrency.isoCode}
                flagIconSize={18}
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: globalTheme.colors.secondary,
                }}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set default currency",
                    modalType: MODAL_TYPE_CONSTANTS.CURRENCY_LIST,
                    props: CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                      return a.name > b.name ? 1 : -1;
                    }),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        logbookSettings: {
                          ...appSettings.logbookSettings,
                          defaultCurrency: item,
                        },
                        _timestamps,
                      };

                      let patchBudgets = [];
                      console.log(JSON.stringify({ budgets }, null, 2));
                      if (budgets.budgets.length > 0) {
                        budgets.budgets.forEach((budget) => {
                          if (!!budget) {
                            const convertedLimit = utils.convertCurrency({
                              amount: budget.limit,
                              from: appSettings.logbookSettings.defaultCurrency
                                .name,
                              target: item.name,
                              globalCurrencyRates,
                            });
                            const newBudget = {
                              ...budget,
                              limit: convertedLimit,
                              _timestamps: {
                                ...budget._timestamps,
                                updated_at: Date.now(),
                                updated_by: userAccount.uid,
                              },
                            };
                            patchBudgets.push(newBudget);
                          }
                        });
                      }

                      console.log(JSON.stringify({ patchBudgets }, null, 2));

                      setLogbookSettings({
                        ...logbookSettings,
                        defaultCurrency: item,
                      });

                      setTimeout(async () => {
                        patchBudgets.forEach(async (budget) => {
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.BUDGETS,
                            budget.budget_id,
                            budget
                          );
                        });
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                    defaultOption: logbookSettings.defaultCurrency,
                  });
                }}
              />

              {/* // TAG : Secondary Currency */}
              <ListItem
                pressable
                iconLeftName="usd"
                leftLabel="Set secondary currency"
                useRightLabelContainer={true}
                useFlagIcon
                flagIsoCode={logbookSettings.secondaryCurrency.isoCode}
                flagIconSize={18}
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: globalTheme.colors.secondary,
                }}
                rightLabel={
                  logbookSettings.secondaryCurrency.currencyCode +
                  " / " +
                  logbookSettings.secondaryCurrency.symbol
                }
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set secondary currency",
                    modalType: MODAL_TYPE_CONSTANTS.CURRENCY_LIST,
                    props: CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                      return a.name > b.name ? 1 : -1;
                    }),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        logbookSettings: {
                          ...appSettings.logbookSettings,
                          secondaryCurrency: item,
                        },
                        _timestamps,
                      };

                      setLogbookSettings({
                        ...logbookSettings,
                        secondaryCurrency: item,
                      });

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                    defaultOption: logbookSettings.secondaryCurrency,
                  });
                }}
              />
              {/* // TAG : Show secondary currency */}
              <CheckList
                pressable={getFeatureLimit({
                  globalFeatureSwitch,
                  subscriptionPlan: userAccount.subscription.plan,
                  featureName: FEATURE_NAME.SECONDARY_CURRENCY,
                })}
                disabled={
                  !getFeatureLimit({
                    globalFeatureSwitch,
                    subscriptionPlan: userAccount.subscription.plan,
                    featureName: FEATURE_NAME.SECONDARY_CURRENCY,
                  })
                }
                primaryLabel="Show secondary currency"
                secondaryLabel="This will show secondary currency in all features in app"
                item={true}
                selected={logbookSettings.showSecondaryCurrency}
                onPress={() => {
                  if (
                    getFeatureLimit({
                      globalFeatureSwitch,
                      subscriptionPlan: userAccount.subscription.plan,
                      featureName: FEATURE_NAME.SECONDARY_CURRENCY,
                    })
                  ) {
                    const payload = {
                      ...appSettings,
                      logbookSettings: {
                        ...appSettings.logbookSettings,
                        showSecondaryCurrency:
                          !logbookSettings.showSecondaryCurrency,
                      },
                      _timestamps,
                    };

                    setLogbookSettings({
                      ...logbookSettings,
                      showSecondaryCurrency:
                        !logbookSettings.showSecondaryCurrency,
                    });

                    setTimeout(async () => {
                      await firestore.setData(
                        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                        appSettings.uid,
                        { ...appSettings, ...payload }
                      );
                    }, 1000);
                  } else {
                    Alert.alert(
                      "Upgrade your subscription",
                      "This feature is only available for premium users. Please upgrade your subscription to unlock this feature.",
                      [
                        { text: "Cancel", onPress: () => {}, style: "cancel" },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(screenList.paywallScreen);
                          },
                        },
                      ]
                    );
                  }
                }}
              />

              {/* // TAG : Update Currency Rates */}
              <ListItem
                pressable
                leftLabel="Update currency rates"
                rightLabel={
                  isLoading
                    ? "Updating... "
                    : "Last update: " +
                      new Date(currencyRates._timestamps.updatedAt).getDate() +
                      "/" +
                      (new Date(
                        currencyRates._timestamps.updatedAt
                      ).getMonth() +
                        1) +
                      "/" +
                      new Date(
                        currencyRates._timestamps.updatedAt
                      ).getFullYear()
                }
                isLoading={isLoading}
                onPress={() => {
                  setIsLoading(true);
                  // getCurrencyRate(globalCurrencyRates.data).then((data) => {
                  Promise.all([
                    firestore.getOneDoc(
                      FIRESTORE_COLLECTION_NAMES.GLOBAL_CURRENCY_RATES,
                      "allCurrencyRates"
                    ),
                  ]).then((data) => {
                    const newCurrencies = data[0];
                    setCurrencyRates(newCurrencies);
                    setIsLoading(false);
                  });
                }}

                // TODO : Add currency rate screen
              />

              {/* // TAG : Negative currency */}
              <ListItem
                pressable
                iconLeftName="usd"
                leftLabel="Negative currency symbol"
                rightLabel={utils.getFormattedNumber({
                  value: -123,
                  currencyCountryName: logbookSettings.defaultCurrency.name,
                  negativeSymbol:
                    appSettings.logbookSettings.negativeCurrencySymbol,
                })}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set negative currency symbol",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    props: NEGATIVE_CURRENCY_SYMBOL_CONSTANTS.OPTIONS,
                    defaultOption:
                      NEGATIVE_CURRENCY_SYMBOL_CONSTANTS.OPTIONS.find(
                        (item) => {
                          return (
                            item.id === logbookSettings.negativeCurrencySymbol
                          );
                        }
                      ),
                    selected: (item) => {
                      const payload = {
                        ...appSettings,
                        logbookSettings: {
                          ...appSettings.logbookSettings,
                          negativeCurrencySymbol: item.id,
                        },
                        _timestamps,
                      };
                      setLogbookSettings({
                        ...logbookSettings,
                        negativeCurrencySymbol: item.id,
                      });

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  });
                }}
              />
            </ListSection>

            {/* // TAG : Daily Summary */}
            <TextPrimary
              label="Daily Summary"
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            />
            <ListSection>
              <RadioButtonList
                items={LOGBOOK_SETTINGS_CONSTANTS.DAILY_SUMMARY.OPTIONS.map(
                  (option) => {
                    return {
                      name: utils.formatHyphenInStrings(option),
                      value: option,
                    };
                  }
                )}
                selected={logbookSettings.dailySummary}
                onChange={(item) => {
                  const payload = {
                    ...appSettings,
                    logbookSettings: {
                      ...appSettings.logbookSettings,
                      dailySummary: item.value,
                    },
                    _timestamps,
                  };

                  setLogbookSettings({
                    ...logbookSettings,
                    dailySummary: item.value,
                  });

                  setTimeout(async () => {
                    await firestore.setData(
                      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                      appSettings.uid,
                      { ...appSettings, ...payload }
                    );
                  }, 1000);
                }}
              />
            </ListSection>
            {/* // TAG : Other */}
            <ListSection>
              {/* // TAG : Show Transaction Time */}
              <CheckList
                pressable
                primaryLabel="Show transaction time"
                item={true}
                selected={logbookSettings.showTransactionTime}
                onPress={() => {
                  const payload = {
                    ...appSettings,
                    logbookSettings: {
                      ...appSettings.logbookSettings,
                      showTransactionTime: !logbookSettings.showTransactionTime,
                    },
                    _timestamps,
                  };

                  setLogbookSettings({
                    ...logbookSettings,
                    showTransactionTime: !logbookSettings.showTransactionTime,
                  });

                  setTimeout(async () => {
                    await firestore.setData(
                      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                      appSettings.uid,
                      { ...appSettings, ...payload }
                    );
                  }, 1000);
                }}
              />
              {/* // TAG : Show Transaction Notes */}
              <CheckList
                pressable
                item={true}
                primaryLabel="Show transaction notes"
                selected={logbookSettings.showTransactionNotes}
                onPress={() => {
                  const payload = {
                    ...appSettings,
                    logbookSettings: {
                      ...appSettings.logbookSettings,
                      showTransactionNotes:
                        !logbookSettings.showTransactionNotes,
                    },
                    _timestamps,
                  };

                  setLogbookSettings({
                    ...logbookSettings,
                    showTransactionNotes: !logbookSettings.showTransactionNotes,
                  });

                  setTimeout(async () => {
                    await firestore.setData(
                      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                      appSettings.uid,
                      { ...appSettings, ...payload }
                    );
                  }, 1000);
                }}
              />
            </ListSection>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default SettingsScreen;
