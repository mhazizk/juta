import { useEffect, useState } from "react";
import { FlatList, View, RefreshControl } from "react-native";
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
import IonIcons from "react-native-vector-icons/Ionicons";
import ListSection from "../../../components/List/ListSection";
import { useIsFocused } from "@react-navigation/native";

const FeatureWishlistScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { globalFeatureWishlist } = useGlobalFeatureWishlist();
  const [publicWishlist, setPublicWishlist] = useState([
    // {
    //   uid: userAccount.uid,
    //   wishlist_id: userAccount.uid,
    //   voters: [userAccount.uid],
    //   status: "active",
    //   title:
    //     "Coba ini adalah judul wishlist yang sangat panjang sekali dan sangatlah panjanggg wwwkf wwic",
    //   description: "coba ini adalah deskripsi wishlist yang sangat panjang",
    //   _timestamps: {
    //     created_at: Date.now(),
    //     updated_at: Date.now(),
    //     created_by: userAccount.uid,
    //     updated_by: userAccount.uid,
    //   },
    // },
    // {
    //   uid: userAccount.uid,
    //   wishlist_id: userAccount.uid,
    //   voters: [123, 456, 789],
    //   status: "active",
    //   title: "Add feature to send money",
    //   description: "",
    //   _timestamps: {
    //     created_at: Date.now(),
    //     updated_at: Date.now(),
    //     created_by: userAccount.uid,
    //     updated_by: userAccount.uid,
    //   },
    // },
    // {
    //   uid: userAccount.uid,
    //   wishlist_id: userAccount.uid,
    //   voters: [123, 456, 789],
    //   status: "",
    //   title: "Coba",
    //   description: "coba",
    //   _timestamps: {
    //     created_at: Date.now(),
    //     updated_at: Date.now(),
    //     created_by: userAccount.uid,
    //     updated_by: userAccount.uid,
    //   },
    // },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      setTimeout(() => {
        if (userAccount) {
          getPublicWishlist();
        }
      }, 1);
    }
  }, [isFocused]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (userAccount) {
        getPublicWishlist();
      }
    }, 1);
  }, []);

  useEffect(() => {
    if (publicWishlist.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [publicWishlist]);

  const getPublicWishlist = async () => {
    const publicFeatureWishlist = await firestore.paginationQuery(
      FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
      userAccount.uid,
      20
    );
    setPublicWishlist(publicFeatureWishlist);
    // TODO : get public wishlist and set to publicWishlist in pagination mode
  };

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getPublicWishlist()}
          />
        }
        data={publicWishlist}
        style={{
          backgroundColor: appSettings.theme.style.colors.background,
          minHeight: publicWishlist.length > 0 ? "100%" : 0,
          paddingTop: 16,
        }}
        key={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <>
              {!isLoading && publicWishlist.length > 0 && (
                <>
                  <ListSection>
                    <WishlistItem
                      uid={userAccount.uid}
                      item={item}
                      onPress={async (item) => {
                        console.log(item);
                        if (
                          item?.voters.some(
                            (voter) => voter === userAccount.uid
                          )
                        ) {
                          console.log("remove vote");
                          await firestore
                            .setData(
                              FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
                              item.wishlist_id,
                              {
                                ...item,
                                voters: [
                                  ...item.voters.filter(
                                    (voter) => voter !== userAccount.uid
                                  ),
                                ],
                                voters_count: item.voters.length - 1,
                                _timestamps: {
                                  ...item._timestamps,
                                  updated_at: Date.now(),
                                  updated_by: userAccount.uid,
                                },
                              }
                            )
                            .then(async () => {
                              setIsLoading(true);
                              await getPublicWishlist();
                            });
                        } else {
                          console.log("add vote");
                          await firestore
                            .setData(
                              FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
                              item.wishlist_id,
                              {
                                ...item,
                                voters: [...item.voters, userAccount.uid],
                                voters_count: item.voters.length + 1,
                                _timestamps: {
                                  ...item._timestamps,
                                  updated_at: Date.now(),
                                  updated_by: userAccount.uid,
                                },
                              }
                            )
                            .then(async () => {
                              setIsLoading(true);
                              await getPublicWishlist();
                            });
                        }
                      }}
                    />
                  </ListSection>
                </>
              )}
            </>
          );
        }}
      />
      {!isLoading && !publicWishlist.length && (
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <IonIcons
            name="document-text-outline"
            size={64}
            color={appSettings.theme.style.colors.secondary}
          />
          <TextSecondary
            label="No public wishlist yet"
            style={{
              paddingTop: 16,
            }}
          />
        </View>
      )}
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
            label="Fetching all public wishlist..."
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
