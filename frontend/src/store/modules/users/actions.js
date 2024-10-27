export const Types = {
  // List
  GET_USERS: "users/GET_USERS",
  GET_USERS_SUCCESS: "users/GET_USERS_SUCCESS",
  GET_USERS_FAIL: "users/GET_USERS_FAIL",

  // Create User
  CREATE_USER: "users/CREATE_USER",
  CREATE_USER_SUCCESS: "users/CREATE_USER_SUCCESS",
  CREATE_USER_FAIL: "users/CREATE_USER_FAIL",

  // Update User
  UPDATE_USER: "users/UPDATE_USER",
  UPDATE_USER_SUCCESS: "users/UPDATE_USER_SUCCESS",
  UPDATE_USER_FAIL: "users/UPDATE_USER_FAIL",

  // Delete User
  DELETE_USER: "users/DELETE_USER",
  DELETE_USER_SUCCESS: "users/DELETE_USER_SUCCESS",
  DELETE_USER_FAIL: "users/DELETE_USER_FAIL",
};

export const Creators = {
  // List
  getUsers: () => ({ type: Types.GET_USERS }),
  getUsersSuccess: (data) => ({ type: Types.GET_USERS_SUCCESS, payload: data }),
  getUsersFail: () => ({ type: Types.GET_USERS_FAIL }),

  // Create User
  createUser: (data) => ({ type: Types.CREATE_USER, payload: data }),
  createUserSuccess: (data) => ({
    type: Types.CREATE_USER_SUCCESS,
    payload: data,
  }),
  createUserFail: () => ({ type: Types.CREATE_USER_FAIL }),

  // Update User
  updateUser: (data) => ({ type: Types.UPDATE_USER, payload: data }),
  updateUserSuccess: (data) => ({
    type: Types.UPDATE_USER_SUCCESS,
    payload: data,
  }),
  updateUserFail: () => ({ type: Types.UPDATE_USER_FAIL }),

  // Delete User
  deleteUser: (data) => ({ type: Types.DELETE_USER, payload: data }),
  deleteUserSuccess: () => ({ type: Types.DELETE_USER_SUCCESS }),
  deleteUserFail: () => ({ type: Types.DELETE_USER_FAIL }),
};
