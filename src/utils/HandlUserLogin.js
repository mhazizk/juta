import { auth } from "../api/firebaseConfig";

const handleUserLogin = ({ email, password }) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return console.log(user);
    })
    .catch((error) => {
      return alert(error.message);
    });
};

export default handleUserLogin;
