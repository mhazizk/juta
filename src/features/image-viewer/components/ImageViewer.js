import { useState } from "react";
import { Image, TouchableNativeFeedback, View } from "react-native";
import Loading from "../../../components/Loading";

const ImageViewer = ({ uri, onPress }) => {
  const [isloading, setIsLoading] = useState(true);
  return (
    <>
      <TouchableNativeFeedback
        onPress={() => {
          onPress(uri);
        }}
        style={{
          width: 200,
          height: 200,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            //   padding: 8,
          }}
        >
          <Image
            source={{ uri }}
            onLoadStart={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            style={{
              margin: 8,
              alignSelf: "center",
              borderRadius: 8,
              width: 200,
              height: 200,
            }}
          />
        </View>
      </TouchableNativeFeedback>
      {isloading && (
        <>
          <View
            style={{
              // backgroundColor: "black",
              position: "absolute",
              top: 100,
              left: 100,
            }}
          >
            <Loading size={24} />
          </View>
        </>
      )}
    </>
  );
};

export default ImageViewer;
