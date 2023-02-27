import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import Loading from "../../../components/Loading";
import { MyBudgetsWidget } from "../components/MyBudgetsWidget";
import RecentTransactions from "../../../components/RecentTransactions";
import TotalExpenseWidget from "../components/TotalExpenseWidget";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings, useGlobalTheme
} from "../../../reducers/GlobalContext";
import DashboardHeader from "../components/DashboardHeader";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import MyLoansWidget from "../components/MyLoansWidget";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [screenLoading, setScreenLoading] = useState(false);

  const cardHeight = 200 - 16; // 200 is the height of card in the carousel
  const isFocus = useIsFocused();

  useEffect(() => {}, []);

  useEffect(() => {
    if (isFocus) {
      setScreenLoading(true);
    }
  }, [isFocus]);

  useEffect(() => {
    if (screenLoading) {
      setTimeout(() => {
        setScreenLoading(false);
      }, 1);
    }
  }, [screenLoading]);

  return (
    <>
      {/* Loading */}
      {screenLoading && (
        <View
          style={{
            height: "100%",
            backgroundColor: globalTheme.colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      )}
      {!screenLoading && (
        <>
          <CustomScrollView>
            {/* Bleeding Header Color */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "25%",
                backgroundColor: globalTheme.colors.header,
              }}
            />
            <DashboardHeader />

            {/* // TAG : Total expense widget */}
            {appSettings.dashboardSettings.showTotalExpenseWidget && (
              <TotalExpenseWidget
                cardHeight={cardHeight}
                onPress={() => navigation.navigate(screenList.analyticsScreen)}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 32,
                // paddingHorizontal: 16,
              }}
            >
              {/* // TAG : My Logbooks Widget */}
              {/* {appSettings.dashboardSettings.showMyLogbooksWidget && (
                <ImgButton
                  label="My Logbooks"
                  textColor={globalTheme.colors.black}
                  iconName="book"
                  iconColor="#48ADFF"
                  iconPack="IonIcons"
                  boxColor="#90CEFF"
                  boxHeight={150}
                  boxMarginRight={8}
                  boxWidth={screenWidth / 2 - 24}
                  onPress={() =>
                    navigation.navigate(screenList.myLogbooksScreen)
                  }
                />
              )} */}
              {/* // TAG : My Loans widget */}
              <MyLoansWidget
                marginRight={8}
                onPress={() => {
                  navigation.navigate(screenList.myLoansScreen);
                }}
              />

              {/* // TAG : My Budgets Widget */}
              {appSettings.dashboardSettings.showMyBudgetsWidget && (
                <MyBudgetsWidget
                  isFocused={isFocus}
                  boxMarginLeft={8}
                  boxWidth={screenWidth / 2 - 24}
                  onPress={() =>
                    navigation.navigate(screenList.myBudgetsScreen)
                  }
                />
              )}
            </View>
            {/* // TAG : Recent Transactions */}
            {appSettings.dashboardSettings.showRecentTransactions && (
              <RecentTransactions
                onPress={({ transaction, selectedLogbook }) => {
                  navigation.navigate(screenList.transactionPreviewScreen, {
                    transaction: transaction,
                    selectedLogbook: selectedLogbook,
                  });
                }}
              />
            )}
          </CustomScrollView>
        </>
      )}
    </>
  );
};

export default DashboardScreen;
