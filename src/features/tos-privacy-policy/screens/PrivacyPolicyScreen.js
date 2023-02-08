import { ScrollView, View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import PrivacyPolicy from "../components/PrivacyPolicy";

const PrivacyPolicyScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <CustomScrollView
        contentContainerStyle={{
          paddingTop: 16,
        }}
      >
        <View
          style={{
            maxWidth: 1024,
          }}
        >
          <TextPrimary
            label="Privacy Policy"
            style={{
              padding: 16,
              alignSelf: "center",
              fontSize: 24,
              fontWeight: "bold",
            }}
          />
          <PrivacyPolicy />
        </View>
      </CustomScrollView>
    </>
  );
};

export default PrivacyPolicyScreen;
