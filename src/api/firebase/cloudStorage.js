import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import app from "./app";
const storage = getStorage();

export const uploadProfilePicture = async (imageUri, uid) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const imagePath = ref(storage, `profile-pictures/${uid}`);

  return await uploadBytes(imagePath, blob);
};

export const uploadAttachmentImage = async (imageUri, attachmentId) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const storage = getStorage();
  const imagePath = ref(storage, `attachments/${attachmentId}`);

  return await uploadBytes(imagePath, blob);
};

export const uploadAndGetAttachmentImageURL = async (
  imageUri,
  attachmentId
) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  console.log("blob :" + blob.size);

  const storage = getStorage(app);

  const imagePath = ref(storage, `attachments/${attachmentId}`);

  console.log(imagePath);
  // const snapshot = await uploadBytes(imagePath, blob);
  const snapshot = await uploadBytes(imagePath, blob, {
    contentType: "image/jpeg",
  });
  if (snapshot) {
    alert("line 50");
  }
  const url = await getDownloadURL(snapshot.ref);

  // const uploadTask = uploadBytesResumable(imagePath, blob);

  // // Listen for state changes, errors, and completion of the upload.
  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log("Upload is " + progress + "% done");
  //     switch (snapshot.state) {
  //       case "paused":
  //         // console.log("Upload is paused");
  //         break;
  //       case "running":
  //         // alert("Upload is running");
  //         break;
  //     }
  //   },
  //   (error) => {
  //     // A full list of error codes is available at
  //     // https://firebase.google.com/docs/storage/web/handle-errors
  //     alert(error.serverResponse);
  //     switch (error.code) {
  //       case "storage/unauthorized":
  //         alert("User doesn't have permission to access the object");
  //         break;
  //       case "storage/canceled":
  //         alert("User canceled the upload");
  //         break;
  //       case "storage/unknown":
  //         alert("Unknown error occurred, inspect error.serverResponse");
  //         break;
  //     }
  //   },
  //   () => {
  //     // Upload completed successfully, now we can get the download URL
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //       alert("File available at", downloadURL);
  //       //perform your task
  //       return downloadURL;
  //     });
  //   }
  // );
  if (url) {
    alert("line 54");
  }
  return url;
  // return getDownloadURL(snapshot.ref);
};

export const getProfilePictureURL = async (uid) => {
  const pp = ref(storage, `profile-pictures/${uid}`);
  return await getDownloadURL(pp);
};

export const getAttachmentImageURL = async (attachmentId) => {
  const imageReference = ref(storage, `attachments/${attachmentId}`);
  return await getDownloadURL(imageReference);
};

export const deleteAttachmentImage = async (url) => {
  const imageReference = ref(storage, url);
  return await deleteObject(imageReference);
};
