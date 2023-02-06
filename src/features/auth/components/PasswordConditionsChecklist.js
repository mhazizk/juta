import { View } from "react-native";
import CheckList from "../../../components/CheckList";
import { TextPrimary } from "../../../components/Text";

const PasswordConditionsChecklist = ({ conditions }) => {
  return (
    <>
      {conditions && (
        <View
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
        </View>
      )}
    </>
  );
};

export default PasswordConditionsChecklist;
