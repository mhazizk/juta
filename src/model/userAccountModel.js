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
      joinDate: Date.now(),
      activeSubscriptions: [],
      // active: false,
      // plan: "free",
      // expirationDate: null,
    },
    uid: uid,
    email: email,
    emailVerified: emailVerified,
    photoURL: photoURL,
    devicesLoggedIn: [],
    featureWishlist: [],
    groups: [],
  };
  return userAccountObject;
};

export default userAccountModel;
