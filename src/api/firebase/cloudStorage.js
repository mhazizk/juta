// import {
//   deleteObject,
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytes,
//   uploadBytesResumable,
// } from "firebase/storage";
// import app from "./app";
import storage from "@react-native-firebase/storage";
// const storage = getStorage();

export const uploadProfilePicture = async (imageUri, uid) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return storage().ref(`profile-pictures/${uid}`).put(blob);
  // const imagePath = ref(storage, `profile-pictures/${uid}`);

  // return await uploadBytes(imagePath, blob);
};

export const uploadAttachmentImage = async (imageUri, attachmentId) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return storage().ref(`attachments/${attachmentId}`).put(blob);

  // const storage = getStorage();
  // const imagePath = ref(storage, `attachments/${attachmentId}`);

  // return await uploadBytes(imagePath, blob);
};

export const uploadAndGetAttachmentImageURL = async (
  imageUri,
  attachmentId
) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  if (blob) {
    // alert("blob :" + blob.size);
  }

  return storage()
    .ref(`attachments/${attachmentId}`)
    .put(blob)
    .on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            alert("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            alert("User canceled the upload");
            break;
          case "storage/unknown":
            alert("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        storage()
          .ref(`attachments/${attachmentId}`)
          .getDownloadURL()
          .then((url) => {
            return url;
          });
      }
    );
};

export const getProfilePictureURL = async (uid) => {
  return await storage().ref(`profile-pictures/${uid}`).getDownloadURL();
  // const pp = ref(storage, `profile-pictures/${uid}`);
  // return await getDownloadURL(pp);
};

export const getAttachmentImageURL = async (attachmentId) => {
  return await storage().ref(`attachments/${attachmentId}`).getDownloadURL();
  // const imageReference = ref(storage, `attachments/${attachmentId}`);
  // return await getDownloadURL(imageReference);
};

export const deleteAttachmentImage = async (url) => {
  return await storage().refFromURL(url).delete();
  // const imageReference = ref(storage, url);
  // return await deleteObject(imageReference);
};
