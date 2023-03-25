import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import Animated, { useSharedValue } from "react-native-reanimated";
import IonIcons from "react-native-vector-icons/Ionicons";
import ActionButtonWrapper from "../../components/ActionButtonWrapper";
import {
  ButtonDisabled,
  ButtonPrimary,
  ButtonPrimaryDanger,
  ButtonSecondary,
} from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import KeyboardViewWrapper from "../../components/KeyboardWrapper";
import { ListItem } from "../../components/List";
import { TextPrimary } from "../../components/Text";
import MODAL_TYPE_CONSTANTS from "../../constants/modalTypeConstants";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils/";

let keepOffsetYValue = 0;
let latestDefaultOptionName = null;

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
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [selectedItem, setSelectedItem] = useState(defaultOption);
  const [textInput, setTextInput] = useState(
    modalType === MODAL_TYPE_CONSTANTS.TEXT_INPUT ? defaultOption : null
  );
  const [searchQuery, setSearchQuery] = useState(defaultOption?.name);
  const [showButton, setShowButton] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showTemporaryDatePicker, setShowTemporaryDatePicker] = useState(false);
  const [offsetYValue, setOffsetYValue] = useState(0);
  const textInputRef = useRef();
  const searchInputRef = useRef();
  const flatListRef = useRef();

  const cardHeight =
    modalType === MODAL_TYPE_CONSTANTS.CURRENCY_LIST ? "85%" : "60%";

  const useSearchButton =
    modalType === MODAL_TYPE_CONSTANTS.CURRENCY_LIST ? true : false;

  const temporaryOffsetY = useSharedValue(0);

  const colors = [
    { name: "Default", color: globalTheme.colors.foreground },
    { name: "Red", color: "#FF5252" },
    { name: "Blue", color: "#2196F3" },
    { name: "Green", color: "#4CAF50" },
    { name: "Yellow", color: "#FFEB3B" },
    { name: "Orange", color: "#FF9800" },
    { name: "Purple", color: "#9C27B0" },
  ];

  const getItemLayout = (data, index, numColumns) => {
    const totalRows = Math.round(data.length / numColumns);
    const rowIndex = Math.round(index / numColumns);
    const rowHeight = 48;
    const rowOffset = rowIndex * rowHeight;
    return {
      length: data.length,
      offset: Math.round(rowOffset),
      // offset: 48 * keepOffsetYValue,
      index,
    };
  };

  useEffect(() => {
    // setSelectedItem(defaultOption);
    // setTextInput(defaultOption);
    resetOffsetYValue(defaultOption);
    scrollToIndexOnStart();
  }, []);

  const resetOffsetYValue = (defaultOption) => {
    const newOptionName = defaultOption?.name;
    const previousOptionName = latestDefaultOptionName;
    const isOptionSame = newOptionName === previousOptionName;

    if (!isOptionSame) {
      keepOffsetYValue = 0;
      latestDefaultOptionName = newOptionName;
    }
  };

  const scrollToIndexOnStart = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        animated: true,
        offset: keepOffsetYValue,
      });
    }, 0);
  };

  const onFlatListLayoutChange = (event, numColumns) => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        animated: false,
        offset: offsetYValue,
      });
    }, 0);
  };

  const onScrollHandler = (event) => {
    const { contentOffset } = event.nativeEvent;
    console.log("contentOffset Y", contentOffset.y);
    const offsetY = contentOffset.y < 0 ? 0 : contentOffset.y;
    temporaryOffsetY.value = offsetY;
  };

  const onTapItem = (item) => {
    setOffsetYValue(temporaryOffsetY.value);
    keepOffsetYValue = temporaryOffsetY.value;
    latestDefaultOptionName = item.name;
    setSelectedItem(item);
  };

  useEffect(() => {
    if (!!selectedItem || !!textInput) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [selectedItem, textInput]);

  useEffect(() => {
    if (showSearchBar) {
      searchInputRef.current?.focus();
    }
  }, [showSearchBar]);

  useEffect(() => {}, [showTemporaryDatePicker]);

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
      case MODAL_TYPE_CONSTANTS.ICON_PICKER:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.NUMBER_PICKER:
        return selected(selectedItem);
      case MODAL_TYPE_CONSTANTS.ACTION:
        return selected(selectedItem);

      default:
        return;
    }
  };

  const isNumberPicker = modalType === MODAL_TYPE_CONSTANTS.NUMBER_PICKER;
  const isDatePicker = modalType === MODAL_TYPE_CONSTANTS.DATE_PICKER;
  const isDateAndTimePicker =
    modalType === MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER;
  const isColorPicker = modalType === MODAL_TYPE_CONSTANTS.COLOR_PICKER;
  const isCurrencyList = modalType === MODAL_TYPE_CONSTANTS.CURRENCY_LIST;
  const isTextInput = modalType === MODAL_TYPE_CONSTANTS.TEXT_INPUT;
  const isList = modalType === MODAL_TYPE_CONSTANTS.LIST;
  const isIconPicker = modalType === MODAL_TYPE_CONSTANTS.ICON_PICKER;
  const isAction = modalType === MODAL_TYPE_CONSTANTS.ACTION;

  const themeVariant = globalTheme.identifier.id.includes("light")
    ? "light"
    : "dark";
  const textColor = globalTheme.text.textPrimary.color;

  const TopRightComponent = ({ ref }) => {
    switch (modalType) {
      case MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER:
        return (
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
        );

      default:
        break;
    }
  };

  const CurrencyListItemMemo = useMemo(
    () => CurrencyListItemRender,
    shouldCurrencyItemListRerender
  );

  const keyExtractor = useCallback((item, index) => item?.name + index, []);

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
      <KeyboardViewWrapper isTextInput={isTextInput}>
        <View
          style={[
            {
              backgroundColor: globalTheme.colors.background,
            },
            {
              display: "flex",
              justifyContent: "flex-start",
              maxHeight: cardHeight,
              height: useSearchButton ? cardHeight : null,
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
              {!showSearchBar && (
                <TextPrimary
                  label={title}
                  style={{ fontSize: 24, paddingRight: 0 }}
                />
              )}
              <TopRightComponent ref={searchInputRef} />

              {useSearchButton && (
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    // padding: 4,
                    borderRadius: 8,
                    // backgroundColor: globalTheme.colors.secondary,
                  }}
                >
                  {/* // TAG : Top Right Search Bar */}
                  {!showSearchBar && (
                    <IonIcons
                      name="search"
                      size={24}
                      color={globalTheme.colors.foreground}
                      style={{
                        padding: 8,
                        paddingLeft: 64,
                      }}
                      onPress={() => {
                        setShowSearchBar(true);
                      }}
                    />
                  )}
                  {showSearchBar && (
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          // maxWidth: "80%",
                          flex: 1,
                        }}
                      >
                        <CustomTextInput
                          inputRef={searchInputRef}
                          inputQuery={searchQuery}
                          noMargin={true}
                          inputType="search"
                          placeholder="Search"
                          onClearText={() => setSelectedItem(null)}
                          onChange={(text) => setSearchQuery(text)}
                        />
                      </View>
                      <IonIcons
                        name="close"
                        size={24}
                        color={globalTheme.colors.foreground}
                        style={{
                          padding: 16,
                        }}
                        onPress={() => {
                          setShowSearchBar(false);
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {showTemporaryDatePicker && (
            <>
              <RNDateTimePicker
                mode="date"
                display="spinner"
                textColor={textColor}
                themeVariant={themeVariant}
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
            </>
          )}

          {!showTemporaryDatePicker && (
            <>
              {/* // TAG : isNumberPicker */}
              {isNumberPicker && (
                <>
                  <FlatList
                    numColumns={7}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                      padding: 8,
                    }}
                    showsHorizontalScrollIndicator={false}
                    data={props}
                    style={
                      {
                        // height: "100%",
                      }
                    }
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
                          onPress={() => {
                            setSelectedItem(item);
                          }}
                        >
                          {/* Color Circle */}
                          <View
                            style={{
                              height: 48,
                              width: 48,
                              borderRadius: 48 / 2,
                              backgroundColor:
                                selectedItem?.name === item.name
                                  ? globalTheme.colors.primary
                                  : "transparent",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TextPrimary
                              label={item.name}
                              style={{
                                fontWeight:
                                  selectedItem?.name === item.name
                                    ? "bold"
                                    : "normal",
                                color:
                                  selectedItem?.name === item.name
                                    ? globalTheme.colors.background
                                    : globalTheme.text.textPrimary.color,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  />
                </>
              )}

              {/* // TAG : isDatePicker */}
              {isDatePicker && (
                <>
                  <RNDateTimePicker
                    mode="date"
                    display="spinner"
                    textColor={textColor}
                    themeVariant={themeVariant}
                    value={new Date(selectedItem)}
                    minimumDate={
                      minimumDateInMillis ? new Date(minimumDateInMillis) : null
                    }
                    onChange={(event, selectedDate) => {
                      const currentDate =
                        selectedDate || new Date(selectedItem);
                      event.type === "set" &&
                        setSelectedItem(currentDate.getTime());
                      event.type === "dismissed";
                    }}
                  />
                </>
              )}

              {/* // TAG : isDateAndTimePicker */}
              {isDateAndTimePicker && (
                <>
                  <RNDateTimePicker
                    mode="datetime"
                    display="spinner"
                    textColor={textColor}
                    themeVariant={themeVariant}
                    value={new Date(selectedItem)}
                    minimumDate={
                      minimumDateInMillis ? new Date(minimumDateInMillis) : null
                    }
                    onChange={(event, selectedDate) => {
                      const currentDate =
                        selectedDate || new Date(selectedItem);
                      event.type === "set" &&
                        setSelectedItem(currentDate.getTime());
                      event.type === "dismissed";
                    }}
                  />
                </>
              )}

              {/* // TAG : isList */}
              {isList && (
                <>
                  <FlatList
                    ref={flatListRef}
                    data={props}
                    getItemLayout={(data, index) =>
                      getItemLayout(data, index, 1)
                    }
                    onLayout={(event) => onFlatListLayoutChange(event, 1)}
                    onMomentumScrollEnd={onScrollHandler}
                    onScrollEndDrag={onScrollHandler}
                    keyExtractor={(item, id) => item?.name + id}
                    renderItem={({ item, index }) => (
                      <>
                        <ListItem
                          pressable
                          iconLeftName={item?.icon?.name || iconProps?.name}
                          iconPack={
                            item?.icon?.pack || iconProps?.pack || "IonIcons"
                          }
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
                          leftLabel={utils.upperCaseThisFirstLetter(item?.name)}
                          onPress={() => {
                            onTapItem(item);
                          }}
                        />
                      </>
                    )}
                  />
                </>
              )}

              {/* // TAG : isCurrencyList */}
              {isCurrencyList && (
                <>
                  {/* // TAG : !showSearchBar */}
                  {!showSearchBar && (
                    <>
                      <FlatList
                        ref={flatListRef}
                        data={props}
                        getItemLayout={(data, index) =>
                          getItemLayout(data, index, 1)
                        }
                        // maxToRenderPerBatch={props.length}
                        initialNumToRender={Math.round(props.length / 4)}
                        onLayout={(event) => onFlatListLayoutChange(event, 1)}
                        onMomentumScrollEnd={onScrollHandler}
                        onScrollEndDrag={onScrollHandler}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => (
                          <>
                            <CurrencyListItemMemo
                              item={item}
                              globalTheme={globalTheme}
                              isSelected={item.name === selectedItem?.name}
                              onTapItem={(item) => onTapItem(item)}
                            />
                          </>
                        )}
                      />
                    </>
                  )}
                  {/* // TAG : !!showSearchBar */}
                  {!!showSearchBar && (
                    <>
                      <FlatList
                        ref={flatListRef}
                        data={props.filter(
                          (item) =>
                            item.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            item.currencyCode
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )}
                        getItemLayout={(data, index) =>
                          getItemLayout(data, index, 1)
                        }
                        onLayout={(event) => onFlatListLayoutChange(event, 1)}
                        onMomentumScrollEnd={onScrollHandler}
                        onScrollEndDrag={onScrollHandler}
                        keyExtractor={(item, id) => item?.name + id}
                        ListEmptyComponent={() => {
                          return (
                            <View style={{ padding: 16 }}>
                              <TextPrimary label="No results found" />
                            </View>
                          );
                        }}
                        renderItem={({ item }) => (
                          <>
                            <CurrencyListItemRender
                              item={item}
                              globalTheme={globalTheme}
                              selectedItem={selectedItem}
                              onTapItem={(item) => onTapItem(item)}
                            />
                          </>
                        )}
                      />
                    </>
                  )}
                </>
              )}

              {/* // TAG : isTextInput */}
              {isTextInput && (
                <>
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
                      placeholderTextColor={
                        globalTheme.text.textSecondary.color
                      }
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
                </>
              )}

              {/* // TAG : isAction */}
              {isAction && (
                <>
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
              )}

              {/* // TAG : isColorPicker */}
              {isColorPicker && (
                <>
                  <FlatList
                    horizontal
                    // numColumns={4}
                    // columnWrapperStyle={{ justifyContent: 'space-between', padding: 8 }}
                    data={colors}
                    getItemLayout={(data, index) =>
                      getItemLayout(data, index, 1)
                    }
                    onLayout={(event) => onFlatListLayoutChange(event, 1)}
                    onMomentumScrollEnd={onScrollHandler}
                    onScrollEndDrag={onScrollHandler}
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
                            onTapItem(item);
                          }}
                        >
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
                        </TouchableOpacity>
                      </>
                    )}
                  />
                </>
              )}

              {/* // TAG : isIconPicker */}
              {isIconPicker && (
                <>
                  <Animated.FlatList
                    ref={flatListRef}
                    numColumns={6}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                      padding: 8,
                    }}
                    snapToAlignment="center"
                    onLayout={(event) => onFlatListLayoutChange(event, 6)}
                    showsHorizontalScrollIndicator={false}
                    data={props}
                    style={{ height: "100%" }}
                    contentContainerStyle={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMomentumScrollEnd={onScrollHandler}
                    onScrollEndDrag={onScrollHandler}
                    getItemLayout={(data, index) =>
                      getItemLayout(data, index, 1)
                    }
                    keyExtractor={(item, id) => item?.name}
                    renderItem={({ item, index }) => (
                      <>
                        <TouchableOpacity
                          style={{ marginRight: 8 }}
                          onPress={() => {
                            onTapItem(item);
                          }}
                        >
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
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  />
                </>
              )}
            </>
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
      </KeyboardViewWrapper>
    </>
  );
};

export default ModalScreen;

const shouldCurrencyItemListRerender = (prevProps, nextProps) => {
  const { isSelected } = prevProps;
  const { isSelected: isNextSelected } = nextProps;
  if (isSelected === isNextSelected) return true;
  return false;
};

const CurrencyListItemRender = ({
  item,
  selectedItem,
  isSelected = false,
  globalTheme,
  onTapItem,
}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => {
        onTapItem(item);
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
          <View>
            <TextPrimary
              label={`${utils.upperCaseThisFirstLetter(item?.name)}`}
            />
            <TextPrimary
              label={`${utils.upperCaseThisFirstLetter(item?.currencyCode)} / ${
                item?.symbol
              }`}
            />
          </View>
          {isSelected && (
            <IonIcons
              name="checkmark-circle"
              size={22}
              color={globalTheme.colors.foreground}
            />
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};
