import { LogbookType, LogbookCurrencyType } from "../@types/logbook";
import uuid from "react-native-uuid";

interface newLogbookProps {
  uid: string | number[];
  name: string;
  group_id?: string | number[] | null;
  logbook_currency: LogbookCurrencyType;
}

/**
 *
 * function to create new logbook object
 * @function newLogbook
 * @param props uid
 * @param props name
 * @param props group_id
 * @param props logbook_currency
 * @returns new logbook object
 */
const newLogbook = (props: newLogbookProps) => {
  return {
    _timestamps: {
      created_at: Date.now(),
      created_by: props.uid,
      updated_at: Date.now(),
      updated_by: props.uid,
    },
    uid: props.uid,
    group_id: props.group_id,
    logbook_currency: props.logbook_currency,
    logbook_type: "basic",
    logbook_id: uuid.v4(),
    logbook_name: props.name,
  } satisfies LogbookType;
};

export default newLogbook;
