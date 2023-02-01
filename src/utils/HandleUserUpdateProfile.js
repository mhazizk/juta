import { updateProfile } from "firebase/auth/react-native";
import { Alert } from "react-native";
// import auth from "../api/firebase/auth";
import createNewUser from "../api/firebase/createNewUser";
import auth from '@react-native-firebase/auth';

const handleUserUpdateProfile = async ({
  displayName = null,
  photoURL = null,
}) => {
  try {
    return await auth().currentUser.updateProfile({ displayName, photoURL });
    // return await updateProfile(auth.currentUser, { displayName, photoURL });
  } catch (error) {
    switch (true) {
      case error.message.includes("email-already-in-use"):
        return Alert.alert("Account", "Email address is already registered");

      default:
        return Alert.alert("Account", error.message.replace("Firebase: ", ""));
    }
  }
};

export default handleUserUpdateProfile;
