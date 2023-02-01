// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
// } from "firebase/auth/react-native";
// import auth from "./auth";
import auth from "@react-native-firebase/auth";

const createNewUser = async (email, password) => {
  // const user = await createUserWithEmailAndPassword(auth, email, password);
  const user = await auth().createUserWithEmailAndPassword(email, password);
  return user;
};

export default createNewUser;
