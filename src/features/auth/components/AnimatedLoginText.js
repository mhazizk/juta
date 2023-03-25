import { View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { TextPrimary } from "../../../components/Text";

const AnimatedLoginText = ({ onScrollEnd }) => {
  const textData = [
    { name: "food", emoji: "🍜", iconName: "fast-food" },
    { name: "travel", emoji: "🚗", iconName: "car" },
    { name: "shopping", emoji: "🛒", iconName: "cart" },
    { name: "games", emoji: "🎮", iconName: "game-controller" },
    { name: "gifts", emoji: "🎁", iconName: "gift" },
    { name: "medicine", emoji: "⚕️", iconName: "medical" },
  ];
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          // paddingBottom: 16,
        }}
      >
        <TextPrimary
          label="Your"
          style={{
            fontSize: 48,
            fontWeight: "bold",
          }}
        />
        <View
          style={{
            flex: 1,
            // alignItems: "flex-start",
          }}
        >
          <Carousel
            vertical
            //   mode='vertical-stack'
            loop
            autoPlay
            autoPlayInterval={1000}
            scrollAnimationDuration={1000}
            //   width={100}
            // height={72}
            onSnapToItem={(index) => onScrollEnd(textData[index].iconName)}
            onScrollEnd={(index) => onScrollEnd(textData[index].iconName)}
            height={64}
            data={textData}
            key={(index) => index}
            renderItem={({ index }) => (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingLeft: 10,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <TextPrimary
                    label={textData[index].name}
                    style={{
                      color: "#CD0E61",
                      fontSize: 48,
                      fontWeight: "bold",
                    }}
                  />
                  <TextPrimary
                    label={textData[index].emoji}
                    style={{
                      marginLeft: 8,
                      fontSize: 32,
                    }}
                  />
                </View>
              </>
            )}
          />
        </View>
      </View>
    </>
  );
};

export default AnimatedLoginText;
