import { UserStatuses } from "../actions";

const user = (state = null, action) => {
  switch (action.type) {
    case UserStatuses.SIGNED_IN:
      if (
        !action.user.attributes["custom:accountId"] ||
        action.user.attributes["custom:accountId"] === undefined
      ) {
        action.user.attributes["custom:accountId"] = 1;
      }
      return { ...state, ...action.user };
    case UserStatuses.SIGN_IN:
      return null;
    case UserStatuses.SIGN_IN_USERAPI:
      return { ...state, id: action.userApi.id || null };
    default:
      return state;
  }
};

export default user;
