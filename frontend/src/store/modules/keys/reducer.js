import produce from "immer";
import { Types as KeysTypes } from "./actions";

const INITIAL_STATE = {
  list: null,
  loading: false,
  accessKey: {
    loading: false,
    permissions: null,
    idCurrentPermission: null,
  },
  save: {
    loading: false,
    success: false,
    fail: false,
  },
  delete: {
    loading: false,
    success: false,
    fail: false,
  },
};

export default function keys(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case KeysTypes.GET_KEYS: {
        draft.loading = true;
        break;
      }
      case KeysTypes.GET_KEYS_SUCCESS: {
        draft.loading = false;
        draft.list = action.payload;
        break;
      }
      case KeysTypes.GET_KEYS_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      case KeysTypes.BIND_KEY: {
        draft.loading = true;
        break;
      }
      case KeysTypes.BIND_KEY_SUCCESS: {
        draft.loading = false;
        break;
      }
      case KeysTypes.BIND_KEY_FAIL: {
        draft.loading = false;
        draft.list = null;
        break;
      }
      case KeysTypes.GET_ACCESS_KEY: {
        draft.accessKey.loading = true;
        break;
      }
      case KeysTypes.GET_ACCESS_KEY_SUCCESS: {
        draft.accessKey.loading = false;
        draft.accessKey.permissions = action.payload.permissions;
        break;
      }
      case KeysTypes.GET_ACCESS_KEY_FAIL: {
        draft.accessKey.loading = false;
        draft.accessKey.permissions = null;
        break;
      }
      case KeysTypes.SET_ID_PERMISSION: {
        draft.accessKey.idCurrentPermission = action.payload;
        break;
      }
      case KeysTypes.SAVE_SCHEDULE: {
        draft.save.loading = true;
        break;
      }
      case KeysTypes.SAVE_SCHEDULE_SUCCESS: {
        draft.save.loading = false;
        draft.save.success = true;
        break;
      }
      case KeysTypes.SAVE_SCHEDULE_FAIL: {
        draft.save.loading = false;
        draft.save.fail = true;
        break;
      }
      case KeysTypes.DELETE_SCHEDULE: {
        draft.delete.loading = true;
        break;
      }
      case KeysTypes.DELETE_SCHEDULE_SUCCESS: {
        draft.delete.loading = false;
        draft.delete.success = true;
        break;
      }
      case KeysTypes.DELETE_SCHEDULE_FAIL: {
        draft.delete.loading = false;
        draft.delete.fail = true;
        break;
      }
      case KeysTypes.SCHEDULE_RESET: {
        draft.save.loading = false;
        draft.save.success = false;
        draft.save.fail = false;
        draft.delete.loading = false;
        draft.delete.success = false;
        draft.delete.fail = false;
        break;
      }
      default:
    }
  });
}
