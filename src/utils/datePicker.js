import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { getCalendars } from "expo-localization";

const is24Hours = getCalendars()[0]?.uses24hourClock;

// Date Picker Show Mode
const showMode = ({ currentMode, minimumDate, selectedDate, callback }) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    event.type === "set" && callback(currentDate);
    event.type === "dismissed";
  };

  if (currentMode === "date") {
    DateTimePickerAndroid.open({
      positiveButtonLabel: "Set",
      value: selectedDate,
      onChange: onChange,
      mode: currentMode,
      is24Hour: is24Hours,
      minimumDate: minimumDate,
    });
  }
  if (currentMode === "time") {
    DateTimePickerAndroid.open({
      positiveButtonLabel: "Set",
      value: selectedDate,
      onChange: onChange,
      mode: currentMode,
      is24Hour: is24Hours,
      minimumDate: minimumDate,
    });
  }
};

/**
 * Date Picker
 *
 * @param initialDateInMillis - Initial Date in Milliseconds
 * @param minimumDateInMillis - Minimum Date in Milliseconds
 * @param pickerStyle - Date Picker Style (dateOnly, dateAndTime)
 * @param callback - Callback function
 */
const datePicker = ({
  initialDateInMillis,
  minimumDateInMillis,
  pickerStyle,
  callback,
}) => {
  switch (Platform.OS) {
    case "android":
      switch (pickerStyle) {
        case "dateOnly":
          showMode({
            minimumDate: minimumDateInMillis
              ? new Date(minimumDateInMillis)
              : null,
            currentMode: "date",
            selectedDate: new Date(initialDateInMillis),
            callback: (date) => callback(new Date(date).getTime()),
          });
          break;
        case "dateAndTime":
          showMode({
            minimumDate: minimumDateInMillis
              ? new Date(minimumDateInMillis)
              : null,
            currentMode: "date",
            selectedDate: new Date(initialDateInMillis),
            callback: (date) =>
              showMode({
                minimumDate: minimumDateInMillis
                  ? new Date(minimumDateInMillis)
                  : null,
                currentMode: "time",
                selectedDate: date,
                callback: (dateWithTime) =>
                  callback(new Date(dateWithTime).getTime()),
              }),
          });
          break;

        default:
          break;
      }
      break;
  }
};

export default datePicker;
