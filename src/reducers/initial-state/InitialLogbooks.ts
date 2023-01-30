import { GlobalLogbook } from "../../@types/logbook";

const initialLogbooks = {
  reducerUpdatedAt: Date.now(),
  logbooks: [],
} satisfies GlobalLogbook;

export default initialLogbooks;
