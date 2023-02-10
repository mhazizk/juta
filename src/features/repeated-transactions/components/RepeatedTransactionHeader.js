import { ScrollView, TouchableNativeFeedback, View } from "react-native";
import ListSection from "../../../components/List/ListSection";
import {
  TextButtonPrimary,
  TextPrimary,
  TextSecondary,
} from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const RepeatedTransactionHeader = ({ onPress, repeatSection }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  return (
    <>
      <ListSection>
        <TouchableNativeFeedback onPress={() => onPress()}>
          <View
            style={{
              padding: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* // TAG : Category Icon */}
            <View
              style={{
                paddingBottom: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcons
                name={utils.FindById.findCategoryIconNameById({
                  id: repeatSection.repeat_category_id,
                  categories: categories.categories,
                })}
                size={24}
                color={utils.FindById.findCategoryColorById({
                  id: repeatSection.repeat_category_id,
                  categories: categories.categories,
                  defaultColor: globalTheme.colors.foreground,
                })}
                style={{
                  paddingBottom: 8,
                }}
              />
              {/* // TAG : Category name */}
              <TextPrimary
                label={utils.FindById.findCategoryNameById({
                  id: repeatSection.repeat_category_id,
                  categories: categories.categories,
                })}
                style={{
                  paddingBottom: 8,
                  fontSize: 20,
                }}
              />
              <TextSecondary
                label={
                  repeatSection.repeat_in_out[0].toUpperCase() +
                  repeatSection.repeat_in_out.substring(1)
                }
              />
            </View>
            {/* // TAG : Repeat Amount */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Amount" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextSecondary
                  label={
                    utils.FindById.findLogbookById({
                      id: repeatSection.repeat_logbook_id,
                      logbooks: logbooks.logbooks,
                    }).logbook_currency?.symbol
                  }
                  style={{
                    marginRight: 4,
                    fontSize: 14,
                  }}
                />
                <TextPrimary
                  label={utils.getFormattedNumber({
                    value: repeatSection.repeat_amount,
                    currencyIsoCode: utils.FindById.findLogbookById({
                      id: repeatSection.repeat_logbook_id,
                      logbooks: logbooks.logbooks,
                    }).logbook_currency.isoCode,
                    negativeSymbol:
                      appSettings.logbookSettings.negativeCurrencySymbol,
                  })}
                />
              </View>
            </View>

            {/* // TAG : Logbook */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Logbook" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="book"
                  size={20}
                  color={globalTheme.colors.foreground}
                  style={{
                    marginRight: 8,
                  }}
                />
                <TextPrimary
                  label={
                    utils.FindById.findLogbookById({
                      id: repeatSection.repeat_logbook_id,
                      logbooks: logbooks.logbooks,
                    }).logbook_name[0]?.toUpperCase() +
                    utils.FindById.findLogbookById({
                      id: repeatSection.repeat_logbook_id,
                      logbooks: logbooks.logbooks,
                    }).logbook_name.substring(1)
                  }
                />
              </View>
            </View>

            {/* // TAG : Repeat Frequency */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Repeat Frequency" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="repeat"
                  size={20}
                  color={globalTheme.colors.foreground}
                  style={{
                    marginRight: 8,
                  }}
                />
                <TextPrimary
                  label={
                    repeatSection.repeat_type.name[0].toUpperCase() +
                    repeatSection.repeat_type.name.substring(1)
                  }
                />
              </View>
            </View>

            {/* // TAG : Repeat status */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Status" />
              <View
                style={{
                  flexDirection: "row",
                  // marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  // paddingHorizontal: 8,
                  // paddingVertical: 4,
                  // borderRadius: 16,
                  // backgroundColor:
                  //   repeatSection.repeat_status === "active"
                  //     ? globalTheme.colors.success
                  //     : globalTheme.colors.danger,
                }}
              >
                <IonIcons
                  name="ellipse"
                  size={16}
                  color={
                    repeatSection.repeat_status === "active"
                      ? globalTheme.colors.success
                      : globalTheme.colors.danger
                  }
                  style={{
                    marginRight: 4,
                  }}
                />

                <TextPrimary
                  label={
                    repeatSection.repeat_status[0].toUpperCase() +
                    repeatSection.repeat_status.substring(1)
                  }
                  style={{
                    color:
                      repeatSection.repeat_status === "active"
                        ? globalTheme.colors.success
                        : globalTheme.colors.danger,
                  }}
                />
              </View>
            </View>

            {/* // TAG : Repeat notes */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Notes" />
              <TextPrimary label={repeatSection.repeat_notes || "No notes"} />
            </View>

            {/* // TAG : Next repeat date */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
              }}
            >
              <TextPrimary label="Next repeat" />
              <TextPrimary
                label={new Date(repeatSection.next_repeat_date).toDateString()}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      </ListSection>
    </>
  );
};
export default RepeatedTransactionHeader;
