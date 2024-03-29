import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import ionIcons from "../../../assets/iconPacks/ionIcons";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary } from "../../../components/Text";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import * as utils from "../../../utils";

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
          <IonIcons
            name={category.category.icon.name}
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
          <TouchableOpacity
            onPress={() => inputRef.current.focus()}
            style={{
              flex: 1,
              width: "100%",
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
                  modalType: MODAL_TYPE_CONSTANTS.ICON_PICKER,
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
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "visible",
                }}
              >
                <IonIcons
                  name={category.category.icon.name}
                  size={48}
                  style={{
                    padding: 16,
                  }}
                  color={
                    category.category.icon.color === "default"
                      ? globalTheme.colors.foreground
                      : category.category.icon.color
                  }
                />
              </View>
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
                { width: "100%" },
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
              clearButtonMode="never"
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
          </TouchableOpacity>

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
              rightIconPack="IonIcons"
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
                  modalType: MODAL_TYPE_CONSTANTS.LIST,
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
              rightIconPack="IonIcons"
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
                  title: "Pick icon color",
                  modalType: MODAL_TYPE_CONSTANTS.COLOR_PICKER,
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
          <ActionButtonWrapper>
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
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditCategoryScreen;
