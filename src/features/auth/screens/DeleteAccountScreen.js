import { View, Text, Dimensions, Alert } from "react-native";
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

  const fetchDeletionRequest = async () => {
    const userRequest = await firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.DELETION_REQUESTS,
      userAccount.uid
    );
    if (userRequest) {
      setDeletionRequest(userRequest);
    } else {
      setDeletionRequest(null);
    }
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
                          setIsLoading(true);
                          //   check if the cancelation request is made within an hour of the deletion request
                          //   if yes, then show alert
                          //   else, cancel the deletion request
                          const requestDateInMillis =
                            deletionRequest.requestDate;
                          const currentDateInMillis = Date.now();
                          const differenceInHours =
                            (currentDateInMillis - requestDateInMillis) /
                            (1000 * 60 * 60);
                          console.log(differenceInHours);
                          if (differenceInHours < 1) {
                            Alert.alert(
                              "Cancel Deletion Request",
                              "You have just made a deletion request. Please wait for at least an hour before cancelling the request."
                            );
                            setIsLoading(false);
                          } else {
                            cancelUserDataDeletion(
                              userAccount.uid,
                              userAccount.email,
                              password
                            )
                              .then(() => {
                                setPassword("");
                                setTimeout(() => {
                                  fetchDeletionRequest();
                                }, 1000);
                              })
                              .catch((error) => {
                                setIsLoading(false);
                              });
                          }
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
                          setIsLoading(true);
                          requestUserDataDeletion(
                            userAccount.uid,
                            userAccount.email,
                            password
                          )
                            .then(() => {
                              setPassword("");
                              setTimeout(() => {
                                fetchDeletionRequest();
                              }, 1000);
                            })
                            .catch((error) => {
                              setIsLoading(false);
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
