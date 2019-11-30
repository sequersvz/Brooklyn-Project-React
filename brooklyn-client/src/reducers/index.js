import { combineReducers } from "redux";
import user from "./user";
import account from "./account";
import users from "./users";
import vendors from "./vendors";
import contractStatus from "./contractStatus";
import queryFilters from "./queryFilters";
import checkpoints from "./checkpoints";

export default combineReducers({
  user,
  account,
  users,
  vendors,
  contractStatus,
  queryFilters,
  checkpoints
});
