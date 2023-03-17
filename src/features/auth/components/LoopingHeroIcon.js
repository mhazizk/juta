import { View, Text, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import ionIcons from "../../../assets/iconPacks/ionIcons";
import Animated from "react-native-reanimated";
import { hexToRgb } from "../../../utils";

const LoopingHeroIcon = ({ activeIconName = null }) => {
  const { globalTheme } = useGlobalTheme();

  useEffect(() => {
    // iconColorChange();
  }, []);

  const activeColor = "#CD0E61";
  const inactiveColor = hexToRgb({
    hex: globalTheme.colors.secondary,
    opacity: 0.5,
  });

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          top: "5%",
          left: 0,
          right: 0,
          width: "100%",
          zIndex: -1,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: "10deg" }, { scale: 1.2 }],
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 86,
            left: 0,
            transform: [{ rotate: "-45deg" }],
          }}
        >
          <IonIcons
            name="film"
            size={86}
            color={activeIconName === "film" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: -16,
            left: 16,
            transform: [{ rotate: "0deg" }],
          }}
        >
          <IonIcons
            name="fast-food"
            size={86}
            color={activeIconName === "fast-food" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: -32,
            left: 118,
            transform: [{ rotate: "-40deg" }],
          }}
        >
          <IonIcons
            name="game-controller"
            size={86}
            color={
              activeIconName === "game-controller" ? activeColor : inactiveColor
            }
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: 16,
            right: 100,
            transform: [{ rotate: "-20deg" }],
          }}
        >
          <IonIcons
            name="cart"
            size={86}
            color={activeIconName === "cart" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: 48,
            left: 86,
            transform: [{ rotate: "10deg" }],
          }}
        >
          <IonIcons
            name="medical"
            size={86}
            color={activeIconName === "medical" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: 46,
            right: 16,
            transform: [{ rotate: "20deg" }],
          }}
        >
          <IonIcons
            name="gift"
            size={86}
            color={activeIconName === "gift" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: -36,
            right: 32,
            transform: [{ rotate: "0deg" }],
          }}
        >
          <IonIcons
            name="car"
            size={86}
            color={activeIconName === "car" ? activeColor : inactiveColor}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            right: -48,
            transform: [{ rotate: "0deg" }],
          }}
        >
          <IonIcons
            name="star"
            size={86}
            color={activeIconName === "star" ? activeColor : inactiveColor}
          />
        </Animated.View>
      </View>
    </>
  );
};

export default LoopingHeroIcon;
