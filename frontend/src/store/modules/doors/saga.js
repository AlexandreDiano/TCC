import { call, put, takeLatest } from "redux-saga/effects";
import api from "~/services/api";
import { Types as DoorsTypes } from "./actions";
import Toast from "~/components/elements/Toast";
import MESSAGE from "~/utils/messages";

export function* getDoors() {
  try {
    const { data } = yield call(api.get, "/doors");
    yield put({
      type: DoorsTypes.GET_DOORS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    yield put({ type: DoorsTypes.GET_DOORS_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* createDoor({ payload }) {
  const door = {
    door: payload,
  };
  try {
    yield call(api.post, "/doors", door);
    yield put({ type: DoorsTypes.CREATE_DOOR_SUCCESS });
    yield put({ type: DoorsTypes.GET_DOORS });
  } catch (err) {
    yield put({ type: DoorsTypes.CREATE_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* updateDoor({ payload }) {
  const door = { door: payload };
  try {
    yield call(api.put, `/doors/${payload.id}`, door);
    yield put({ type: DoorsTypes.UPDATE_DOOR_SUCCESS });
    yield put({ type: DoorsTypes.GET_DOORS });
  } catch (err) {
    yield put({ type: DoorsTypes.UPDATE_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* deleteDoor({ payload }) {
  try {
    yield call(api.delete, `/doors/${payload}`);
    yield put({ type: DoorsTypes.DELETE_DOOR_SUCCESS });
    yield put({ type: DoorsTypes.GET_DOORS });
  } catch (err) {
    yield put({ type: DoorsTypes.DELETE_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* bindDoor({ payload }) {
  try {
    yield call(api.post, `/doors/link`, payload);
    yield put({ type: DoorsTypes.BIND_DOOR_SUCCESS });
    yield put({ type: DoorsTypes.GET_DOORS });
  } catch (err) {
    yield put({ type: DoorsTypes.BIND_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* openDoor({ payload }) {
  try {
    const { data } = yield call(
      api.post,
      `/doors/${payload}/openremote`,
      payload
    );
    yield put({ type: DoorsTypes.OPEN_DOOR_SUCCESS });
    yield Toast("success", data.data.message);
  } catch (err) {
    yield put({ type: DoorsTypes.OPEN_DOOR_FAIL });
    yield Toast("error", err.response.data.data.message);
  }
}

export default function* saga() {
  yield takeLatest(DoorsTypes.GET_DOORS, getDoors);
  yield takeLatest(DoorsTypes.CREATE_DOOR, createDoor);
  yield takeLatest(DoorsTypes.UPDATE_DOOR, updateDoor);
  yield takeLatest(DoorsTypes.DELETE_DOOR, deleteDoor);
  yield takeLatest(DoorsTypes.BIND_DOOR, bindDoor);
  yield takeLatest(DoorsTypes.OPEN_DOOR, openDoor);
}
