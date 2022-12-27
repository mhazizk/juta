import { useState } from "react";
import { View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import {
  useGlobalAppSettings,
  useGlobalBudgets
} from "../../reducers/GlobalContext";

const BudgetPreviewScreen = () => {
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [newBudget, setNewBudget] = useState({
    budget_id: null,
    budget_name: "Test Budget",
    recurring: false,
    amount: 0,
    start_date: Date.now(),
    finish_date: null,
  });
  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
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
      </View>
    </>
  );
};

export default BudgetPreviewScreen;
