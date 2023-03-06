import { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableNativeFeedback, View } from "react-native";
import uuid from "react-native-uuid";
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
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const NewCategoryScreen = ({ route, navigation }) => {
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { categories, dispatchCategories } = useGlobalCategories();
  const [category, setCategory] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setCategory({
      type: "expense",
      category: {
        name: "",
        id: uuid.v4(),
        is_deletable: true,
        icon: {
          name: "fast-food",
          color: "default",
          pack: "IonIcons",
        },
      },
    });
  }, []);

  useEffect(() => {
    console.log(category);
  }, [category]);

  return (
    <>
      {category && (
        <CustomScrollView contentContainerStyle={{ flex: 1 }}>
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
              placeholder="Type category name..."
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
                category.type[0].toUpperCase() + category.type.substring(1)
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
                  title: "Category type",
                  props: [{ name: "expense" }, { name: "income" }],
                  modalType: MODAL_TYPE_CONSTANTS.LIST,
                  selected: (item) => {
                    setCategory({
                      ...category,
                      type: item.name,
                    });
                  },
                  defaultOption: { name: category.type },
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
                  if (!category.category.name) {
                    Alert.alert(
                      "Category name is required",
                      "Please enter a category name",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            inputRef.current.focus();
                          },
                          style: "cancel",
                        },
                      ],
                      { cancelable: true }
                    );
                  } else {
                    const newCategory = {
                      ...category.category,
                      _timestamps: {
                        ...category.category._timestamps,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                        created_by: userAccount.uid,
                        updated_by: userAccount.uid,
                      },
                    };
                    navigation.navigate(screenList.loadingScreen, {
                      label: "Saving Category ...",
                      loadingType: "insertCategory",
                      categoryType: category.type,
                      insertCategory: newCategory,
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

export default NewCategoryScreen;
