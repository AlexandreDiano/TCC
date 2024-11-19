import produce from "immer";
import { Types as DoorsTypes } from "./actions";

const INITIAL_STATE = {
  list: null,
  loading: false,
};

export default function doors(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case DoorsTypes.GET_DOORS: {
        draft.loading = true;
        break;
      }
      case DoorsTypes.GET_DOORS_SUCCESS: {
        draft.loading = false;
        draft.list = action.payload;
        break;
      }
      case DoorsTypes.GET_DOORS_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      case DoorsTypes.CREATE_DOOR: {
        draft.loading = true;
        break;
      }
      case DoorsTypes.CREATE_DOOR_SUCCESS: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.CREATE_DOOR_FAIL: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.UPDATE_DOOR: {
        draft.loading = true;
        break;
      }
      case DoorsTypes.UPDATE_DOOR_SUCCESS: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.UPDATE_DOOR_FAIL: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.DELETE_DOOR: {
        draft.loading = true;
        break;
      }
      case DoorsTypes.DELETE_DOOR_SUCCESS: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.DELETE_DOOR_FAIL: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.BIND_DOOR: {
        draft.loading = true;
        break;
      }
      case DoorsTypes.BIND_DOOR_SUCCESS: {
        draft.loading = false;
        break;
      }
      case DoorsTypes.BIND_DOOR_FAIL: {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
