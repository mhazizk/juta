import { View, Text, Dimensions } from "react-native";
import { useRef, useState } from "react";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { TextDanger, TextPrimary } from "../../../components/Text";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  ButtonDisabled,
  ButtonPrimaryDanger,
  ButtonSecondary,
} from "../../../components/Button";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import DELETE_ACCOUNT_SCREEN_CONSTANTS from "../../../constants/screens/deleteAccountScreenConstants";
import CustomTextInput from "../../../components/CustomTextInput";

const DeleteAccountScreen = ({ navigation }) => {
  const { globalTheme } = useGlobalTheme();
  const [password, setPassword] = useState("");
  const inputPasswordRef = useRef();
  return (
    <CustomScrollView>
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          paddingHorizontal: 16,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <IonIcons
          name="alert-circle-outline"
          size={64}
          color={globalTheme.colors.danger}
          style={{
            alignSelf: "center",
            paddingBottom: 8,
          }}
        />
        <TextDanger
          label={DELETE_ACCOUNT_SCREEN_CONSTANTS.FIRST_LABEL}
          style={{
            alignSelf: "center",
            fontWeight: "bold",
            textAlign: "center",
            paddingBottom: 16,
          }}
        />
        <TextPrimary
          label={DELETE_ACCOUNT_SCREEN_CONSTANTS.SECOND_LABEL}
          style={{
            // textAlign: "center",
            paddingBottom: 16,
          }}
        />
        <TextPrimary
          label={DELETE_ACCOUNT_SCREEN_CONSTANTS.THIRD_LABEL}
          style={{
            // textAlign: "center",
            paddingBottom: 16,
          }}
        />
        <TextPrimary
          label={DELETE_ACCOUNT_SCREEN_CONSTANTS.FOURTH_LABEL}
          style={{
            // textAlign: "center",
            paddingBottom: 16,
          }}
        />
        <TextPrimary
          label={DELETE_ACCOUNT_SCREEN_CONSTANTS.FIFTH_LABEL}
          style={
            {
              // textAlign: "center",
            }
          }
        />

        <View
          style={{
            width: Dimensions.get("window").width,
            padding: 16,
            alignSelf: "center",
          }}
        >
          <CustomTextInput
            inputRef={inputPasswordRef}
            inputType="password"
            inputQuery={password}
            onChange={(text) => {
              setPassword(text);
            }}
            placeholder="Enter password"
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <View
        style={{
          flex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActionButtonWrapper>
          {/* // TAG : Cancel Button */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <ButtonSecondary
              label={DELETE_ACCOUNT_SCREEN_CONSTANTS.CANCEL_BUTTON_LABEL}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>

          {/* // TAG : Delete Button */}
          <View style={{ flex: 2, paddingLeft: 8 }}>
            {password?.length < 6 && (
              <ButtonDisabled
                label={DELETE_ACCOUNT_SCREEN_CONSTANTS.DELETE_BUTTON_LABEL}
              />
            )}
            {password?.length >= 6 && (
              <ButtonPrimaryDanger
                label={DELETE_ACCOUNT_SCREEN_CONSTANTS.DELETE_BUTTON_LABEL}
                onPress={() => {}}
              />
            )}
          </View>
        </ActionButtonWrapper>
      </View>
    </CustomScrollView>
  );
};

export default DeleteAccountScreen;
