import { call, put, takeLatest } from "redux-saga/effects";
import api from "~/services/api";
import { Types as VirtualDoorTypes } from "./actions";
import Toast from "~/components/elements/Toast";
import MESSAGE from "~/utils/messages";

export function* sendOpenDoor({ payload }) {
  const { doorValue, tagValue } = payload;
  try {
    const { data } = yield call(
      api.get,
      `/v1.0/rfid/solicitaentrada?door_identification=${doorValue}&key_code=${tagValue}&type_access=entrada`
    );
    const { acesso } = data;
    if (acesso !== "NOK") {
      yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_SUCCESS });
      yield Toast("success", MESSAGE.successOpenDoor);
    } else {
      yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_FAIL });
      yield Toast("error", MESSAGE.errorOpenDoor);
    }
  } catch (err) {
    yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export function* sendRegisterTag({ payload }) {
  const { doorValue, tagValue } = payload;
  try {
    const { data } = yield call(
      api.get,
      `/v1.0/rfid/solicitaentrada?door_identification=${doorValue}&key_code=${tagValue}&tipo=insert`
    );
    const { acesso } = data;
    if (acesso === "NOK") {
      yield put({ type: VirtualDoorTypes.SEND_REGISTER_TAG_SUCCESS });
      yield Toast("success", MESSAGE.successTagRegister);
    }
  } catch (err) {
    yield put({ type: VirtualDoorTypes.SEND_REGISTER_TAG_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}

export function* checkOpenDoor({ payload }) {
  const { doorValue } = payload;
  try {
    const { data } = yield call(
      api.get,
      `/v1.0/checar_solicitacoes/?door_identification=${doorValue}`
    );
    const { acesso } = data;
    if (acesso !== "NOK") {
      yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_SUCCESS });
      yield Toast("success", MESSAGE.successOpenDoor);
    } else {
      yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_FAIL });
    }
  } catch (err) {
    yield put({ type: VirtualDoorTypes.SEND_OPEN_DOOR_FAIL });
    yield Toast("error", MESSAGE.errorSendData);
  }
}
export default function* saga() {
  yield takeLatest(VirtualDoorTypes.SEND_OPEN_DOOR, sendOpenDoor);
  yield takeLatest(VirtualDoorTypes.SEND_REGISTER_TAG, sendRegisterTag);
  yield takeLatest(VirtualDoorTypes.CHECK_OPEN_DOOR, checkOpenDoor);
}

// /v1.0/rfid/solicitaentrada?door_identification=13cf6ea93089f291b6093a30aae62d46&key_code=016a0edf6cc&type_access=entrada
// /v1.0/rfid/solicitaentrada?door_identification=13cf6ea93089f291b6093a30aae62d46&key_code=016a0edf6cc&tipo=insert
