import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  ButtonDisabled,
  ButtonPrimary,
  ButtonPrimaryDanger,
  ButtonSecondary,
} from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { ListItem } from "../../components/List";
import { TextPrimary } from "../../components/Text";
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [showButton, setShowButton] = useState(false);

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
    if (!!selectedItem || !!textInput) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [selectedItem, textInput]);

  useEffect(() => {
    setSelectedItem(defaultOption);
    setTextInput(defaultOption);
  }, []);

  const onPressReturn = () => {
    switch (true) {
      case modalType === "list" ||
        modalType === "currencyList" ||
        modalType === "colorPicker" ||
        modalType === "iconPicker":
        return selected(selectedItem);
      case modalType === "textInput":
        return selected(textInput);

      default:
        return;
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
        <View style={{ padding: 16 }}>
          <TextPrimary label={title} style={{ fontSize: 24 }} />
        </View>

        {/* // TAG : Flatlist Category Props */}
        {modalType === "list" && (
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
        )}

        {/* // TAG : Flatlist Params Currency */}
        {modalType === "currencyList" && (
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
                    <CountryFlag isoCode={item?.isoCode} size={18} />
                    <View
                      style={{
                        ...globalTheme.list.listItem,
                        paddingLeft: 16,
                      }}
                    >
                      <TextPrimary
                        label={`${
                          item?.name[0].toUpperCase() + item?.name.substring(1)
                        } / ${item?.symbol}`}
                      />
                      <IonIcons
                        name="checkmark-circle"
                        size={22}
                        style={{
                          display:
                            selectedItem?.name == item?.name ? "flex" : "none",
                        }}
                        color={globalTheme.colors.foreground}
                      />
                    </View>
                  </View>
                </TouchableNativeFeedback>
              </>
            )}
          />
        )}

        {/* // TAG : Text Input Params */}
        {modalType === "textInput" && (
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
              placeholder={placeholder}
              placeholderTextColor={globalTheme.text.textSecondary.color}
              defaultValue={defaultOption || ""}
              value={textInput}
              onChangeText={(input) => setTextInput(input)}
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
        )}

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
              onPress={() => navigation.goBack()}
            />
          </View>
          {/* // TAG : Save Button */}
          <View style={{ paddingLeft: 8 }}>
            {!showButton && (
              <>
                <ButtonDisabled label={mainButtonLabel} />
              </>
            )}
            {mainButtonLabel?.toLowerCase() !== "delete" && showButton && (
              <ButtonPrimary
                label={mainButtonLabel}
                onPress={() => {
                  if (modalType === "textInput" && !textInput) {
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

                  if (modalType === "textInput" && textInput) {
                    onPressReturn();
                    navigation.goBack();
                  }

                  if (modalType !== "textInput") {
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
                  if (modalType === "textInput" && !textInput) {
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

                  if (modalType === "textInput" && textInput) {
                    onPressReturn();
                    navigation.goBack();
                  }

                  if (modalType !== "textInput") {
                    onPressReturn();
                    navigation.goBack();
                  }
                }}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default ModalScreen;
