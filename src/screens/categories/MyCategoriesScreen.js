import { useEffect } from "react";
import { ScrollView, Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { globalStyles } from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";

const MyCategoriesScreen = ({ navigation }) => {
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { categories, dispatchCategories } = useGlobalCategories();

  useEffect(() => {
    // console.log(categories.categories.expense)
    if (categories.categories) {
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.CATEGORIES,
          categories.categories.uid,
          categories.categories
        );
      }, 5000);
    }
  }, [categories.categories]);

  const data = (item) => {
    if (item === "expense") {
      return categories.categories.expense;
    }
    if (item === "income") {
      return categories.categories.income;
    }
  };

  return (
    <>
      {/* <View style={{ backgroundColor: '#fff', height: '100%' }}> */}
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* // TAG : Expense */}
        <TextPrimary
          label="Expense"
          style={{ paddingHorizontal: 32, paddingVertical: 16 }}
        />
        <ListSection>
          {categories.categories?.expense?.map((item) => {
            return (
              <ListItem
                pressable
                key={item.id}
                leftLabel={
                  item?.name[0].toUpperCase() + item?.name.substring(1)
                }
                iconLeftName={item.icon.name}
                iconLeftColor={
                  item.icon.color === "default"
                    ? appSettings.theme.style.colors.foreground
                    : item.icon.color
                }
                iconPack={item.icon.pack}
                iconRightName="chevron-forward"
                onPress={() =>
                  navigation.navigate(screenList.categoryPreviewScreen, {
                    category: item,
                  })
                }
              />
            );
          })}
        </ListSection>

        {/* // TAG : Income */}
        <TextPrimary
          label="Income"
          style={{ paddingHorizontal: 32, paddingVertical: 16 }}
        />
        <ListSection>
          {categories.categories?.income?.map((item) => {
            return (
              <ListItem
                pressable
                key={item.id}
                leftLabel={
                  item?.name[0].toUpperCase() + item?.name.substring(1)
                }
                iconLeftName={item.icon.name}
                iconLeftColor={
                  item.icon.color === "default"
                    ? appSettings.theme.style.colors.foreground
                    : item.icon.color
                }
                iconPack={item.icon.pack}
                iconRightName="chevron-forward"
                onPress={() =>
                  navigation.navigate(screenList.categoryPreviewScreen, {
                    category: item,
                  })
                }
              />
            );
          })}
        </ListSection>
      </ScrollView>
      {/* <FlatList
        data={["expense", "income"]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <FlatList
              data={data(item)}
              contentContainerStyle={{
                backgroundColor: appSettings.theme.style.colors.background,
              }}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => {
                return (
                  <ListItem
                    leftLabel={item[0].toUpperCase() + item.substring(1)}
                  />
                );
              }}
              renderItem={({ item }) => {
                return (
                  <>
                    <ListItem
                      pressable
                      leftLabel={
                        item?.name[0].toUpperCase() + item?.name.substring(1)
                      }
                      iconLeftName={item.icon.name}
                      iconLeftColor={
                        item.icon.color === "default"
                          ? appSettings.theme.style.colors.foreground
                          : item.icon.color
                      }
                      iconPack={item.icon.pack}
                      iconRightName="chevron-forward"
                      onPress={() =>
                        navigation.navigate(screenList.categoryPreviewScreen, {
                          category: item,
                        })
                      }
                    />
                  </>
                );
              }}
              ListFooterComponent={() => {
                return (
                  <>
                    <ListItem
                      pressable
                      rightLabel="Add New Category"
                      iconRightName="add"
                      onPress={() =>
                        navigation.navigate(screenList.newCategoryScreen)
                      }
                    />
                  </>
                );
              }}
            />
          </>
        )}
        ListFooterComponent={() => {
          return <></>;
        }}
      /> */}
    </>
  );
};

export default MyCategoriesScreen;
