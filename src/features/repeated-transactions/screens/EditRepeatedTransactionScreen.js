import { ScrollView } from "react-native";
import {
  ButtonPrimary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";

const EditRepeatedTransactionScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  return (
    <>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <ListSection>
          <ButtonPrimary label="Save for this next repeated transactions" />
        </ListSection>
        <ListSection>
          <ButtonPrimary label="Save for all of this repeated transactions" />
        </ListSection>
        <ListSection>
          <ButtonSecondaryDanger label="Delete all of this repeated transactions" />
        </ListSection>
        <ListSection>
          <ButtonSecondaryDanger label="Delete all of this previous repeated transactions" />
        </ListSection>
      </ScrollView>
    </>
  );
};

export default EditRepeatedTransactionScreen;
