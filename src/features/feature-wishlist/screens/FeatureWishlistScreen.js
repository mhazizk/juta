import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ListItem } from "../../../components/List";
import Loading from "../../../components/Loading";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalFeatureWishlist,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import WishlistItem from "../components/WishlistItem";

const FeatureWishlistScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { globalFeatureWishlist } = useGlobalFeatureWishlist();
  const [publicWishlist, setPublicWishlist] = useState({
    status: null,
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (userAccount) {
        getPublicWishlist();
      }
    }, 1);
  }, []);

  useEffect(() => {
    if (publicWishlist) {
      setIsLoading(false);
    }
  }, [publicWishlist]);

  const getPublicWishlist = async () => {
    //  const publicFeatureWishlist = await firestore.getAndListenMultipleDocs(
    //    FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
    //   );
    // TODO : get public wishlist and set to publicWishlist in pagination mode
  };

  return (
    <>
      <FlatList
        data={publicWishlist.data}
        key={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <>
              {
                !isLoading(
                  <>
                    <WishlistItem uid={userAccount.uid} item={item} />
                  </>
                )
              }
            </>
          );
        }}
      />
      {isLoading && (
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <Loading />
          <TextPrimary
            label="Create New Repeated Transaction"
            style={{
              paddingTop: 16,
            }}
          />
        </View>
      )}
    </>
  );
};

export default FeatureWishlistScreen;
