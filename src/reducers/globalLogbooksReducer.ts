import REDUCER_ACTIONS from "./reducer.action";

const globalLogbooksReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    case REDUCER_ACTIONS.LOGBOOKS.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.LOGBOOKS.SET_MULTI_ACTIONS:
      return {
        ...state,
        ...action.payload,
      };

    case REDUCER_ACTIONS.LOGBOOKS.SET:
      return {
        ...state,
        reducerUpdatedAt: Date.now(),
        logbooks: [action.payload].sort((a, b) => {
          return a.logbook_name < b.logbook_name ? -1 : 1;
        }),
      };

    case REDUCER_ACTIONS.LOGBOOKS.INSERT:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      const newLogbook = action.payload.newLogbook;
      let foundOtherLogbooks = state.logbooks.filter(
        (logbook) => logbook.logbook_id !== newLogbook.logbook_id
      );
      return {
        ...state,
        logbooks: [...foundOtherLogbooks, newLogbook].sort((a, b) => {
          return a.logbook_name < b.logbook_name ? -1 : 1;
        }),
        reducerUpdatedAt,
        // logbookInsertCounter: state.logbookInsertCounter + 1,
      };

    case REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let deleteLogbook = action.payload.deleteLogbook;

      // let isLogbookDuplicate = false;
      // state.logbooks.forEach((logbook) => {
      //   if (logbook.logbook_id === deleteLogbook.logbook_id) {
      //     isLogbookDuplicate = true;
      //   }
      // });
      // console.log({ isLogbookDuplicate });

      let foundOtherLogbook = state.logbooks.filter(
        (logbook) => logbook.logbook_id !== deleteLogbook.logbook_id
      );

      return {
        ...state,
        logbooks: [...foundOtherLogbook].sort((a, b) => {
          return a.logbook_name < b.logbook_name ? -1 : 1;
        }),
        reducerUpdatedAt,
        // logbookDeleteCounter: state.logbookDeleteCounter + 1,
      };

    case REDUCER_ACTIONS.LOGBOOKS.PATCH:
      console.log("1. patch logbook");
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let patchLogbook = action.payload.patchLogbook;
      // console.log(patchLogbook)
      let existingLogbook = null;
      let isPatchedLogbookHasNewerTimestamp = false;
      state.logbooks.forEach((logbook) => {
        if (logbook.logbook_id === patchLogbook.logbook_id) {
          existingLogbook = logbook;
        }
      });
      if (existingLogbook) {
        isPatchedLogbookHasNewerTimestamp =
          patchLogbook._timestamps.updated_at >
          existingLogbook._timestamps.updated_at;
      }
      // console.log({ isLogbookUpdateTimeSame: isPatchedLogbookHasNewerDate });
      // console.log({ existingLogbook });
      // Check duplicate between new and prev transaction
      if (existingLogbook && isPatchedLogbookHasNewerTimestamp) {
        console.log("2. patch logbook");
        // const foundLogbook = state.logbooks.filter(
        //   (logbook) => logbook.logbook_id === patchLogbook.logbook_id
        // );
        foundOtherLogbook = state.logbooks.filter(
          (logbook) => logbook.logbook_id !== patchLogbook.logbook_id
        );

        console.log("3. patched logbook");
        return {
          ...state,
          logbooks: [...foundOtherLogbook, patchLogbook].sort((a, b) => {
            return a.logbook_name < b.logbook_name ? -1 : 1;
          }),
          reducerUpdatedAt,
          // logbookPatchCounter: state.logbookPatchCounter + 1,
        };
      }
      return state;
    default:
      return state;
  }
};

export default globalLogbooksReducer;
