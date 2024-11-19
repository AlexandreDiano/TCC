import produce from "immer";
import { Types as AccessesTypes } from "./actions";

const INITIAL_STATE = {
  list: null,
  loading: false,
};

export default function accesses(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case AccessesTypes.GET_ACCESSES: {
        draft.loading = true;
        break;
      }
      case AccessesTypes.GET_ACCESSES_SUCCESS: {
        draft.loading = false;
        draft.list = action.payload;
        break;
      }
      case AccessesTypes.GET_ACCESSES_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      case AccessesTypes.GET_FILTERED_ACCESSES: {
        draft.loading = true;
        break;
      }
      case AccessesTypes.GET_FILTERED_ACCESSES_SUCCESS: {
        draft.loading = false;
        draft.list = action.payload;
        break;
      }
      case AccessesTypes.GET_FILTERED_ACCESSES_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      default:
    }
  });
}
