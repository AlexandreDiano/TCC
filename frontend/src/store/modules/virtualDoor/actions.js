export const Types = {
  // Open Door
  SEND_OPEN_DOOR: "virtualDoor/SEND_OPEN_DOOR",
  SEND_OPEN_DOOR_SUCCESS: "virtualDoor/SEND_OPEN_DOOR_SUCCESS",
  SEND_OPEN_DOOR_FAIL: "virtualDoor/SEND_OPEN_DOOR_FAIL",
  CLOSE_DOOR: "virtualDoor/CLOSE_DOOR",

  // Check Open Door
  CHECK_OPEN_DOOR: "virtualDoor/CHECK_OPEN_DOOR",

  // Register Tag
  SEND_REGISTER_TAG: "virtualDoor/SEND_REGISTER_TAG",
  SEND_REGISTER_TAG_SUCCESS: "virtualDoor/SEND_REGISTER_TAG_SUCCESS",
  SEND_REGISTER_TAG_FAIL: "virtualDoor/SEND_REGISTER_TAG_FAIL",
};

export const Creators = {
  // Open Door
  sendOpenDoor: (data) => ({ type: Types.SEND_OPEN_DOOR, payload: data }),
  checkOpenDoor: (data) => ({ type: Types.CHECK_OPEN_DOOR, payload: data }),
  sendOpenDoorSuccess: () => ({ type: Types.SEND_OPEN_DOOR_SUCCESS }),
  sendOpenDoorFail: () => ({ type: Types.SEND_OPEN_DOOR_FAIL }),
  closeDoor: () => ({ type: Types.CLOSE_DOOR }),

  // Register Tag
  sendRegisterTag: (data) => ({ type: Types.SEND_REGISTER_TAG, payload: data }),
  sendRegisterTagSuccess: () => ({ type: Types.SEND_REGISTER_TAG_SUCCESS }),
  sendRegisterTagFail: () => ({ type: Types.SEND_REGISTER_TAG_FAIL }),
};
