import { UsersStatuses } from "../actions/users";

const users = (state = {}, action) => {
  switch (action.type) {
    case UsersStatuses.GET_USERS:
      return Object.assign({}, state.AllusersInCognito, action.users);
    case UsersStatuses.GET_USER_BY_COGNITOID:
      return Object.assign({}, state.userApi, action.userApi);
    default:
      return state;
  }
};

export default users;
