import produce from "immer";
import { Types as AuthenticationTypes } from "./actions";

const INITIAL_STATE = {
  user: null,
  loading: false,
  token: null,
};

export default function authentication(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case AuthenticationTypes.GET_AUTHENTICATION: {
        draft.loading = true;
        break;
      }
      case AuthenticationTypes.SUCCESS_AUTHENTICATION: {
        draft.loading = false;
        draft.user = action.payload;
        draft.token = action.payload.auth;
        break;
      }
      case AuthenticationTypes.FAILURE_AUTHENTICATION: {
        draft.loading = false;
        draft.user = null;
        draft.token = null;
        break;
      }
      case AuthenticationTypes.PURGE_AUTHENTICATION: {
        draft.user = null;
        draft.token = null;
        break;
      }
      default:
    }
  });
}
