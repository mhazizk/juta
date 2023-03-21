import { useIsFocused } from "@react-navigation/native";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import {
  ButtonSecondary,
  ButtonSecondaryDanger,
  ButtonSecondaryDisabled,
} from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
import * as utils from "../../../utils";
import screenList from "../../../navigations/ScreenList";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import ListSection from "../../../components/List/ListSection";
import { ListItem } from "../../../components/List";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";

const CategoryPreviewScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  // TAG : useState Section //

  // Transaction State
  const [category, setCategory] = useState(null);

  // Selected Logbook State
  const [selectedLogbook, setSelectedLogbook] = useState(null);

  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // logbook_id : null
  // logbook_name: null

  // Selected Category State
  const [categoryType, setCategoryType] = useState(null);

  const isFocused = useIsFocused();

  // TAG : UseEffect Section //

  useEffect(() => {
    setCategory(route?.params?.category);
  }, []);

  useEffect(() => {
    setCategory(route?.params?.category);
  }, [route?.params?.category]);

  useEffect(() => {
    // refresh
    // console.log(category);
    if (isFocused) {
      setCategoryType(
        utils.FindById.findCategoryTypeById({
          id: route?.params.category.id,
          categories: categories.categories,
        })
      );
    }
    // console.log(transaction.details)
    // findCategoryNameById();
    // findCategoryIconNameById();
    // findLogbookNamebyId();
  }, [isFocused]);

  useEffect(() => {
    // refresh
    console.log(categoryType);
  }, [categoryType]);

  useEffect(() => {
    // refresh
  }, [selectedLogbook]);

  useEffect(() => {}, [logbookToOpen]);

  useEffect(() => {}, [sortedTransactions]);

  // TAG : Function Section //
  // const findCategoryType = () => {
  //   const findExpenseCategory = categories.categories.expense.some(
  //     (category) => category.id === route?.params?.category?.id
  //   );
  //   const findIncomeCategory = categories.categories.income.some(
  //     (category) => category.id === route?.params?.category?.id
  //   );

  //   if (findExpenseCategory) {
  //     setCategoryType("expense");
  //   }
  //   if (findIncomeCategory) {
  //     setCategoryType("income");
  //   }
  // };

  const countTransactions = () => {
    let array = [];

    sortedTransactions.groupSorted.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (transaction.details.category_id === category.id) {
            array.push(transaction.details.category_id);
          }
        });
      });
    });
    console.log(array);
    return !array.length ? "No Transactions" : `${array.length} Transactions`;
  };

  return (
    <>
      {category && categoryType && (
        <CustomScrollView contentContainerStyle={{ flex: 1 }}>
          <IonIcons
            name={category.icon.name}
            size={400}
            style={{
              position: "absolute",
              top: "10%",
              bottom: 0,
              right: "-30%",
              // left: 0,
              zIndex: -1,
            }}
            color={utils.hexToRgb({
              hex: globalTheme.colors.secondary,
              opacity: 0.3,
            })}
          />

          {/* // TAG : Category Name Section */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                overflow: "visible",
              }}
            >
              <IonIcons
                name={category.icon.name}
                size={48}
                style={{ padding: 16 }}
                color={
                  category.icon.color === "default"
                    ? globalTheme.colors.foreground
                    : category.icon.color
                }
              />
            </View>
            <TextPrimary
              label={
                route?.params?.category.name[0].toUpperCase() +
                route?.params?.category.name.substring(1)
              }
              style={{ fontSize: 24 }}
            />
          </View>

          {/* // TAG : Category Details */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary label="Category Details" style={{ fontSize: 24 }} />
          </View>

          <ListSection>
            {/* // TAG : Category Type Section */}
            <ListItem
              iconLeftName="swap-horizontal-sharp"
              iconPack="IonIcons"
              leftLabel="Type"
              rightLabelColor={globalTheme.colors.foreground}
              rightLabel={
                categoryType[0].toUpperCase() + categoryType.substring(1)
              }
            />
            {/* // TAG : Color Section */}
            <ListItem
              iconLeftName="color-fill"
              iconPack="IonIcons"
              leftLabel="Icon color"
              useRightLabelContainer
              rightLabel=" "
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                height: 26,
                width: 26,
                borderRadius: 26 / 2,
                backgroundColor:
                  category.icon.color === "default"
                    ? globalTheme.colors.foreground
                    : category.icon.color,
              }}
            />
            {/* // TAG : Total Transactions */}
            <ListItem
              iconLeftName="pricetags"
              iconPack="IonIcons"
              rightLabelColor={globalTheme.colors.foreground}
              leftLabel="Total transactions"
              rightLabel={countTransactions()}
            />
          </ListSection>

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Edit Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              {!category.is_deletable && (
                <ButtonSecondaryDisabled label="Edit" />
              )}
              {category.is_deletable && (
                <ButtonSecondary
                  label="Edit"
                  onPress={() =>
                    navigation.navigate(screenList.editCategoryScreen, {
                      category: category,
                      categoryType: categoryType,
                    })
                  }
                />
              )}
            </View>

            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingLeft: 8 }}>
              {!category.is_deletable && (
                <ButtonSecondaryDisabled label="Delete" />
              )}
              {category.is_deletable && (
                <ButtonSecondaryDanger
                  label="Delete"
                  type="danger"
                  onPress={() => {
                    if (countTransactions() !== "No Transactions") {
                      Alert.alert(
                        "Delete Category",
                        "You cannot delete a category with transactions. Please delete all transactions first.",
                        [
                          {
                            text: "OK",
                            onPress: () => {},
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                    if (countTransactions() === "No Transactions") {
                      Alert.alert(
                        "Delete Category",
                        `Are you sure you want to delete this category? This will delete all transactions associated with this category.`,
                        [
                          {
                            text: "No",
                            onPress: () => {},
                            style: "cancel",
                          },
                          {
                            text: "Yes",
                            onPress: () => {
                              navigation.navigate(screenList.loadingScreen, {
                                label: "Deleting Category ...",
                                loadingType: "deleteCategory",
                                deleteCategory: category,
                                reducerUpdatedAt: Date.now(),
                              });
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                />
              )}
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default CategoryPreviewScreen;
