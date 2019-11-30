export const UserStatuses = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  CONFIRM_SIGN_IN: "confirmSignIn",
  CONFIRM_SIGN_UP: "confirmSignUp",
  FORGOT_PASSWORD: "forgotPassword",
  VERIFY_CONTACT: "verifyContact",
  SIGNED_IN: "signedIn",
  SIGN_IN_USERAPI: "SIGN_IN_USERAPI"
};

export const userSignedIn = user => ({
  type: UserStatuses.SIGNED_IN,
  user
});

export const userSignedOut = () => ({
  type: UserStatuses.SIGN_IN
});
