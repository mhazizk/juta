import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

const createPDF = async (fileName) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>PDF Result Template</title>
    <style>
    body {
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
        color: #000;
        font-size: 12px;
    }
    </style>
    </head>
    <body>
    <h1>Cashlog Export PDF</h1>
    <p>Here's your PDF file.</p>
    </body>
    </html>
    `;

  const options = {
    html,
    fileName: fileName,
    base64: false,
  };

  const cacheFile = await Print.printToFileAsync(options);
  const moveFile = await FileSystem.moveAsync({
    from: cacheFile.uri,
    to: fileUri,
  });
  return Promise.all([moveFile])
    .then(() => {
      return Promise.resolve(fileUri);
    })
    .catch((e) => {
      return Promise.reject(e);
    });

  //   return await FileSystem.writeAsStringAsync(fileUri, data);
};
export default createPDF;
