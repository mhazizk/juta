import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { View, Text, Animated, Dimensions } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useState, useRef, createRef } from "react";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import Carousel from "react-native-reanimated-carousel";
import { TextPrimary } from "../../../components/Text";
import { Image } from "expo-image";

const ImageViewerScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  const { uriList, defaultUri } = route?.params;

  return (
    <>
      <Carousel
        loop={false}
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
            {/* <ImageZoom uri={uriList[index]} /> */}
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: uriList[index] }}
                cachePolicy="memory-disk"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="contain"
                contentPosition="center"
              />
              <TextPrimary
                label={index + 1 + "/" + uriList.length}
                style={{
                  position: "absolute",
                  bottom: 86,
                  alignSelf: "center",
                  justifyContent: "center",
                  zIndex: 100,
                }}
              />
            </View>
          </>
        )}
      />
    </>
  );
};

export default ImageViewerScreen;
