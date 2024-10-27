import { call, put, takeLatest } from "redux-saga/effects";
import api from "~/services/api";
import { Types as DashboardTypes } from "./actions";
import { formatDateTimeToBr, formatCPF } from "~/utils/tools";
import Toast from "~/components/elements/Toast";
import MESSAGE from "~/utils/messages";

export function* getDashboardInfos() {
  try {
    const { data } = yield call(api.get, "/dashinfos");
    yield put({
      type: DashboardTypes.GET_DASHBOARD_INFOS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    yield put({ type: DashboardTypes.GET_DASHBOARD_INFOS_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* getAccessesInfos() {
  try {
    const { data } = yield call(api.get, "/accesshistory");
    if (data && data.length > 0) {
      const accessesInfos = [];
      yield data.map((a) => {
        return accessesInfos.push({
          cell1: `${a.user.name} ${a.user.surname}`,
          cell2: formatDateTimeToBr(a.created_at),
          cell3: a.door.description,
        });
      });
      console.log(accessesInfos, data);
      yield put({
        type: DashboardTypes.GET_ACCESSES_INFOS_SUCCESS,
        payload: accessesInfos,
      });
    } else {
      yield put({ type: DashboardTypes.GET_ACCESSES_INFOS_FAIL });
    }
  } catch (err) {
    yield put({ type: DashboardTypes.GET_ACCESSES_INFOS_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* getUsersInfos() {
  try {
    const { data } = yield call(api.get, "/lastusers");
    if (data && data.length > 0) {
      const usersInfos = [];
      yield data.map((u) => {
        return usersInfos.push({
          cell1: `${u.name} ${u.surname}`,
          cell2: formatCPF(u.cpf),
          cell3: formatDateTimeToBr(u.created_at),
        });
      });
      yield put({
        type: DashboardTypes.GET_USERS_INFOS_SUCCESS,
        payload: usersInfos,
      });
    }
  } catch (err) {
    yield put({ type: DashboardTypes.GET_USERS_INFOS_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* getAccessesHistory() {
  try {
    const { data } = yield call(api.get, "/accesscount");
    yield put({
      type: DashboardTypes.GET_ACCESSES_HISTORY_SUCCESS,
      payload: data,
    });
  } catch (err) {
    yield put({ type: DashboardTypes.GET_ACCESSES_HISTORY_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export default function* saga() {
  yield takeLatest(DashboardTypes.GET_DASHBOARD_INFOS, getDashboardInfos);
  yield takeLatest(DashboardTypes.GET_ACCESSES_INFOS, getAccessesInfos);
  yield takeLatest(DashboardTypes.GET_USERS_INFOS, getUsersInfos);
  yield takeLatest(DashboardTypes.GET_ACCESSES_HISTORY, getAccessesHistory);
}
