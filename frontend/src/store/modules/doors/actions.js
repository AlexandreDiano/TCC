export const Types = {
  // List
  GET_DOORS: "doors/GET_DOORS",
  GET_DOORS_SUCCESS: "doors/GET_DOORS_SUCCESS",
  GET_DOORS_FAIL: "doors/GET_DOORS_FAIL",

  // Create Door
  CREATE_DOOR: "doors/CREATE_DOOR",
  CREATE_DOOR_SUCCESS: "doors/CREATE_DOOR_SUCCESS",
  CREATE_DOOR_FAIL: "doors/CREATE_DOOR_FAIL",

  // Update Door
  UPDATE_DOOR: "doors/UPDATE_DOOR",
  UPDATE_DOOR_SUCCESS: "doors/UPDATE_DOOR_SUCCESS",
  UPDATE_DOOR_FAIL: "doors/UPDATE_DOOR_FAIL",

  // Delete Door
  DELETE_DOOR: "doors/DELETE_DOOR",
  DELETE_DOOR_SUCCESS: "doors/DELETE_DOOR_SUCCESS",
  DELETE_DOOR_FAIL: "doors/DELETE_DOOR_FAIL",

  // Bind Door
  BIND_DOOR: "doors/BIND_DOOR",
  BIND_DOOR_SUCCESS: "doors/BIND_DOOR_SUCCESS",
  BIND_DOOR_FAIL: "doors/BIND_DOOR_FAIL",

  // Open Door
  OPEN_DOOR: "doors/OPEN_DOOR",
  OPEN_DOOR_SUCCESS: "doors/OPEN_DOOR_SUCCESS",
  OPEN_DOOR_FAIL: "doors/OPEN_DOOR_FAIL",
};

export const Creators = {
  // List
  getDoors: () => ({ type: Types.GET_DOORS }),
  getDoorsSuccess: (data) => ({ type: Types.GET_DOORS_SUCCESS, payload: data }),
  getDoorsFail: () => ({ type: Types.GET_DOORS_FAIL }),

  // Create Door
  createDoor: (data) => ({ type: Types.CREATE_DOOR, payload: data }),
  createDoorSuccess: (data) => ({
    type: Types.CREATE_DOOR_SUCCESS,
    payload: data,
  }),
  createDoorFail: () => ({ type: Types.CREATE_DOOR_FAIL }),

  // Update Door
  updateDoor: (data) => ({ type: Types.UPDATE_DOOR, payload: data }),
  updateDoorSuccess: (data) => ({
    type: Types.UPDATE_DOOR_SUCCESS,
    payload: data,
  }),
  updateDoorFail: () => ({ type: Types.UPDATE_DOOR_FAIL }),

  // Delete Door
  deleteDoor: (data) => ({ type: Types.DELETE_DOOR, payload: data }),
  deleteDoorSuccess: () => ({ type: Types.DELETE_DOOR_SUCCESS }),
  deleteDoorFail: () => ({ type: Types.DELETE_DOOR_FAIL }),

  // Delete Door
  bindDoor: (data) => ({ type: Types.BIND_DOOR, payload: data }),
  bindDoorSuccess: () => ({ type: Types.BIND_DOOR_SUCCESS }),
  bindDoorFail: () => ({ type: Types.BIND_DOOR_FAIL }),

  // Open Door
  openDoor: (data) => ({ type: Types.OPEN_DOOR, payload: data }),
  openDoorSuccess: () => ({ type: Types.OPEN_DOOR_SUCCESS }),
  openDoorFail: () => ({ type: Types.OPEN_DOOR_FAIL }),
};
