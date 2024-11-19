import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import api from "~/services/api";
import { Types as KeysTypes } from "./actions";
import Toast from "~/components/elements/Toast";
import MESSAGE from "~/utils/messages";

export function* getKeys() {
  try {
    const { data } = yield call(api.get, "/keys");
    yield put({
      type: KeysTypes.GET_KEYS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    yield put({ type: KeysTypes.GET_KEYS_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* bindKey({ payload }) {
  const data = {
    key: {
      description: payload.description,
      user_id: payload.user_id,
    },
  };
  try {
    yield call(api.put, `/keys/${payload.key_id}`, data);
    yield put({ type: KeysTypes.BIND_KEY_SUCCESS });
    yield put({ type: KeysTypes.GET_KEYS });
  } catch (err) {
    yield put({ type: KeysTypes.BIND_KEY_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* getAccessKey({ payload }) {
  try {
    const { data } = yield call(api.get, `/keys/${payload}`);
    yield put({
      type: KeysTypes.GET_ACCESS_KEY_SUCCESS,
      payload: data,
    });
    if (data.permissions[0].id)
      yield put({
        type: KeysTypes.SET_ID_PERMISSION,
        payload: data.permissions[0].id,
      });
  } catch (err) {
    yield put({ type: KeysTypes.GET_ACCESS_KEY_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* saveSchedule({ payload }) {
  try {
    yield call(api.post, "/schedules", payload);
    yield put({ type: KeysTypes.SAVE_SCHEDULE_SUCCESS });
    Toast("success", MESSAGE.saveScheduleSuccess);
  } catch (e) {
    yield put({ type: KeysTypes.SAVE_SCHEDULE_FAIL });
    Toast("error", MESSAGE.saveScheduleFail);
  }
}
export function* deleteSchedule({ payload }) {
  try {
    yield call(api.delete, `/schedules/${payload}`);
    yield put({ type: KeysTypes.DELETE_SCHEDULE_SUCCESS });
    Toast("success", MESSAGE.deleteScheduleSuccess);
  } catch (e) {
    yield put({ type: KeysTypes.DELETE_SCHEDULE_FAIL });
    Toast("error", MESSAGE.deleteScheduleFail);
  }
}

export default function* saga() {
  yield takeLatest(KeysTypes.GET_KEYS, getKeys);
  yield takeLatest(KeysTypes.BIND_KEY, bindKey);
  yield takeLatest(KeysTypes.GET_ACCESS_KEY, getAccessKey);
  yield takeEvery(KeysTypes.SAVE_SCHEDULE, saveSchedule);
  yield takeEvery(KeysTypes.DELETE_SCHEDULE, deleteSchedule);
}
