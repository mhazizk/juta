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

  const { uriList, defaultUri } = route?.params;

  return (
    <>
      <Carousel
        loop
        defaultIndex={uriList.indexOf(defaultUri)}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height}
        data={uriList}
        key={(index) => index}
        style={{
          flex: 1,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
        renderItem={({ index }) => (
          <>
            <ImageZoom uri={uriList[index]} />
          </>
        )}
      />
    </>
  );
};

export default ImageViewerScreen;
