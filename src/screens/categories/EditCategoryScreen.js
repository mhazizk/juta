import { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ionIcons } from "../../assets/iconPack/ionIcons";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalSortedTransactions
} from "../../reducers/GlobalContext";

const EditCategoryScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    setCategory({
      prevCategoryType: route?.params?.categoryType,
      targetCategoryType: route?.params?.categoryType,
      category: route?.params?.category,
    });
  }, []);

  useEffect(() => {
    console.log(category);
  }, [category]);

  const inputRef = useRef(null);

  const countTransactions = () => {
    let array = [];

    sortedTransactions.groupSorted.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (transaction.details.category_id === category.category.id) {
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
      {category && (
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
              <TouchableNativeFeedback
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Pick Icon",
                    modalType: "iconPicker",
                    props: ionIcons,
                    default: category.category.icon,
                    selected: (item) => {
                      setCategory({
                        ...category,
                        category: {
                          ...category.category,
                          icon: {
                            ...category.category.icon,
                            name: item.name,
                            pack: item.pack,
                          },
                        },
                      });
                    },
                  })
                }
              >
                <IonIcons
                  name={category.category.icon.name}
                  size={48}
                  style={{ padding: 16 }}
                  color={
                    category.category.icon.color === "default"
                      ? appSettings.theme.style.colors.foreground
                      : category.category.icon.color
                  }
                />
              </TouchableNativeFeedback>
              <TextInput
                ref={inputRef}
                maxLength={30}
                textAlign="center"
                returnKeyType="done"
                placeholder="Type category name ..."
                placeholderTextColor={
                  appSettings.theme.style.text.textSecondary.color
                }
                style={[
                  {
                    ...appSettings.theme.style.text.textPrimary,
                    paddingLeft: 0,
                    paddingVertical: 16,
                    minHeight: 24,
                    fontSize: 24,
                  },
                  {},
                ]}
                onChangeText={(string) => {
                  setCategory({
                    ...category,
                    category: {
                      ...category.category,
                      name: string,
                    },
                  });
                }}
                clearButtonMode="while-editing"
                defaultValue={category.category.name}
                value={category.category.name}
              />

              {category.category.name && (
                <IonIcons
                  onPress={() =>
                    setCategory({
                      ...category,
                      category: { ...category.category, name: "" },
                    })
                  }
                  name="close-circle"
                  size={20}
                  style={{ padding: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              )}
            </View>

            {/* // TAG : Category Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary label="Category Details" style={{ fontSize: 24 }} />
            </View>

            {/* // TAG : Category Type Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Category Type",
                  props: [{ name: "expense" }, { name: "income" }],
                  modalType: "list",
                  selected: (item) => {
                    setCategory({
                      ...category,
                      targetCategoryType: item.name,
                    });
                  },
                  default: { name: category.targetCategoryType },
                })
              }
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="swap-horizontal-sharp"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="Type" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Transaction Picker */}
                    <TextPrimary
                      label={
                        category.targetCategoryType[0].toUpperCase() +
                        category.targetCategoryType.substring(1)
                      }
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Color Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Pick Icon Color",
                  modalType: "colorPicker",
                  selected: (item) => {
                    setCategory({
                      ...category,
                      category: {
                        ...category.category,
                        icon: {
                          ...category.category.icon,
                          color:
                            item.name === "Default" ? "default" : item.color,
                        },
                      },
                    });
                  },
                  default: {
                    color:
                      category.category.icon.color === "default"
                        ? appSettings.theme.style.colors.foreground
                        : category.category.icon.color,
                  },
                })
              }
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
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
                          category.category.icon.color === "default"
                            ? appSettings.theme.style.colors.foreground
                            : category.category.icon.color,
                      }}
                    />
                    <IonIcons
                      name="chevron-forward"
                      size={18}
                      style={{ paddingLeft: 16 }}
                      color={appSettings.theme.style.colors.foreground}
                    />
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>

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
              {/* // TAG : Cancel Button */}
              <View style={{ paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  width={150}
                  onPress={() => navigation.goBack()}
                />
              </View>

              {/* // TAG : Delete Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
                  width={150}
                  onPress={() => {
                    if (category.name === "") {
                      Alert.alert(
                        "Category Name is Required",
                        "Please enter a category name",
                        [
                          {
                            text: "OK",
                            onPress: () => {},
                            style: "cancel",
                          },
                        ],
                        { cancelable: true }
                      );
                    } else {
                      navigation.navigate(screenList.loadingScreen, {
                        label: "Saving Category ...",
                        loadingType: "patchCategory",
                        prevCategoryType: category.prevCategoryType,
                        targetCategoryType: category.targetCategoryType,
                        patchCategory: category.category,
                        initialCategoryPatchCounter:
                          categories.categoryPatchCounter,
                        initialSortedTransactionsPatchCounter:
                          sortedTransactions.sortedTransactionsPatchCounter,
                      });
                    }
                  }}
                />
                {/* <ButtonSecondary
                                    label='Delete'
                                    type='danger'
                                    width={150}
                                    theme={theme.theme}
                                    onPress={() => Alert.alert(
                                        'Delete This Logbook ?',
                                        'All transactions in this logbook will also be deleted. Deleted logbook and transactions can not be restored',
                                        [
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                }, style: 'cancel'
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    navigation.navigate('Loading Screen', {
                                                        label: 'Deleting Logbook ...',
                                                        loadingType: 'deleteOneLogbook',
                                                        deleteLogbook: category,
                                                        logbookToOpen: null,
                                                        initialLogbookDeleteCounter: logbooks.logbookDeleteCounter,
                                                        initialSortedLogbookDeleteCounter: sortedTransactions.sortedLogbookDeleteCounter
                                                    })
                                                }
                                            }], { cancelable: false }
                                    )}
                                /> */}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default EditCategoryScreen;
