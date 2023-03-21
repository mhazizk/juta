import axios from "axios";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import env from "../../config/env";
import app from "./app";

const uploadAttachmentImage = async (imageUri, imageId) => {
  const formData = new FormData();
  const fileNameWithExtension = imageUri.match(/[^/]+$/)[0];
  const imageExtension =
    imageUri.match(/[^.]+$/)[0] === "jpg"
      ? "jpeg"
      : imageUri.match(/[^.]+$/)[0];
  const imageType = `image/${imageExtension}`;

  formData.append("imageId", imageId);
  formData.append("image", {
    uri: imageUri,
    name: fileNameWithExtension,
    type: imageType,
  });

  const project = env.FIREBASE_CONFIG.PROJECT_ID;
  const location = "us-central1";

  const url = `https://${location}-${project}.cloudfunctions.net/uploadAttachmentImage`;

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const { data } = await axios.post(url, formData, config);
    const { imagePath } = data;

    const storage = getStorage();
    const pathRef = ref(storage, imagePath);
    const publicURL = await getDownloadURL(pathRef).catch((error) => {
      console.log(JSON.stringify(error, null, 2));
    });
    return publicURL;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
};

export default uploadAttachmentImage;
