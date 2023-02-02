import { ScrollView, View } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import TermsOfService from "../components/TermsOfService";

const TermsOfServiceScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backgroundColor: appSettings.theme.style.colors.background,
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
      </ScrollView>
    </>
  );
};

export default TermsOfServiceScreen;
