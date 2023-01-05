import { auth } from "../api/firebaseConfig";

const handleUserSignUp = ({ email, password }) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return console.log(user);
    })
    .catch((error) => {
      return alert(error.message);
    });
};

export default handleUserSignUp;
