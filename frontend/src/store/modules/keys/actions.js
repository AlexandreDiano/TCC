export const Types = {
  // List
  GET_KEYS: "keys/GET_KEYS",
  GET_KEYS_SUCCESS: "keys/GET_KEYS_SUCCESS",
  GET_KEYS_FAIL: "keys/GET_KEYS_FAIL",

  // Bind key to user
  BIND_KEY: "keys/BIND_KEY",
  BIND_KEY_SUCCESS: "keys/BIND_KEY_SUCCESS",
  BIND_KEY_FAIL: "keys/BIND_KEY_FAIL",

  // Get key for access config
  GET_ACCESS_KEY: "keys/GET_ACCESS_KEY",
  GET_ACCESS_KEY_SUCCESS: "keys/GET_ACCESS_KEY_SUCCESS",
  GET_ACCESS_KEY_FAIL: "keys/GET_ACCESS_KEY_FAIL",

  // Set current permission ID
  SET_ID_PERMISSION: "keys/SET_ID_PERMISSION",

  // Save new schedule
  SAVE_SCHEDULE: "keys/SAVE_SCHEDULE",
  SAVE_SCHEDULE_SUCCESS: "keys/SAVE_SCHEDULE_SUCCESS",
  SAVE_SCHEDULE_FAIL: "keys/SAVE_SCHEDULE_FAIL",

  // Delete schedule
  DELETE_SCHEDULE: "keys/DELETE_SCHEDULE",
  DELETE_SCHEDULE_SUCCESS: "keys/DELETE_SCHEDULE_SUCCESS",
  DELETE_SCHEDULE_FAIL: "keys/DELETE_SCHEDULE_FAIL",

  // Schedule reset reducer status
  SCHEDULE_RESET: "keys/SCHEDULE_RESET",
};
export const Creators = {
  // List
  getKeys: () => ({ type: Types.GET_KEYS }),
  getKeysSuccess: (data) => ({ type: Types.GET_KEYS_SUCCESS, payload: data }),
  getKeysFail: () => ({ type: Types.GET_KEYS_FAIL }),

  // Bind key to user
  bindKey: (data) => ({ type: Types.BIND_KEY, payload: data }),
  bindKeySuccess: (data) => ({ type: Types.BIND_KEY_SUCCESS, payload: data }),
  bindKeyFail: () => ({ type: Types.BIND_KEY_FAIL }),

  // Get key for access config
  getAccessKey: (data) => ({ type: Types.GET_ACCESS_KEY, payload: data }),
  getAccessKeySuccess: (data) => ({
    type: Types.GET_ACCESS_KEY_SUCCESS,
    payload: data,
  }),
  getAccessKeyFail: () => ({ type: Types.GET_ACCESS_KEY_FAIL }),

  // Set current permission ID
  setIdPermission: (data) => ({ type: Types.SET_ID_PERMISSION, payload: data }),

  // Save new schedule
  saveSchedule: (data) => ({ type: Types.SAVE_SCHEDULE, payload: data }),
  saveScheduleSuccess: () => ({ type: Types.SAVE_SCHEDULE_SUCCESS }),
  saveScheduleFail: () => ({ type: Types.SAVE_SCHEDULE_FAIL }),

  // Delete schedule
  deleteSchedule: (data) => ({ type: Types.DELETE_SCHEDULE, payload: data }),
  deleteScheduleSuccess: () => ({ type: Types.DELETE_SCHEDULE_SUCCESS }),
  deleteScheduleFail: () => ({ type: Types.DELETE_SCHEDULE_FAIL }),

  // Schedule reset reducer status
  scheduleReset: () => ({ type: Types.SCHEDULE_RESET }),
};
