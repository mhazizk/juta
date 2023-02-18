import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const shareData = async (fileUri, dialogTitle) => {
  const sharing = await Sharing.isAvailableAsync();
  // const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  // const fileCacheUri = `${FileSystem.cacheDirectory}${fileName}`;

  // Check if sharing is available
  if (!sharing) {
    alert(`Uh oh, sharing isn't available on your platform`);
    return;
  }

  // Share the file
  return await Sharing.shareAsync(fileUri);
};

export default shareData;
