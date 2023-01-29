import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const exportData = async (data, fileName) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  //   const downloadedFile = await FileSystem.downloadAsync(data, fileUri);

  // TODO :temporary solution
  return await FileSystem.writeAsStringAsync(fileUri, data);

  const exportedFile = await FileSystem.writeAsStringAsync(
    fileUri,
    data
    // JSON.stringify(data)
    //     {
    // encoding: FileSystem.EncodingType.Base64,
    //     }
  );
  // Move the file to a shared location so that other apps can access it
  // const perm = await MediaLibrary.requestPermissionsAsync();
  // //   if (perm.status != "granted") {
  // if (!perm.granted) {
  //   return Promise.reject(
  //     "Cannot export data due to denied storage permission access"
  //   );
  // }
  // console.log(fileUri);
  // try {
  //   const asset = await MediaLibrary.createAssetAsync(fileUri);
  //   const album = await MediaLibrary.getAlbumAsync("Download");
  //   if (album == null) {
  //     return await MediaLibrary.createAlbumAsync("Download", asset, false);
  //   } else {
  //     return await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  //   }
  // } catch (e) {
  //   // handleError(e);
  //   console.log(e);
  // }

  //   //   if (downloadedFile.status != 200) {
  //   //     handleError();
  //   //   }
};

export default exportData;
