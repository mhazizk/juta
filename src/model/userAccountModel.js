const userAccountModel = ({
  displayName,
  uid,
  email,
  emailVerified,
  photoURL,
  premium,
}) => {
  const userAccountObject = {
    displayName: displayName,
    subscription: {
      active: false,
      plan: "free",
      date: Date.now(),
      expiry: null,
    },
    uid: uid,
    email: email,
    emailVerified: emailVerified,
    photoURL: photoURL,
    devicesLoggedIn: [],
    groups: [],
  };
  return userAccountObject;
};

export default userAccountModel;
