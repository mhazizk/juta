import { View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { TextPrimary } from "../../../components/Text";

const AnimatedLoginText = () => {
    const textData = [
      { name: "food", emoji: "🍜" },
      { name: "travel", emoji: "🚗" },
      { name: "shopping", emoji: "🛍" },
      { name: "salary", emoji: "💰" },
      { name: "bills", emoji: "📝" },
      { name: "games", emoji: "🎮" },
      { name: "gifts", emoji: "🎁" },
    ];
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            //   height: 64,
          }}
        >
          <TextPrimary
            label="Your"
            style={{
              paddingBottom: 16,
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
              height={72}
              data={textData}
              key={(index) => index}
              renderItem={({ index }) => (
                <>
                  <View
                    style={{
                      // flex: 1,
                      // width: 200,
                      // height: 64,
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