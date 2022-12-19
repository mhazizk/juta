import { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { CardList, ListItem } from "../../../components/List";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
} from "../../../modules/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";

const MyBudgetsScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { budgets, dispatchBudgets } = useGlobalBudgets();

  useEffect(() => {}, []);

  useEffect(() => {}, [budgets]);

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <FlatList
          data={budgets.budgets}
          keyExtractor={(item) => item.budget_id}
          renderItem={({ item }) => (
            <>
              {budgets.budgets.length && (
                <CardList
                  title={item.budget_name}
                  iconPack="FontAwesome5"
                  limit={item.amount}
                  spent={2_000_000}
                  // daysLeft={item.days_left}
                  iconLeftName="piggy-bank"
                  startDate={item.start_date}
                  finishDate={item.finish_date}
                />
              )}
            </>
          )}
        />
        {!budgets.budgets.length && (
          <TouchableOpacity
            onPress={() => navigation.navigate("New Budget Screen")}
          >
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5Icon
                name="piggy-bank"
                color={appSettings.theme.style.colors.secondary}
                size={48}
                style={{
                  transform: [{ scaleX: -1 }],
                  paddingBottom: 16,
                }}
              />
              <TextSecondary
                label={`You don't have budget planning yet.\n Start creating one`}
                style={{ textAlign: "center" }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              >
                <IonIcons
                  name="add"
                  size={18}
                  color={appSettings.theme.style.colors.foreground}
                />
                <TextPrimary label="Create New Budget" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default MyBudgetsScreen;
