import { Text, View } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings, useGlobalCategories, useGlobalLogbooks, useGlobalSortedTransactions } from "../../../modules/GlobalContext";

const CategorySearchScreen = () => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const { sortedTransactions, dispatchSortedTransctions } = useGlobalSortedTransactions();
    const { categories, dispatchCategories } = useGlobalCategories();
    const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

    return (
        <>
            <View style={{ height: '100%', backgroundColor: appSettings.theme.style.colors.background }}>
                <TextPrimary
                    label='Category Search Screen'
                />
            </View>
        </>
    )
}

export default CategorySearchScreen;