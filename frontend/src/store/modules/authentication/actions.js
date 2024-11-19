export const Types = {
  // login
  GET_AUTHENTICATION: "authentication/GET_AUTHENTICATION",
  SUCCESS_AUTHENTICATION: "authentication/SUCCESS_AUTHENTICATION",
  FAILURE_AUTHENTICATION: "authentication/FAILURE_AUTHENTICATION",

  // logout
  PURGE_AUTHENTICATION: "authentication/PURGE_AUTHENTICATION",

  // sign-up
  SEND_SIGN_UP: "authentication/SEND_SIGN_UP",
  SUCCESS_SIGN_UP: "authentication/SUCCESS_SIGN_UP",
  FAILURE_SIGN_UP: "authentication/FAILURE_SIGN_UP",
};

export const Creators = {
  // login
  getAuthentication: (data) => ({
    type: Types.GET_AUTHENTICATION,
    payload: data,
  }),
  successAuthentication: (data) => ({
    type: Types.SUCCESS_AUTHENTICATION,
    payload: data,
  }),
  failureAuthentication: () => ({ type: Types.FAILURE_AUTHENTICATION }),
  purgeAuthentication: () => ({ type: Types.PURGE_AUTHENTICATION }),
  signUp: (data) => ({
    type: Types.SEND_SIGN_UP,
    payload: data,
  }),
  successSignUp: () => ({ type: Types.SUCCESS_SIGN_UP }),
  failureSignUp: () => ({ type: Types.FAILURE_SIGN_UP }),
};
