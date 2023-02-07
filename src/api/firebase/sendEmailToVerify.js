import { sendEmailVerification } from "firebase/auth";
import auth from "./auth";

const sendEmailToVerify = async () => {
  // const actionCodeSettings = {
  //   url: "https://cashlog-app.firebaseapp.com/",
  //   // iOS: {
  //   //   bundleId: "com.example.ios",
  //   // },
  //   // android: {
  //   //   packageName: "app.juta",
  //   //   installApp: true,
  //   //   minimumVersion: "12",
  //   // },
  //   handleCodeInApp: true,
  // };
  await sendEmailVerification(auth.currentUser)
    .then(() => {
      // Verification email sent.
      alert("Verification email sent");
    })
    .catch((error) => {
      // Error occurred. Inspect error.code.
      alert(error);
    });

  // // Obtain code from the user.
  // await applyActionCode(auth, code);

  //   await applyActionCode(auth, code);
};
export default sendEmailToVerify;
