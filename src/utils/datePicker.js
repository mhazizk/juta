import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// Date Picker
const showMode = ({ currentMode, selectedDate, callback }) => {
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
      is24Hour: true,
    });
  }
  if (currentMode === "time") {
    DateTimePickerAndroid.open({
      positiveButtonLabel: "Set",
      value: selectedDate,
      onChange: onChange,
      mode: currentMode,
      is24Hour: true,
    });
  }
};

// Date Picker
const datePicker = ({ initialDateInMillis, pickerStyle, callback }) => {
  switch (pickerStyle) {
    case "dateOnly":
      showMode({
        currentMode: "date",
        selectedDate: new Date(initialDateInMillis),
        callback: (date) => callback(new Date(date).getTime()),
      });
      break;
    case "dateAndTime":
      showMode({
        currentMode: "date",
        selectedDate: new Date(initialDateInMillis),
        callback: (date) =>
          showMode({
            currentMode: "time",
            selectedDate: date,
            callback: (dateWithTime) =>
              callback(new Date(dateWithTime).getTime()),
          }),
      });

    default:
      break;
  }
};

export default datePicker;
