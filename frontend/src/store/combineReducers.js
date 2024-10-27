import { combineReducers } from "redux";
import authentication from "./modules/authentication/reducer";
import accesses from "./modules/accesses/reducer";
import dashboard from "./modules/dashboard/reducer";
import doors from "./modules/doors/reducer";
import keys from "./modules/keys/reducer";
import users from "./modules/users/reducer";
import virtualDoor from "./modules/virtualDoor/reducer";

export default combineReducers({
  authentication,
  accesses,
  dashboard,
  doors,
  keys,
  users,
  virtualDoor,
});
