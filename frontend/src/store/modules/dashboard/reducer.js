import produce from "immer";
import { Types as DashboardTypes } from "./actions";

const INITIAL_STATE = {
  dashInfos: {
    dashboardInfos: null,
    loadingInfos: false,
  },
  accesses: {
    loadingAccesses: false,
    accessesInfos: null,
  },
  users: {
    usersInfos: null,
    loadingUsers: false,
  },
  history: {
    loadingHistory: false,
    accessesHistory: {},
  },
};

export default function dashboard(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case DashboardTypes.GET_DASHBOARD_INFOS: {
        draft.dashInfos.loadingInfos = true;
        break;
      }
      case DashboardTypes.GET_DASHBOARD_INFOS_SUCCESS: {
        draft.dashInfos.loadingInfos = false;
        draft.dashInfos.dashboardInfos = action.payload;
        break;
      }
      case DashboardTypes.GET_DASHBOARD_INFOS_FAIL: {
        draft.dashInfos.loadingInfos = false;
        draft.dashInfos.dashboardInfos = null;
        break;
      }
      case DashboardTypes.GET_ACCESSES_INFOS: {
        draft.accesses.loadingAccesses = true;
        break;
      }
      case DashboardTypes.GET_ACCESSES_INFOS_SUCCESS: {
        draft.accesses.loadingAccesses = false;
        draft.accesses.accessesInfos = action.payload;
        break;
      }
      case DashboardTypes.GET_ACCESSES_INFOS_FAIL: {
        draft.accesses.loadingAccesses = false;
        draft.accesses.accessesInfos = null;
        break;
      }
      case DashboardTypes.GET_USERS_INFOS: {
        draft.users.loadingUsers = true;
        break;
      }
      case DashboardTypes.GET_USERS_INFOS_SUCCESS: {
        draft.users.loadingUsers = false;
        draft.users.usersInfos = action.payload;
        break;
      }
      case DashboardTypes.GET_USERS_INFOS_FAIL: {
        draft.users.loadingUsers = false;
        draft.users.usersInfos = null;
        break;
      }
      case DashboardTypes.GET_ACCESSES_HISTORY: {
        draft.history.loadingAccesses = true;
        break;
      }
      case DashboardTypes.GET_ACCESSES_HISTORY_SUCCESS: {
        draft.history.loadingAccesses = false;
        draft.history.accessesHistory = action.payload;
        break;
      }
      case DashboardTypes.GET_ACCESSES_HISTORY_FAIL: {
        draft.history.loadingAccesses = false;
        draft.history.accessesHistory = null;
        break;
      }
      default:
    }
  });
}
