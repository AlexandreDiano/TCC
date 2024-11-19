import produce from "immer";
import { Types as UsersTypes } from "./actions";

const INITIAL_STATE = {
  list: null,
  loading: false,
};

export default function users(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UsersTypes.GET_USERS: {
        draft.loading = true;
        break;
      }
      case UsersTypes.GET_USERS_SUCCESS: {
        draft.loading = false;
        draft.list = action.payload;
        break;
      }
      case UsersTypes.GET_USERS_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      case UsersTypes.CREATE_USER: {
        draft.loading = true;
        break;
      }
      case UsersTypes.CREATE_USER_SUCCESS: {
        draft.loading = false;
        break;
      }
      case UsersTypes.CREATE_USER_FAIL: {
        draft.loading = false;
        break;
      }
      case UsersTypes.UPDATE_USER: {
        draft.loading = true;
        break;
      }
      case UsersTypes.UPDATE_USER_SUCCESS: {
        draft.loading = false;
        break;
      }
      case UsersTypes.UPDATE_USER_FAIL: {
        draft.loading = false;
        break;
      }
      case UsersTypes.DELETE_USER: {
        draft.loading = true;
        break;
      }
      case UsersTypes.DELETE_USER_SUCCESS: {
        draft.loading = false;
        break;
      }
      case UsersTypes.DELETE_USER_FAIL: {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
