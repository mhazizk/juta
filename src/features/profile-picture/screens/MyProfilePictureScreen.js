import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as ImagePicker from "expo-image-picker";
import {
  ButtonDisabled,
  ButtonPrimary,
  ButtonSecondary,
} from "../../../components/Button";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  getProfilePictureURL,
  uploadImage,
} from "../../../api/firebase/cloudStorage";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import uploadProfilePicture from "../../../api/firebase/uploadProfilePicture";
import screenList from "../../../navigations/ScreenList";
import { Image } from "expo-image";

const MyProfilePictureScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [previousImage, setPreviousImage] = useState(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setImage(userAccount?.photoURL);
    setPreviousImage(userAccount?.photoURL);
  }, []);

  const showSaveButton = previousImage !== image || (!image && previousImage);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <CustomScrollView>
        <View
          style={{
            padding: 32,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (image)
                navigation.navigate(screenList.imageViewerScreen, {
                  uriList: [image],
                  defaultUri: image,
                });
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderColor: globalTheme.colors.primary,
              height: 200,
              width: 200,
              borderRadius: 200 / 2,
              borderWidth: 3,
            }}
          >
            {/* <Image source={checkmark} style={{ height: 128, width: 128 }} /> */}
            {!image && (
              <IonIcons
                name="person"
                size={64}
                color={globalTheme.colors.primary}
              />
            )}
            {image && (
              <Image
                source={{ uri: image }}
                cachePolicy="memory-disk"
                style={{
                  borderRadius: 200 / 2,
                  width: 200,
                  height: 200,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        {isUploading && <Loading />}
        {!isUploading && (
          <View
            style={{
              paddingHorizontal: 16,
              // alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                padding: 16,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                {!image && <ButtonDisabled label="Remove" />}
                {image && (
                  <ButtonPrimary label="Remove" onPress={() => setImage("")} />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 8,
                }}
              >
                <ButtonPrimary label="Choose" onPress={() => pickImage()} />
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              {showSaveButton && (
                <ButtonPrimary
                  label="Save"
                  onPress={async () => {
                    setIsUploading(true);
                    let patchUserAccount;
                    if (image) {
                      uploadProfilePicture(image, userAccount.uid).then(
                        async (imageURL) => {
                          patchUserAccount = {
                            ...userAccount,
                            photoURL: imageURL,
                            _timestamps: {
                              ...userAccount._timestamps,
                              updated_at: Date.now(),
                              updated_by: userAccount.uid,
                            },
                          };
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.USERS,
                            patchUserAccount.uid,
                            patchUserAccount
                          );
                        }
                      );
                    }
                    if (!image) {
                      patchUserAccount = {
                        ...userAccount,
                        photoURL: null,
                        _timestamps: {
                          ...userAccount._timestamps,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                      };
                      await firestore.setData(
                        FIRESTORE_COLLECTION_NAMES.USERS,
                        patchUserAccount.uid,
                        patchUserAccount
                      );
                    }

                    navigation.goBack();
                  }}
                />
              )}
              {!showSaveButton && <ButtonDisabled label="Save" />}
            </View>
          </View>
        )}
      </CustomScrollView>
    </>
  );
};

export default MyProfilePictureScreen;
