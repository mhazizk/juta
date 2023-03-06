import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { View, Text, Image, Animated, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useState, useRef, createRef } from "react";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import Carousel from "react-native-reanimated-carousel";
import { TextPrimary } from "../../../components/Text";

const ImageViewerScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <Carousel
        loop
        defaultIndex={route?.params?.uriList.indexOf(route?.params?.uri)}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height}
        data={route?.params?.uriList}
        key={(index) => index}
        style={{
          flex: 1,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
        renderItem={({ index }) => (
          <>
            <ImageZoom uri={route?.params?.uriList[index]} />
          </>
        )}
      />
    </>
  );
};

export default ImageViewerScreen;
