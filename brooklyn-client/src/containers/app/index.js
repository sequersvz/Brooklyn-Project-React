import { connect } from "react-redux";

import App from "../../components/app";
import { userSignedIn, userSignedOut } from "../../actions";
import { getAccount } from "../../actions/account";
import { getUserByCognitoId } from "../../actions/users";
const mapStateToProps = state => {
  return {
    user: state.user,
    account: state.account
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLoggedIn: user => {
      dispatch(userSignedIn(user));
      dispatch(getAccount(user.attributes["custom:accountId"]));
      dispatch(getUserByCognitoId(user));
    },
    userSignedOut: () => {
      dispatch(userSignedOut());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
