import { call, put, takeLatest } from "redux-saga/effects";
import api from "~/services/api";
import { Types as UsersTypes } from "./actions";
import Toast from "~/components/elements/Toast";
import MESSAGE from "~/utils/messages";

export function* getUsers() {
  try {
    const { data } = yield call(api.get, "/users");
    yield put({
      type: UsersTypes.GET_USERS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    yield put({ type: UsersTypes.GET_USERS_FAIL });
    yield Toast("error", MESSAGE.errorLogin);
  }
}

export function* createUser({ payload }) {
  try {
    yield call(api.post, "/signup", payload);
    yield put({ type: UsersTypes.CREATE_USER_SUCCESS });
    yield put({ type: UsersTypes.GET_USERS });
  } catch (err) {
    yield put({ type: UsersTypes.CREATE_USER_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* updateUser({ payload }) {
  try {
    yield call(api.put, `/users/${payload.user.userId}`, payload);
    yield put({ type: UsersTypes.UPDATE_USER_SUCCESS });
    yield put({ type: UsersTypes.GET_USERS });
  } catch (err) {
    yield put({ type: UsersTypes.UPDATE_USER_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* deleteUser({ payload }) {
  try {
    yield call(api.put, `/users/${payload.user.userId}`, payload);
    yield put({ type: UsersTypes.DELETE_USER_SUCCESS });
    yield put({ type: UsersTypes.GET_USERS });
  } catch (err) {
    yield put({ type: UsersTypes.DELETE_USER_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export default function* saga() {
  yield takeLatest(UsersTypes.GET_USERS, getUsers);
  yield takeLatest(UsersTypes.CREATE_USER, createUser);
  yield takeLatest(UsersTypes.UPDATE_USER, updateUser);
  yield takeLatest(UsersTypes.DELETE_USER, deleteUser);
}
