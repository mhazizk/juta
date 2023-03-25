import { TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import Animated, { Transition } from "react-native-reanimated";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "./Text";
const CheckList = ({
  checkboxPlacement = "right",
  singleChecklist = false,
  disabled = false,
  marginRight = 16,
  viewOnly,
  primaryLabel,
  secondaryLabel,
  item,
  onPress,
  pressable,
  selected,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      {!singleChecklist && pressable && (
        <TouchableNativeFeedback
          onPress={() => {
            onPress(item);
          }}
        >
          {/* // TAG : Container */}
          <View
            style={{
              ...globalTheme.list.listContainer,
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 16,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "left" && (
              <Animated.View
                style={{
                  borderColor:
                    selected === item
                      ? "transparent"
                      : globalTheme.colors.secondary,
                  backgroundColor:
                    selected === item
                      ? globalTheme.colors.primary
                      : "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selected === item && (
                  <IonIcons
                    name="checkmark-sharp"
                    size={16}
                    color={globalTheme.colors.background}
                  />
                )}
              </Animated.View>
            )}

            <View
              style={{
                ...globalTheme.list.listItem,
                flex: 1,
                maxWidth: "80%",
                paddingVertical: 8,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {primaryLabel && <TextPrimary label={primaryLabel} />}
              {secondaryLabel && (
                <TextSecondary
                  label={secondaryLabel}
                  style={{ fontSize: 14 }}
                />
              )}
            </View>
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "right" && (
              <View
                style={{
                  borderColor:
                    selected === item
                      ? "transparent"
                      : globalTheme.colors.secondary,
                  backgroundColor:
                    selected === item
                      ? globalTheme.colors.primary
                      : "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selected === item && (
                  <IonIcons
                    name="checkmark-sharp"
                    size={16}
                    color={globalTheme.colors.background}
                  />
                )}
              </View>
            )}
          </View>
        </TouchableNativeFeedback>
      )}
      {!singleChecklist && disabled && (
        <TouchableNativeFeedback
          onPress={() => {
            onPress(item);
          }}
        >
          {/* // TAG : Container */}
          <View
            style={{
              ...globalTheme.list.listContainer,
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 16,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "left" && (
              <View
                style={{
                  borderColor:
                    selected === item
                      ? "transparent"
                      : globalTheme.colors.secondary,
                  backgroundColor:
                    selected === item
                      ? globalTheme.colors.secondary
                      : "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            )}

            <View
              style={{
                ...globalTheme.list.listItem,
                flex: 1,
                maxWidth: "80%",
                paddingVertical: 8,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {primaryLabel && (
                <TextSecondary
                  label={primaryLabel}
                  style={{
                    fontWeight: "bold",
                  }}
                />
              )}
              {secondaryLabel && (
                <TextSecondary
                  label={secondaryLabel}
                  style={{ fontSize: 14 }}
                />
              )}
            </View>
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "right" && (
              <View
                style={{
                  borderColor: globalTheme.colors.secondary,
                  backgroundColor: "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            )}
          </View>
        </TouchableNativeFeedback>
      )}

      {singleChecklist && pressable && (
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
        >
          {/* // TAG : Container */}
          <View
            style={{
              ...globalTheme.list.listContainer,
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 16,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "flex-start",
              // backgroundColor:'red'
            }}
          >
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "left" && (
              <View
                style={{
                  borderColor:
                    selected === item
                      ? "transparent"
                      : globalTheme.colors.secondary,
                  backgroundColor:
                    selected === item
                      ? globalTheme.colors.primary
                      : "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  marginRight: marginRight,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selected === item && (
                  <IonIcons
                    name="checkmark-sharp"
                    size={16}
                    color={globalTheme.colors.background}
                  />
                )}
              </View>
            )}

            <View
              style={{
                // ...globalTheme.list.listItem,
                flex: 1,
                maxWidth: "80%",
                paddingVertical: 8,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {primaryLabel && <TextPrimary label={primaryLabel} />}
              {secondaryLabel && (
                <TextSecondary
                  label={secondaryLabel}
                  style={{ fontSize: 14 }}
                />
              )}
            </View>
            {/* // TAG : Checkbox */}
            {checkboxPlacement === "right" && (
              <View
                style={{
                  borderColor:
                    selected === item
                      ? "transparent"
                      : globalTheme.colors.secondary,
                  backgroundColor:
                    selected === item
                      ? globalTheme.colors.primary
                      : "transparent",
                  height: 20,
                  width: 20,
                  borderWidth: 1.3,
                  borderRadius: 8,
                  // marginRight: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selected === item && (
                  <IonIcons
                    name="checkmark-sharp"
                    size={16}
                    color={globalTheme.colors.background}
                  />
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      {/* // SECTION : Checkbox View Only */}
      {singleChecklist && viewOnly && (
        <>
          {/* // TAG : Container */}
          <View
            style={{
              flexDirection: "row",
              // paddingHorizontal: 16,
              // backgroundColor:'red',
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {/* // TAG : Checkbox */}
            <View
              style={{
                // backgroundColor: "yellow",
                // height: 20,
                // width: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonIcons
                name={selected === item ? "checkmark-sharp" : "close-sharp"}
                size={16}
                color={
                  selected === item
                    ? globalTheme.colors.success
                    : globalTheme.colors.danger
                }
              />
            </View>

            <View
              style={{
                // flex: 1,
                paddingVertical: 2,
                paddingLeft: 8,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {primaryLabel && (
                <TextPrimary
                  label={primaryLabel}
                  style={{
                    color:
                      selected === item
                        ? globalTheme.colors.success
                        : globalTheme.colors.danger,
                  }}
                />
              )}
              {secondaryLabel && (
                <TextSecondary
                  label={secondaryLabel}
                  style={{ fontSize: 14 }}
                />
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default CheckList;
