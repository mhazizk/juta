import { useState } from "react";
import {
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../../../components/Loading";

const ImageViewer = ({ uri, onPress }) => {
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
              source={{ uri }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onLoadEnd={() => {
                setIsLoading(false);
              }}
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
