export const Types = {
  // Dashboard Infos
  GET_DASHBOARD_INFOS: "dashboard/GET_DASHBOARD_INFOS",
  GET_DASHBOARD_INFOS_SUCCESS: "dashboard/GET_DASHBOARD_INFOS_SUCCESS",
  GET_DASHBOARD_INFOS_FAIL: "dashboard/GET_DASHBOARD_INFOS_FAIL",

  // Last Accesses
  GET_ACCESSES_INFOS: "dashboard/GET_ACCESSES_INFOS",
  GET_ACCESSES_INFOS_SUCCESS: "dashboard/GET_ACCESSES_INFOS_SUCCESS",
  GET_ACCESSES_INFOS_FAIL: "dashboard/GET_ACCESSES_INFOS_FAIL",

  // Last Users
  GET_USERS_INFOS: "dashboard/GET_USERS_INFOS",
  GET_USERS_INFOS_SUCCESS: "dashboard/GET_USERS_INFOS_SUCCESS",
  GET_USERS_INFOS_FAIL: "dashboard/GET_USERS_INFOS_FAIL",

  // Accesses History
  GET_ACCESSES_HISTORY: "dashboard/GET_ACCESSES_HISTORY",
  GET_ACCESSES_HISTORY_SUCCESS: "dashboard/GET_ACCESSES_HISTORY_SUCCESS",
  GET_ACCESSES_HISTORY_FAIL: "dashboard/GET_ACCESSES_HISTORY_FAIL",
};

export const Creators = {
  // Dashboard Infos
  getDashboardInfos: () => ({ type: Types.GET_DASHBOARD_INFOS }),
  getDashboardInfosSuccess: (data) => ({
    type: Types.GET_DASHBOARD_INFOS_SUCCESS,
    payload: data,
  }),
  getDashboardInfosFail: () => ({ type: Types.GET_DASHBOARD_INFOS_FAIL }),

  // Last Accesses
  getAccessesInfos: () => ({ type: Types.GET_ACCESSES_INFOS }),
  getAccessesInfosSuccess: (data) => ({
    type: Types.GET_ACCESSES_INFOS_SUCCESS,
    payload: data,
  }),
  getAccessesInfosFail: () => ({ type: Types.GET_ACCESSES_INFOS_FAIL }),

  // Last Users
  getUsersInfos: () => ({ type: Types.GET_USERS_INFOS }),
  getUsersInfosSuccess: (data) => ({
    type: Types.GET_USERS_INFOS_SUCCESS,
    payload: data,
  }),
  getUsersInfosFail: () => ({ type: Types.GET_USERS_INFOS_FAIL }),

  // Accesses History
  getAccessesHistory: () => ({ type: Types.GET_ACCESSES_HISTORY }),
  getAccessesHistorySuccess: (data) => ({
    type: Types.GET_ACCESSES_HISTORY_SUCCESS,
    payload: data,
  }),
  getAccessesHistoryFail: () => ({ type: Types.GET_ACCESSES_HISTORY_FAIL }),
};
