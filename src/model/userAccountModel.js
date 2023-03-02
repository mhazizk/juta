/**
 * Creates a userAccount object
 *
 * @param displayName
 * @param uid
 * @param email
 * @param emailVerified
 * @param photoURL
 *
 * @returns
 */
const userAccountModel = ({
  displayName,
  uid,
  email,
  emailVerified,
  photoURL,
  premium,
}) => {
  const userAccountObject = {
    _timestamps: {
      created_at: Date.now(),
      updated_at: Date.now(),
      created_by: uid,
      updated_by: uid,
    },
    displayName: displayName,
    subscription: {
      joinDate: Date.now(),
      plan: "free",
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
