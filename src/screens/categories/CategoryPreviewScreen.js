import { useIsFocused } from "@react-navigation/native";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import {
  ButtonSecondary,
  ButtonSecondaryDanger,
} from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import * as utils from "../../utils";
import screenList from "../../navigations/ScreenList";

const CategoryPreviewScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  // TAG : useState Section //

  // Theme State
  const [theme, setTheme] = useState({
    theme: "lightTheme",
    fontSize: "medium",
  });

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
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.background,
            height: "100%",
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          >
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
              <IonIcons
                name={category.icon.name}
                size={48}
                style={{ padding: 16 }}
                color={
                  category.icon.color === "default"
                    ? appSettings.theme.style.colors.foreground
                    : category.icon.color
                }
              />
              <TextPrimary
                label={
                  route?.params?.category.name[0].toUpperCase() +
                  route?.params?.category.name.substring(1)
                }
                style={{ fontSize: 24 }}
              />
            </View>

            {/* // TAG : Category Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary label="Category Details" style={{ fontSize: 24 }} />
            </View>

            {/* // TAG : Category Type Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              {/* <View style={{ ...appSettings.theme.style.list.listItem, flexDirection: 'row', alignItems: 'center' }}> */}
              <IonIcons
                name="swap-horizontal-sharp"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Type" style={{ flex: 1 }} />

              {/* // TAG : Container */}
              {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: appSettings.theme.style.colors.secondary }]}> */}

              {/* // TAG : Transaction Picker */}
              <TextPrimary
                label={
                  categoryType[0].toUpperCase() + categoryType.substring(1)
                }
              />

              {/* </View> */}
              {/* </View> */}
            </View>

            {/* // TAG : Color Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              <IonIcons
                name="color-fill"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Icon Color" style={{ flex: 1 }} />

              {/* // TAG : Right Side */}
              <View
                style={[
                  {
                    flexDirection: "row",
                    flex: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <View
                  style={{
                    height: 26,
                    width: 26,
                    borderRadius: 26 / 2,
                    backgroundColor:
                      category.icon.color === "default"
                        ? appSettings.theme.style.colors.foreground
                        : category.icon.color,
                  }}
                />
                {/* <TextPrimary
                                    label={category.icon.color}
                                    style={{ paddingLeft: 8 }}
                                /> */}
              </View>
            </View>

            {/* // TAG : Count Transactions Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              {/* <View style={{ ...appSettings.theme.style.list.listItem, flexDirection: 'row', alignItems: 'center' }}> */}
              <IonIcons
                name="pricetags"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Total Transactions" style={{ flex: 1 }} />

              {/* // TAG : Container */}
              {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: appSettings.theme.style.colors.secondary }]}> */}

              {/* // TAG : Transaction Picker */}
              <TextPrimary label={countTransactions()} />

              {/* </View> */}
              {/* </View> */}
            </View>

            {/* // TAG : Balance Section */}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='cash' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Balance'
                                style={{ flex: 1 }}
                            /> */}

            {/* // TAG : Right Side */}
            {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${formatCurrency({ amount: sumBalance(), currency: appSettings.logbookSettings.defaultCurrency.name })}`}
                                    style={{ paddingLeft: 8 }}
                                />
                            </View>
                        </View> */}

            {/* // TAG : Total Transactions Section */}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', height: 36, paddingTop: 8, paddingHorizontal: 16 }}>
                            <IonIcons name='book' size={18} style={{ paddingRight: 16 }} color={appSettings.theme.style.colors.foreground} />
                            <TextPrimary
                                label='Total Transactions'
                                style={{ flex: 1 }}
                            /> */}

            {/* // TAG : Right Side */}
            {/* <View style={[{ flexDirection: 'row', flex: 0, alignItems: 'center', justifyContent: 'center' }]}>

                                <TextPrimary
                                    label={`${!countTransactions() ? 'No' : countTransactions()} transactions`}
                                    style={{ flex: 0 }}
                                    numberOfLines={1}
                                />

                            </View>
                        </View> */}

            {/* // TAG : Line Separator */}
            <View
              style={{
                borderColor: appSettings.theme.style.colors.secondary,
                borderBottomWidth: 1,
                height: 0,
                width: "80%",
                alignSelf: "center",
                paddingTop: 16,
              }}
            ></View>

            {/* // TAG : Action Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              {/* // TAG : Edit Button */}
              <View style={{ paddingRight: 8 }}>
                <ButtonSecondary
                  label="Edit"
                  width={150}
                  onPress={() =>
                    navigation.navigate(screenList.editCategoryScreen, {
                      category: category,
                      categoryType: categoryType,
                    })
                  }
                />
                {/* <ButtonSecondary
                                    label='Edit'
                                    width={150}
                                    onPress={() => navigation.navigate('Modal Screen', {
                                        title: 'Pick Icon Color',
                                        default: { name: 'Default', color: appSettings.theme.style.colors.primary },
                                        modalType: 'pickColor',
                                        category: category,
                                        selectedCategory: selectedCategory
                                    })}
                                /> */}
              </View>

              {/* // TAG : Delete Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonSecondaryDanger
                  label="Delete"
                  type="danger"
                  width={150}
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
                                initialCategoryDeleteCounter:
                                  categories.categoryDeleteCounter,
                              });
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default CategoryPreviewScreen;