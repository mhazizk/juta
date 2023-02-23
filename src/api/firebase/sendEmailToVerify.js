import { sendEmailVerification } from "firebase/auth";
import auth from "./auth";

const sendEmailToVerify = async () => {
  await sendEmailVerification(auth.currentUser)
    .then(() => {
      // Verification email sent.
    })
    .catch((error) => {
      // Error occurred. Inspect error.code.
      alert(error);
    });
};
export default sendEmailToVerify;
