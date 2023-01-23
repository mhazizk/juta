import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import {
  useGlobalAppSettings,
  useGlobalFeatureWishlist,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import wishlistModel from "../model/wishlistModel";
import uuid from "react-native-uuid";
import { TextPrimary } from "../../../components/Text";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import screenList from "../../../navigations/ScreenList";
import LOADING_TYPES from "../../../screens/modal/loading.type";

const NewFeatureWishlistScreen = ({ navigation }) => {
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const [newWishlist, setNewWishlist] = useState(null);

  useEffect(() => {
    if (userAccount && !newWishlist) {
      setNewWishlist({
        ...wishlistModel,
        uid: userAccount.uid,
        wishlist_id: uuid.v4(),
      });
    }
  }, []);

  useEffect(() => {}, [newWishlist]);

  const submitWishlist = () => {
    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
        newWishlist.wishlist_id,
        newWishlist
      );

      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.USERS,
        userAccount.uid,
        {
          ...userAccount,
          featureWishlist: [
            ...userAccount.featureWishlist,
            newWishlist.wishlist_id,
          ],
        }
      );
    }, 5000);

    navigation.navigate(screenList.loadingScreen, {
      label: "Submitting your wishlist...",
      loadingType: LOADING_TYPES.FEATURE_WISHLIST.INSERT_ONE,
      featureWishlist: newWishlist,
      reducerUpdatedAt: Date.now(),
    });
  };

  return (
    <>
      {newWishlist && (
        <ScrollView
          contentContainerStyle={{
            minHeight: "100%",
            alignItems: "center",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <TextPrimary label="New feature wishlist" />
          <TextPrimary label={userAccount.displayName} />
          {/* // TAG : Title */}
          <CustomTextInput
            inputRef={titleInputRef}
            inputType="text"
            inputQuery={newWishlist.title}
            placeholder="Feature title"
            onChange={(text) => {
              setNewWishlist({ ...newWishlist, title: text });
            }}
          />
          {/* // TAG : Description */}
          <CustomTextInput
            inputRef={descriptionInputRef}
            inputType="text"
            inputQuery={newWishlist.description}
            placeholder="Some descritpion about the feature"
            onChange={(text) => {
              setNewWishlist({ ...newWishlist, description: text });
            }}
          />
          {!!newWishlist.title && !!newWishlist.description && (
            <ButtonPrimary label="Submit" onPress={() => submitWishlist()} />
          )}
          {!newWishlist.title && !newWishlist.description && (
            <ButtonDisabled label="Submit" />
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewFeatureWishlistScreen;
