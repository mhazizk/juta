import { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import ionIcons from "../../assets/iconPacks/ionIcons";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import CustomScrollView from "../../shared-components/CustomScrollView";

const EditCategoryScreen = ({ route, navigation }) => {
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
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
        <CustomScrollView>
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
                  title: "Pick icon",
                  modalType: "iconPicker",
                  mainButtonLabel: "Select",
                  props: ionIcons,
                  defaultOption: category.category.icon,
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
                    ? globalTheme.colors.foreground
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
              placeholderTextColor={globalTheme.text.textSecondary.color}
              style={[
                {
                  ...globalTheme.text.textPrimary,
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
                color={globalTheme.colors.foreground}
              />
            )}
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
              pressable
              iconLeftName="swap-horizontal-sharp"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
              leftLabel="Type"
              useRightLabelContainer
              rightLabel={
                category.targetCategoryType[0].toUpperCase() +
                category.targetCategoryType.substring(1)
              }
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
                  title: "Category Type",
                  props: [{ name: "expense" }, { name: "income" }],
                  modalType: "list",
                  selected: (item) => {
                    setCategory({
                      ...category,
                      targetCategoryType: item.name,
                    });
                  },
                  defaultOption: { name: category.targetCategoryType },
                });
              }}
            />
            {/* // TAG : Color Section */}
            <ListItem
              pressable
              iconLeftName="color-fill"
              iconPack="IonIcons"
              iconRightName="chevron-forward"
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
                  category.category.icon.color === "default"
                    ? globalTheme.colors.foreground
                    : category.category.icon.color,
              }}
              onPress={() => {
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
                  defaultOption: {
                    color:
                      category.category.icon.color === "default"
                        ? globalTheme.colors.foreground
                        : category.category.icon.color,
                  },
                });
              }}
            />
            {/* // TAG : Total Transactions */}
            <ListItem
              iconLeftName="pricetags"
              iconPack="IonIcons"
              leftLabel="Total transactions"
              rightLabel={countTransactions()}
            />
          </ListSection>

          {/* // TAG : Action Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 8,
              paddingBottom: 24,
              paddingHorizontal: 48,
            }}
          >
            {/* // TAG : Cancel Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Cancel"
                onPress={() => navigation.goBack()}
              />
            </View>

            {/* // TAG : Save Button */}
            <View style={{ flex: 2, paddingLeft: 8 }}>
              <ButtonPrimary
                label="Save"
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
                    const newPatchCategory = {
                      ...category.category,
                      _timestamps: {
                        ...category.category._timestamps,
                        updated_at: Date.now(),
                        updated_by: userAccount.uid,
                      },
                    };
                    navigation.navigate(screenList.loadingScreen, {
                      label: "Saving Category ...",
                      loadingType: "patchCategory",
                      prevCategoryType: category.prevCategoryType,
                      targetCategoryType: category.targetCategoryType,
                      patchCategory: newPatchCategory,
                      reducerUpdatedAt: Date.now(),
                    });
                  }
                }}
              />
            </View>
          </View>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditCategoryScreen;
