import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
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

  const storage = getStorage();
  const imagePath = ref(storage, `attachments/${attachmentId}`);

  const snapshot = await uploadBytes(imagePath, blob);
  return getDownloadURL(snapshot.ref);
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
