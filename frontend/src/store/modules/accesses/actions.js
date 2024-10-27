export const Types = {
  // List
  GET_ACCESSES: "accesses/GET_ACCESSES",
  GET_ACCESSES_SUCCESS: "accesses/GET_ACCESSES_SUCCESS",
  GET_ACCESSES_FAIL: "accesses/GET_ACCESSES_FAIL",

  // Filtered List
  GET_FILTERED_ACCESSES: "accesses/GET_FILTERED_ACCESSES",
  GET_FILTERED_ACCESSES_SUCCESS: "accesses/GET_FILTERED_ACCESSES_SUCCESS",
  GET_FILTERED_ACCESSES_FAIL: "accesses/GET_FILTERED_ACCESSES_FAIL",
};
export const Creators = {
  // List
  getAccesses: () => ({ type: Types.GET_ACCESSES }),
  getAccessesSuccess: (data) => ({
    type: Types.GET_ACCESSES_SUCCESS,
    payload: data,
  }),
  getAccessesFail: () => ({ type: Types.GET_ACCESSES_FAIL }),

  // Filtered List
  getFilteredAccesses: (data) => ({
    type: Types.GET_FILTERED_ACCESSES,
    payload: data,
  }),
  getFilteredAccessesSuccess: (data) => ({
    type: Types.GET_FILTERED_ACCESSES_SUCCESS,
    payload: data,
  }),
  getFilteredAccessesFail: () => ({ type: Types.GET_FILTERED_ACCESSES_FAIL }),
};
