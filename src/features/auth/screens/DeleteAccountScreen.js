import { View, Text, Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { TextDanger, TextPrimary } from "../../../components/Text";
import {
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  ButtonDisabled,
  ButtonPrimaryDanger,
  ButtonSecondary,
} from "../../../components/Button";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import DELETE_ACCOUNT_SCREEN_CONSTANTS from "../../../constants/screens/deleteAccountScreenConstants";
import CustomTextInput from "../../../components/CustomTextInput";
import requestUserDataDeletion from "../../../api/firebase/requestUserDataDeletion";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import Loading from "../../../components/Loading";
import cancelUserDataDeletion from "../../../api/firebase/cancelUserDataDeletion";

const DeleteAccountScreen = ({ navigation }) => {
  const { globalTheme } = useGlobalTheme();
  const { userAccount } = useGlobalUserAccount();
  const [password, setPassword] = useState("");
  const [deletionRequest, setDeletionRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputPasswordRef = useRef();

  useEffect(() => {
    fetchDeletionRequest();
  }, []);
  const newDeletionRequest = {
    uid: 123,
    email: "dac",
    requestDate: Date.now(),
    // deletionDate: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days from now
    deletionDate: Date.now() + 1000 * 60 * 15 * 1 * 1, // example : 15 min from now
    deletionTaskId: "",
    status: "scheduled",
  };
  const fetchDeletionRequest = async () => {
    const userRequest = await firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.DELETION_REQUESTS,
      userAccount.uid
    );
    if (userRequest) setDeletionRequest(userRequest);
    // setDeletionRequest(newDeletionRequest);
    setIsLoading(false);
  };

  return (
    <CustomScrollView
      contentContainerStyle={{
        justifyContent: isLoading ? "center" : "flex-start",
      }}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {deletionRequest && (
            <>
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
                  name="information-circle-outline"
                  size={64}
                  color={globalTheme.colors.foreground}
                  style={{
                    alignSelf: "center",
                    paddingBottom: 8,
                  }}
                />
                <TextPrimary
                  label={DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED.FIRST_LABEL}
                  style={{
                    alignSelf: "center",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={`${
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED.SECOND_LABEL
                  } ${new Date(
                    deletionRequest.deletionDate
                  ).toDateString()} at ${new Date(
                    deletionRequest.deletionDate
                  ).toLocaleTimeString()}`}
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED.THIRD_LABEL}
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED.FOURTH_LABEL}
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
                  {/* // TAG : Cancel Deletion Button */}
                  <View style={{ flex: 2, paddingLeft: 8 }}>
                    {password?.length < 6 && (
                      <ButtonDisabled
                        label={
                          DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED
                            .CANCEL_DELETION_BUTTON_LABEL
                        }
                      />
                    )}
                    {password?.length >= 6 && (
                      <ButtonPrimaryDanger
                        label={
                          DELETE_ACCOUNT_SCREEN_CONSTANTS.REQUESTED
                            .CANCEL_DELETION_BUTTON_LABEL
                        }
                        onPress={() => {
                          cancelUserDataDeletion(
                            userAccount.uid,
                            userAccount.email,
                            password
                          ).then(() => {
                            setIsLoading(true);
                            fetchDeletionRequest();
                          });
                        }}
                      />
                    )}
                  </View>
                </ActionButtonWrapper>
              </View>
            </>
          )}
          {!deletionRequest && (
            <>
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
                  name="warning"
                  size={64}
                  color={globalTheme.colors.danger}
                  style={{
                    alignSelf: "center",
                    paddingBottom: 8,
                  }}
                />
                <TextDanger
                  label={
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                      .FIRST_LABEL
                  }
                  style={{
                    alignSelf: "center",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                      .SECOND_LABEL
                  }
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                      .THIRD_LABEL
                  }
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                      .FOURTH_LABEL
                  }
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextPrimary
                  label={
                    DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                      .FIFTH_LABEL
                  }
                  style={{}}
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
                      label={
                        DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                          .CANCEL_BUTTON_LABEL
                      }
                      onPress={() => {
                        navigation.goBack();
                      }}
                    />
                  </View>

                  {/* // TAG : Delete Button */}
                  <View style={{ flex: 2, paddingLeft: 8 }}>
                    {password?.length < 6 && (
                      <ButtonDisabled
                        label={
                          DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                            .DELETE_BUTTON_LABEL
                        }
                      />
                    )}
                    {password?.length >= 6 && (
                      <ButtonPrimaryDanger
                        label={
                          DELETE_ACCOUNT_SCREEN_CONSTANTS.NOT_YET_REQUESTED
                            .DELETE_BUTTON_LABEL
                        }
                        onPress={() => {
                          requestUserDataDeletion(
                            userAccount.uid,
                            userAccount.email,
                            password
                          ).then(() => {
                            setIsLoading(true);
                            fetchDeletionRequest();
                          });
                        }}
                      />
                    )}
                  </View>
                </ActionButtonWrapper>
              </View>
            </>
          )}
        </>
      )}
    </CustomScrollView>
  );
};

export default DeleteAccountScreen;
