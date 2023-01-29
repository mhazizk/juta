import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";

const DatePicker = () => {
  // Date State for Date Picker
  //   const [date, setDate] = useState(Date.now());
  const date = Date.now();
  let targetDate = null;

  // Set Date in Date Picker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    targetDate = currentDate;
    // showTimePicker("time");
  };

  // Date Picker
  const showDatePicker = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  // Time Picker
  const showTimePicker = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  showDatePicker("date");
  return targetDate;
};

export default DatePicker;
