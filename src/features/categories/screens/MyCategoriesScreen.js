import { useEffect } from "react";
import { ScrollView } from "react-native";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const MyCategoriesScreen = ({ navigation }) => {
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
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
      <CustomScrollView>
        {/* // TAG : Expense */}
        <TextPrimary
          label="Expense"
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        />
        <ListSection>
          {categories.categories?.expense
            ?.sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .map((item) => {
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
                      ? globalTheme.colors.foreground
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
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        />
        <ListSection>
          {categories.categories?.income
            ?.sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .map((item) => {
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
                      ? globalTheme.colors.foreground
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
      </CustomScrollView>
      {/* <FlatList
        data={["expense", "income"]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <FlatList
              data={data(item)}
              contentContainerStyle={{
                backgroundColor: globalTheme.colors.background,
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
                          ? globalTheme.colors.foreground
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
