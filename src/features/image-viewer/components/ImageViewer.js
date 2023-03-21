import { useState } from "react";
import { TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Loading from "../../../components/Loading";

const ImageViewer = ({ disableCache = false, uri, onPress }) => {
  const [isloading, setIsLoading] = useState(true);
  return (
    <>
      <View
        style={{
          width: 200,
          height: 200,
          margin: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onPress(uri);
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
              cachePolicy={disableCache ? "none" : "memory-disk"}
              source={{ uri }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onLoadEnd={() => {
                setIsLoading(false);
              }}
              contentFit="cover"
              style={{
                alignSelf: "center",
                borderRadius: 8,
                width: 200,
                height: 200,
              }}
            />
          </View>
        </TouchableOpacity>
        {isloading && (
          <>
            <View
              style={{
                position: "absolute",
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loading size={24} />
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default ImageViewer;
