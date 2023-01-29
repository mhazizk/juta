import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth/react-native";
import auth from "./auth";

const createNewUser = async (email, password) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export default createNewUser;
