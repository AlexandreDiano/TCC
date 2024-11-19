import produce from "immer";
import { Types as VirtualDoorTypes } from "./actions";

const INITIAL_STATE = {
  status: "closed",
  loadingDoor: false,
  loadingTag: false,
};

export default function users(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      // Open Door
      case VirtualDoorTypes.SEND_OPEN_DOOR: {
        draft.loadingDoor = true;
        break;
      }
      case VirtualDoorTypes.SEND_OPEN_DOOR_SUCCESS: {
        draft.loadingDoor = false;
        draft.status = "opened";
        break;
      }
      case VirtualDoorTypes.SEND_OPEN_DOOR_FAIL: {
        draft.loadingDoor = false;
        break;
      }
      case VirtualDoorTypes.CLOSE_DOOR: {
        draft.status = "closed";
        break;
      }

      // Register Tag
      case VirtualDoorTypes.SEND_REGISTER_TAG: {
        draft.loadingTag = true;
        break;
      }
      case VirtualDoorTypes.SEND_REGISTER_TAG_SUCCESS: {
        draft.loadingTag = false;
        break;
      }
      case VirtualDoorTypes.SEND_REGISTER_TAG_FAIL: {
        draft.loadingTag = false;
        break;
      }

      default:
    }
  });
}
