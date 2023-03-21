import axios from "axios";
import * as FileSystem from "expo-file-system";

/**
 * Downloads an image from a url and returns the local file uri
 *
 * @param url - url of the image to be downloaded
 * @returns local file uri
 */
const imageDownloader = async (url) => {
  console.log({ url });
  const localFileUri = `${FileSystem.documentDirectory}${fileNameWithExtension}`;
  //   const fileNameWithExtension = url.match(/[^/]+$/)[0];
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    localFileUri,
    {}
  );

  return downloadResumable
    .downloadAsync()
    .then(({ uri }) => {
      console.log("finished downloading to ", uri);
      return uri;
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    });
};

export default imageDownloader;
