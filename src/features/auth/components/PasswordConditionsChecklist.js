import { View } from "react-native";
import Animated, {
  BounceIn,
  BounceOut,
  FadeIn,
  FadeOut,
  SlideInLeft,
} from "react-native-reanimated";
import CheckList from "../../../components/CheckList";
import { TextPrimary } from "../../../components/Text";

const PasswordConditionsChecklist = ({ conditions }) => {
  return (
    <>
      {conditions && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={{
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 10,
            // flex: 1,
            // maxHeight: 140,
          }}
        >
          <TextPrimary label="New password rules:" />
          {conditions.map((condition) => {
            return (
              <CheckList
                viewOnly
                primaryLabel={condition.label}
                item={true}
                singleChecklist
                selected={condition.checked}
              />
            );
          })}
        </Animated.View>
      )}
    </>
  );
};

export default PasswordConditionsChecklist;
