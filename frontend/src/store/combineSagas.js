import { all, fork } from "redux-saga/effects";
import authentication from "./modules/authentication/saga";
import accesses from "./modules/accesses/saga";
import dashboard from "./modules/dashboard/saga";
import doors from "./modules/doors/saga";
import keys from "./modules/keys/saga";
import users from "./modules/users/saga";
import virtualDoor from "./modules/virtualDoor/saga";

export default function* root() {
  yield all([fork(authentication)]);
  yield all([fork(accesses)]);
  yield all([fork(dashboard)]);
  yield all([fork(doors)]);
  yield all([fork(keys)]);
  yield all([fork(users)]);
  yield all([fork(virtualDoor)]);
}
