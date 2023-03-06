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
  const imageExtension = imageUri.match(/[^.]+$/)[0];
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const storage = getStorage(app);

  const imagePath = ref(
    storage,
    `attachments/${attachmentId}.${imageExtension}`
  );

  console.log(
    JSON.stringify(
      {
        blobSize: blob.size,
        imagePath,
      },
      null,
      2
    )
  );
  // const snapshot = await uploadBytes(imagePath, blob);
  const snapshot = await uploadBytes(imagePath, blob).catch((error) => {
    console.log(JSON.stringify(error, null, 2));
  });
  if (snapshot) {
    // alert("line 50");
    console.log(JSON.stringify({ snapshot }, null, 2));
  }
  const url = await getDownloadURL(snapshot.ref);

  if (url) {
    // alert("line 54");
  }
  return url;
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
