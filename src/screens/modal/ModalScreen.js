import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import IonIcons from "react-native-vector-icons/Ionicons";
import ActionButtonWrapper from "../../components/ActionButtonWrapper";
import {
  ButtonDisabled,
  ButtonPrimary,
  ButtonPrimaryDanger,
  ButtonSecondary,
} from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { ListItem } from "../../components/List";
import { TextPrimary } from "../../components/Text";
import MODAL_TYPE_CONSTANTS from "../../constants/modalTypeConstants";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";

/**
 *
 * @function ModalScreen
 * @description Modal screen
 *
 * @param {title} string
 * @param {modalType} string
 * @param {defaultOption} string
 * @param {props} object
 * @param {keyboardType} string
 * @param {maxLength} number
 * @param {iconProps} object
 * @param {placeholder} string
 * @param {mainButtonLabel} string
 *
 * @returns {selected} object
 */
const ModalScreen = ({ route, navigation }) => {
  const {
    title,
    modalType,
    defaultOption = null,
    props,
    minimumDateInMillis = null,
    initialDateInMillis,
    keyboardType = "default",
    maxLength = null,
    iconProps = null,
    placeholder = "Type here...",
    // Action buttons
    mainButtonLabel = "Save",
    // Returns
    selected,
  } = route.params;
  const isTextInput = modalType === MODAL_TYPE_CONSTANTS.TEXT_INPUT;
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [selectedItem, setSelectedItem] = useState(defaultOption);
  const [textInput, setTextInput] = useState(defaultOption);
  const [showButton, setShowButton] = useState(false);
  const [showTemporaryDatePicker, setShowTemporaryDatePicker] = useState(false);
  const textInputRef = useRef();

  const colors = [
    { name: "Default", color: globalTheme.colors.foreground },
    { name: "Red", color: "#FF5252" },
    { name: "Blue", color: "#2196F3" },
    { name: "Green", color: "#4CAF50" },
    { name: "Yellow", color: "#FFEB3B" },
    { name: "Orange", color: "#FF9800" },
    { name: "Purple", color: "#9C27B0" },
  ];

  useEffect(() => {
    // setSelectedItem(defaultOption);
    // setTextInput(defaultOption);
  }, []);

  useEffect(() => {
    if (!!selectedItem || !!textInput) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [selectedItem, textInput]);

  useEffect(() => {
    ShowModalContent();
  }, [showTemporaryDatePicker]);

  const onPressReturn = () => {
    switch (modalType) {
      case MODAL_TYPE_CONSTANTS.DATE_PICKER:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.COLOR_PICKER:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.CURRENCY_LIST:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.TEXT_INPUT:
        return selected(textInput);
      case MODAL_TYPE_CONSTANTS.LIST:
        return selected(selectedItem);

      default:
        return;
    }
  };

  const ShowModalContent = () => {
    switch (showTemporaryDatePicker) {
      case true:
        return (
          <RNDateTimePicker
            mode="date"
            display="spinner"
            value={new Date(selectedItem)}
            minimumDate={
              minimumDateInMillis ? new Date(minimumDateInMillis) : null
            }
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || new Date(selectedItem);
              event.type === "set" && setSelectedItem(currentDate.getTime());
              event.type === "dismissed";
            }}
          />
        );
      case false:
        switch (modalType) {
          case MODAL_TYPE_CONSTANTS.DATE_PICKER:
            return (
              <RNDateTimePicker
                mode="date"
                display="spinner"
                value={new Date(selectedItem)}
                minimumDate={
                  minimumDateInMillis ? new Date(minimumDateInMillis) : null
                }
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || new Date(selectedItem);
                  event.type === "set" &&
                    setSelectedItem(currentDate.getTime());
                  event.type === "dismissed";
                }}
              />
            );
          case MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER:
            return (
              <RNDateTimePicker
                mode="datetime"
                display="spinner"
                value={new Date(selectedItem)}
                minimumDate={
                  minimumDateInMillis ? new Date(minimumDateInMillis) : null
                }
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || new Date(selectedItem);
                  event.type === "set" &&
                    setSelectedItem(currentDate.getTime());
                  event.type === "dismissed";
                }}
              />
            );
          case MODAL_TYPE_CONSTANTS.LIST:
            return (
              <FlatList
                data={props}
                keyExtractor={(item, id) => item?.name + id}
                renderItem={({ item }) => (
                  <>
                    <ListItem
                      pressable
                      iconLeftName={item?.icon?.name || iconProps?.name}
                      iconPack={item?.icon?.pack || iconProps?.pack}
                      iconLeftColor={
                        iconProps?.color
                          ? iconProps?.color
                          : item?.icon?.color === "default"
                          ? globalTheme.colors.foreground
                          : item?.icon?.color
                      }
                      iconRightName={
                        // selectedItem?.id === item?.id ||
                        selectedItem?.name === item?.name
                          ? "checkmark-circle"
                          : null
                      }
                      leftLabel={
                        item?.name[0].toUpperCase() + item?.name.substring(1)
                      }
                      onPress={() => {
                        setSelectedItem(item);
                      }}
                    />
                  </>
                )}
              />
            );

          case MODAL_TYPE_CONSTANTS.CURRENCY_LIST:
            return (
              <FlatList
                data={props}
                keyExtractor={(item, id) => item?.name + id}
                renderItem={({ item }) => (
                  <>
                    <TouchableNativeFeedback
                      onPress={() => {
                        setSelectedItem(item);
                      }}
                    >
                      <View style={globalTheme.list.listContainer}>
                        <View
                          style={{
                            borderRadius: 4,
                            overflow: "hidden",
                            alignItems: "center",
                          }}
                        >
                          <CountryFlag isoCode={item?.isoCode} size={20} />
                        </View>
                        <View
                          style={{
                            ...globalTheme.list.listItem,
                            paddingLeft: 16,
                          }}
                        >
                          <TextPrimary
                            label={`${
                              item?.name[0].toUpperCase() +
                              item?.name.substring(1)
                            } / ${item?.symbol}`}
                          />
                          <IonIcons
                            name="checkmark-circle"
                            size={22}
                            style={{
                              display:
                                selectedItem?.name == item?.name
                                  ? "flex"
                                  : "none",
                            }}
                            color={globalTheme.colors.foreground}
                          />
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                  </>
                )}
              />
            );

          case MODAL_TYPE_CONSTANTS.TEXT_INPUT:
            return (
              <View
                style={{
                  paddingLeft: 16,
                  paddingRight: !textInput ? 16 : 0,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  keyboardType={keyboardType}
                  style={{
                    paddingHorizontal: 16,
                    fontSize: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    height: 48,
                    flex: 1,
                    borderColor: globalTheme.colors.primary,
                    color: globalTheme.text.textPrimary.color,
                  }}
                  ref={textInputRef}
                  placeholder={placeholder}
                  placeholderTextColor={globalTheme.text.textSecondary.color}
                  defaultValue={defaultOption || ""}
                  value={textInput}
                  onChangeText={(input) => setTextInput(input)}
                  autoFocus={true}
                  maxLength={maxLength}
                />
                {textInput && (
                  <IonIcons
                    onPress={() => setTextInput("")}
                    name="close-circle"
                    size={20}
                    style={{ paddingHorizontal: 16 }}
                    color={globalTheme.colors.foreground}
                  />
                )}
              </View>
            );
          case MODAL_TYPE_CONSTANTS.ACTION:
            return (
              <>
                {/* // TAG : Delete Action */}
                <TouchableNativeFeedback onPress={() => {}}>
                  <View style={globalTheme.list.listContainer}>
                    <IonIcons
                      name="trash"
                      size={18}
                      // color={item?.icon?.color}
                      style={{ paddingRight: 16 }}
                    />
                    <View style={globalTheme.list.listItem}>
                      <TextPrimary label="Delete" />
                    </View>
                  </View>
                </TouchableNativeFeedback>
              </>
            );
          case MODAL_TYPE_CONSTANTS.COLOR_PICKER:
            return (
              <FlatList
                horizontal
                // numColumns={4}
                // columnWrapperStyle={{ justifyContent: 'space-between', padding: 8 }}
                data={colors}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                keyExtractor={(item, id) => item?.name}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={() => {
                        setSelectedItem(item);
                      }}
                    >
                      {/* <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}> */}

                      {/* Color Circle */}
                      <View
                        style={{
                          height: 48,
                          width: 48,
                          borderRadius: 48 / 2,
                          backgroundColor: item.color,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IonIcons
                          name="checkmark-sharp"
                          size={24}
                          color={globalTheme.colors.background}
                          style={{
                            display:
                              selectedItem?.color === item?.color
                                ? "flex"
                                : "none",
                          }}
                        />
                      </View>

                      {/* </View> */}
                    </TouchableOpacity>
                  </>
                )}
              />
            );

          case MODAL_TYPE_CONSTANTS.ICON_PICKER:
            return (
              <FlatList
                numColumns={6}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  padding: 8,
                }}
                showsHorizontalScrollIndicator={false}
                data={props}
                style={{ height: "100%" }}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                keyExtractor={(item, id) => item?.name}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={() => {
                        setSelectedItem(item);
                      }}
                    >
                      {/* <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}> */}

                      {/* Color Circle */}
                      <View
                        style={{
                          height: 48,
                          width: 48,
                          borderWidth: 2,
                          borderRadius: 48 / 2,
                          borderColor:
                            selectedItem?.name === item.name
                              ? globalTheme.colors.primary
                              : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.pack === "IonIcons" && (
                          <IonIcons
                            name={item.name}
                            size={24}
                            color={
                              item.color === "default"
                                ? globalTheme.colors.foreground
                                : item.color
                            }
                          />
                        )}
                        {/* <IonIcons name='checkmark-sharp' size={24} color={globalTheme.colors.background} style={{ display: selected?.color === item?.color ? 'flex' : 'none' }} /> */}
                      </View>

                      {/* </View> */}
                    </TouchableOpacity>
                  </>
                )}
              />
            );

          default:
            return;
        }
    }
  };

  return (
    <>
      {/* // TAG : Transparent Overlay */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}></View>
      </TouchableOpacity>

      {/* // TAG : Content card */}
      <View
        style={[
          {
            backgroundColor: globalTheme.colors.background,
          },
          {
            display: "flex",
            justifyContent: "flex-start",
            maxHeight: "60%",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            // flex:1
          },
        ]}
      >
        {/* // TAG : Header */}
        <View style={{ flex: 0, padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextPrimary label={title} style={{ fontSize: 24 }} />
            {modalType === MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER && (
              <TouchableOpacity
                style={{
                  flex: 0,
                  alignItems: "flex-end",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: globalTheme.colors.secondary,
                }}
                onPress={() => {
                  setShowTemporaryDatePicker(!showTemporaryDatePicker);
                }}
              >
                <TextPrimary
                  label={new Date(selectedItem).toLocaleString("en-US", {
                    dateStyle: "long",
                  })}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ShowModalContent />

        {/* // TAG : Option Flatlist Params */}
        {modalType === "action" && (
          <>
            {/* <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', padding: 16 }}> */}

            {/* // TAG : Delete Action */}
            <TouchableNativeFeedback onPress={() => {}}>
              <View style={globalTheme.list.listContainer}>
                <IonIcons
                  name="trash"
                  size={18}
                  // color={item?.icon?.color}
                  style={{ paddingRight: 16 }}
                />
                <View style={globalTheme.list.listItem}>
                  <TextPrimary label="Delete" />
                </View>
              </View>
            </TouchableNativeFeedback>
            {/* </View> */}
          </>
        )}

        {/* // TAG : Pick Color */}
        {modalType === "colorPicker" && (
          <FlatList
            horizontal
            // numColumns={4}
            // columnWrapperStyle={{ justifyContent: 'space-between', padding: 8 }}
            data={colors}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
            keyExtractor={(item, id) => item?.name}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  style={{ marginRight: 8 }}
                  onPress={() => {
                    setSelectedItem(item);
                  }}
                >
                  {/* <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}> */}

                  {/* Color Circle */}
                  <View
                    style={{
                      height: 48,
                      width: 48,
                      borderRadius: 48 / 2,
                      backgroundColor: item.color,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IonIcons
                      name="checkmark-sharp"
                      size={24}
                      color={globalTheme.colors.background}
                      style={{
                        display:
                          selectedItem?.color === item?.color ? "flex" : "none",
                      }}
                    />
                  </View>

                  {/* </View> */}
                </TouchableOpacity>
              </>
            )}
          />
        )}

        {/* // TAG : Pick Icon */}
        {modalType === "iconPicker" && (
          <FlatList
            numColumns={6}
            columnWrapperStyle={{ justifyContent: "space-between", padding: 8 }}
            showsHorizontalScrollIndicator={false}
            data={props}
            style={{ height: "100%" }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
            keyExtractor={(item, id) => item?.name}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  style={{ marginRight: 8 }}
                  onPress={() => {
                    setSelectedItem(item);
                  }}
                >
                  {/* <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}> */}

                  {/* Color Circle */}
                  <View
                    style={{
                      height: 48,
                      width: 48,
                      borderWidth: 2,
                      borderRadius: 48 / 2,
                      borderColor:
                        selectedItem?.name === item.name
                          ? globalTheme.colors.primary
                          : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.pack === "IonIcons" && (
                      <IonIcons
                        name={item.name}
                        size={24}
                        color={
                          item.color === "default"
                            ? globalTheme.colors.foreground
                            : item.color
                        }
                      />
                    )}
                    {/* <IonIcons name='checkmark-sharp' size={24} color={globalTheme.colors.background} style={{ display: selected?.color === item?.color ? 'flex' : 'none' }} /> */}
                  </View>

                  {/* </View> */}
                </TouchableOpacity>
              </>
            )}
          />
        )}

        {/* // TAG : Action Button */}
        <View
          style={{
            height: 16,
          }}
        />
        <ActionButtonWrapper paddingHorizontal={64}>
          {/* // TAG : Cancel Button */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <ButtonSecondary
              label="Cancel"
              onPress={() => navigation.goBack()}
            />
          </View>
          {/* // TAG : Save Button */}
          <View style={{ flex: 2, paddingLeft: 8 }}>
            {!showButton && (
              <>
                <ButtonDisabled label={mainButtonLabel} />
              </>
            )}
            {mainButtonLabel?.toLowerCase() !== "delete" && showButton && (
              <ButtonPrimary
                label={mainButtonLabel}
                onPress={() => {
                  if (isTextInput && !textInput) {
                    Alert.alert(
                      "Error",
                      "Please enter a value",
                      [
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ],
                      { cancelable: false }
                    );
                  }

                  if (isTextInput && textInput) {
                    onPressReturn();
                    navigation.goBack();
                  }

                  if (!isTextInput) {
                    onPressReturn();
                    navigation.goBack();
                  }
                }}
              />
            )}
            {mainButtonLabel?.toLowerCase() === "delete" && showButton && (
              <ButtonPrimaryDanger
                label={mainButtonLabel}
                onPress={() => {
                  if (isTextInput && !textInput) {
                    Alert.alert(
                      "Error",
                      "Please enter a value",
                      [
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ],
                      { cancelable: false }
                    );
                  }

                  if (isTextInput && textInput) {
                    onPressReturn();
                    navigation.goBack();
                  }

                  if (!isTextInput) {
                    onPressReturn();
                    navigation.goBack();
                  }
                }}
              />
            )}
          </View>
        </ActionButtonWrapper>
      </View>
    </>
  );
};

export default ModalScreen;
