import { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import {
  useGlobalAppSettings,
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
  uploadProfilePicture,
} from "../../../api/firebase/cloudStorage";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import Loading from "../../../components/Loading";

const MyProfilePictureScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [previousImage, setPreviousImage] = useState(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setImage(userAccount?.photoURL);
    setPreviousImage(userAccount?.photoURL);
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
          //   alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 32,
            alignItems: "center",
          }}
        >
          {!image && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderColor: appSettings.theme.style.colors.primary,
                height: 200,
                width: 200,
                borderRadius: 200 / 2,
                borderWidth: 3,
              }}
            >
              {/* <Image source={checkmark} style={{ height: 128, width: 128 }} /> */}
              <IonIcons
                name="person"
                size={64}
                color={appSettings.theme.style.colors.primary}
              />
            </View>
          )}
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                borderRadius: 200 / 2,
                width: 200,
                height: 200,
              }}
            />
          )}
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
                  <ButtonPrimary
                    label="Remove"
                    onPress={() => setImage(null)}
                  />
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
              {image && previousImage !== image && (
                <ButtonPrimary
                  label="Save"
                  onPress={async () => {
                    setIsUploading(true);
                    uploadProfilePicture(image, userAccount.uid).then(
                      async () => {
                        const patchUserAccount = {
                          ...userAccount,
                          photoURL: await getProfilePictureURL(userAccount.uid),
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

                        navigation.goBack();
                      }
                    );
                  }}
                />
              )}
              {(!image || previousImage === image) && (
                <ButtonDisabled label="Save" />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default MyProfilePictureScreen;
