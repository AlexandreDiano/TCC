import { call, put, takeLatest } from "redux-saga/effects";
import apiNoAuth from "~/services/api";
import { Types as AuthenticationTypes } from "./actions";
import Toast from "~/components/elements/Toast";
import history from "~/routes/history";
import MESSAGE from "~/utils/messages";

export function* getAuthentication({ payload }) {
  const { values } = payload;
  const user = { user: values };
  try {
    const { data, headers } = yield call(apiNoAuth.post, `/login`, user);
    const payload = {
      ...data,
      auth: headers.authorization,
    };
    yield put({
      type: AuthenticationTypes.SUCCESS_AUTHENTICATION,
      payload,
    });
    history.push("/dashboard");
  } catch (err) {
    yield put({ type: AuthenticationTypes.FAILURE_AUTHENTICATION });
    yield Toast("error", MESSAGE.errorLogin);
  }
}

export function* signUp({ payload }) {
  try {
    const { data } = yield call(apiNoAuth.post, `/signup`, payload);
    yield put({ type: AuthenticationTypes.SUCCESS_SIGN_UP });
    const login = {
      values: {
        username: data.username,
        password: payload.user.password,
      },
    };
    yield Toast("success", MESSAGE.successSignUp);
    yield put({ type: AuthenticationTypes.GET_AUTHENTICATION, payload: login });
  } catch (err) {
    yield put({ type: AuthenticationTypes.FAILURE_SIGN_UP });
    yield Toast("error", MESSAGE.errorSignUp);
  }
}

export default function* saga() {
  yield takeLatest(AuthenticationTypes.GET_AUTHENTICATION, getAuthentication);
  yield takeLatest(AuthenticationTypes.SEND_SIGN_UP, signUp);
}
