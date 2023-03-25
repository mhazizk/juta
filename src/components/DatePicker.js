import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

const DatePicker = (dateInMillis) => {
  return (
    <>
      <DateTimePicker
        mode="datetime"
        value={new Date(dateInMillis)}
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || date;
          setShow(Platform.OS === "ios");
          setDate(currentDate);
        }}
      />
    </>
  );
};

export default DatePicker;
