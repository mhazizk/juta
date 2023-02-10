import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  ButtonDisabled,
  ButtonPrimary
} from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import {
  useGlobalAppSettings, useGlobalTheme,
  useGlobalUserAccount
} from "../../../reducers/GlobalContext";
import wishlistModel from "../model/wishlistModel";
import uuid from "react-native-uuid";
import { TextPrimary } from "../../../components/Text";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import filterBadWords from "../../../api/rapidapi/filterBadWords";

const NewFeatureWishlistScreen = ({ navigation }) => {
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { userAccount } = useGlobalUserAccount();
  const [newWishlist, setNewWishlist] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showProfanityFilter, setShowProfanityFilter] = useState({
    title: false,
    description: false,
  });

  useEffect(() => {
    if (userAccount && !newWishlist) {
      setNewWishlist({
        ...wishlistModel,
        uid: userAccount.uid,
        wishlist_id: uuid.v4(),
        voters: [userAccount.uid],
        voters_count: 1,
        _timestamps: {
          ...wishlistModel._timestamps,
          created_by: userAccount.uid,
          updated_by: userAccount.uid,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (newWishlist?.title && newWishlist?.description) {
      setShowButton(true);
      setShowProfanityFilter({
        title: false,
        description: false,
      });
    }
    // }
  }, [newWishlist]);

  useEffect(() => {}, [showProfanityFilter]);

  const submitWishlist = async () => {
    const finalWishlist = {
      ...newWishlist,
      title: await filterBadWords(newWishlist.title),
      description: await filterBadWords(newWishlist.description),
    };

    if (
      finalWishlist.title.includes("*") ||
      finalWishlist.description.includes("*")
    ) {
      setIsSubmitting(false);
      setShowButton(false);
      return setShowProfanityFilter({
        ...showProfanityFilter,
        title: finalWishlist.title.includes("*") ? true : false,
        description: finalWishlist.description.includes("*") ? true : false,
      });
    } else {
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
          finalWishlist.wishlist_id,
          finalWishlist
        );

        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          {
            ...userAccount,
            featureWishlist: [
              ...userAccount.featureWishlist,
              finalWishlist.wishlist_id,
            ],
          }
        );
      }, 1);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }

    // navigation.navigate(screenList.loadingScreen, {
    //   label: "Submitting your wishlist...",
    //   loadingType: LOADING_TYPES.FEATURE_WISHLIST.INSERT_ONE,
    //   featureWishlist: newWishlist,
    //   reducerUpdatedAt: Date.now(),
    // });
  };

  return (
    <>
      {newWishlist && (
        <CustomScrollView
          contentContainerStyle={{
            paddingTop: 16,
          }}
        >
          <TextPrimary
            label={`We love to hear your feedback and request to make Juta even better`}
            style={{
              textAlign: "center",
              paddingBottom: 32,
            }}
          />
          <IonIcons
            name="bulb"
            color={globalTheme.colors.foreground}
            size={48}
          />
          <TextPrimary
            label={userAccount.displayName}
            style={{
              fontSize: 24,
              paddingBottom: 16,
            }}
          />
          {/* // TAG : Title */}
          <CustomTextInput
            maxLength={40}
            inputRef={titleInputRef}
            inputType="text"
            inputQuery={newWishlist.title}
            placeholder="Feature title"
            onChange={(text) => {
              setNewWishlist({ ...newWishlist, title: text });
            }}
          />
          {showProfanityFilter.title && (
            <TextPrimary
              label="Please avoid using profanity"
              style={{
                paddingLeft: 16,
                paddingBottom: 8,
                alignSelf: "flex-start",
                color: globalTheme.colors.danger,
              }}
            />
          )}
          {/* // TAG : Description */}
          <CustomTextInput
            maxLength={60}
            inputRef={descriptionInputRef}
            inputType="text"
            inputQuery={newWishlist.description}
            placeholder="Some description about the feature"
            onChange={(text) => {
              setNewWishlist({ ...newWishlist, description: text });
            }}
          />
          {showProfanityFilter.description && (
            <TextPrimary
              label="Please avoid using profanity"
              style={{
                paddingLeft: 16,
                paddingBottom: 8,
                alignSelf: "flex-start",
                color: globalTheme.colors.danger,
              }}
            />
          )}

          <View
            style={{
              paddingTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <ButtonSecondary label="Cancel" onPress={() => submitWishlist()} /> */}
            <View
              style={{
                alignItems: "center",
              }}
            >
              {!isSubmitting && showButton && (
                <ButtonPrimary
                  label="Submit"
                  width="100%"
                  onPress={() => {
                    setIsSubmitting(true);
                    submitWishlist();
                  }}
                />
              )}
              {isSubmitting && <Loading />}
              {!isSubmitting && !showButton && (
                <ButtonDisabled label="Submit" />
              )}
            </View>
          </View>
        </CustomScrollView>
      )}
    </>
  );
};

export default NewFeatureWishlistScreen;
