import { ScrollView, View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import TermsOfService from "../components/TermsOfService";

const TermsOfServiceScreen = ({ navigation }) => {
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
            label="Terms of Service"
            style={{
              padding: 16,
              alignSelf: "center",
              fontSize: 24,
              fontWeight: "bold",
            }}
          />
          <TermsOfService />
        </View>
      </CustomScrollView>
    </>
  );
};

export default TermsOfServiceScreen;
