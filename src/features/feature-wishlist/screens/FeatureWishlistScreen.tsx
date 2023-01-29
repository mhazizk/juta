import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  RefreshControl,
  TouchableNativeFeedback,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";
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
  const [publicWishlist, setPublicWishlist] = useState([]);
  const [privateWishlist, setPrivateWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [privateLoading, setPrivateLoading] = useState(false);
  const [publicLoading, setPublicLoading] = useState(false);
  const [showFeatureWishlist, setShowFeatureWishlist] = useState({
    public: true,
    private: false,
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // setIsLoading(true);
      setPrivateLoading(true);
      setPublicLoading(true);
      setTimeout(() => {
        if (userAccount) {
          getPublicWishlist();
        }
      }, 1);
    }
  }, [isFocused]);

  useEffect(() => {
    // setIsLoading(true);
    setPrivateLoading(true);
    setPublicLoading(true);
    setTimeout(() => {
      if (userAccount) {
        getPublicWishlist();
        getPrivateWishlist();
      }
    }, 1);
  }, []);

  useEffect(() => {
    // console.log(publicWishlist);
    if (publicWishlist.length > 0) {
      // setIsLoading(false);
      setPublicLoading(false);
    } else {
      // setIsLoading(false);
      setPublicLoading(false);
    }
  }, [publicWishlist]);

  useEffect(() => {
    console.log(privateWishlist);
    if (privateWishlist.length > 0) {
      // setIsLoading(false);
      setPrivateLoading(false);
    } else {
      // setIsLoading(false);
      setPrivateLoading(false);
    }
  }, [privateWishlist]);

  const getPublicWishlist = async () => {
    const publicFeatureWishlist = await firestore.paginationQuery(
      FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
      // userAccount.uid,
      20
    );
    setPublicWishlist(publicFeatureWishlist);
    // TODO : get public wishlist and set to publicWishlist in pagination mode
  };

  const getPrivateWishlist = async () => {
    const myWishlist = userAccount.featureWishlist;
    // console.log(myWishlist);

    const privateWishlist = [];
    const wishlist = await firestore.getMyFeatureWishlist(
      FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
      userAccount.uid
    );
    privateWishlist.push(...wishlist);
    setPrivateWishlist(
      privateWishlist.sort((a, b) => b.voters_count - a.voters_count)
    );
  };

  return (
    <>
      {/* // SECTION : Tab button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appSettings.theme.style.colors.background,
          // padding: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setShowFeatureWishlist({
              public: true,
              private: false,
            });
          }}
          style={{
            flex: 1,
            height: 48,
            paddingRight: 8,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              paddingBottom: showFeatureWishlist.public ? 8 : 0,
              borderBottomWidth: 2,
              borderBottomColor: showFeatureWishlist.public
                ? appSettings.theme.style.colors.foreground
                : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextPrimary
              label="Public Wishlist"
              style={{
                fontWeight: showFeatureWishlist.public ? "bold" : "normal",
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowFeatureWishlist({
              public: false,
              private: true,
            });
          }}
          style={{
            flex: 1,
            height: 48,
            paddingLeft: 8,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              paddingBottom: showFeatureWishlist.private ? 8 : 0,
              borderBottomWidth: 2,
              borderBottomColor: showFeatureWishlist.private
                ? appSettings.theme.style.colors.foreground
                : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextPrimary
              label="My Wishlist"
              style={{
                fontWeight: showFeatureWishlist.private ? "bold" : "normal",
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* // SECTION : Public component */}
      {showFeatureWishlist.public && (
        <>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={publicLoading}
                onRefresh={() => getPublicWishlist()}
              />
            }
            data={publicWishlist}
            style={{
              backgroundColor: appSettings.theme.style.colors.background,
              minHeight: publicWishlist.length > 0 ? "100%" : 0,
              paddingVertical: 16,
            }}
            ListFooterComponent={() => (
              <>
                {!publicLoading && publicWishlist.length > 0 && (
                  <View
                    style={{
                      paddingBottom: 86,
                      alignItems: "center",
                    }}
                  >
                    <IonIcons
                      name="checkmark-circle-outline"
                      size={20}
                      color={appSettings.theme.style.colors.foreground}
                    />
                    <TextPrimary label="That's all for now" />
                  </View>
                )}
              </>
            )}
            key={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <>
                  {!publicLoading && publicWishlist.length > 0 && (
                    <>
                      <ListSection>
                        <WishlistItem
                          uid={userAccount.uid}
                          item={item}
                          onPressVote={async (item) => {
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
                                  setPublicLoading(true);
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
                                  setPublicLoading(true);
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
        </>
      )}
      {showFeatureWishlist.private && (
        <>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={privateLoading}
                onRefresh={() => getPrivateWishlist()}
              />
            }
            data={privateWishlist}
            style={{
              backgroundColor: appSettings.theme.style.colors.background,
              minHeight: privateWishlist.length > 0 ? "100%" : 0,
              paddingVertical: 16,
            }}
            ListFooterComponent={() => (
              <>
                {!privateLoading && privateWishlist.length > 0 && (
                  <View
                    style={{
                      paddingBottom: 86,
                      alignItems: "center",
                    }}
                  >
                    {/* <IonIcons
                      name="checkmark-circle-outline"
                      size={20}
                      color={appSettings.theme.style.colors.foreground}
                    /> */}
                    {/* <TextPrimary label="That's all for now" /> */}
                  </View>
                )}
              </>
            )}
            key={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <>
                  {!privateLoading && privateWishlist.length > 0 && (
                    <>
                      <ListSection>
                        <WishlistItem
                          deleteable
                          uid={userAccount.uid}
                          item={item}
                          onPressDelete={() => {
                            Alert.alert(
                              "Delete Wishlist",
                              "Are you sure you want to delete this wishlist?",
                              [
                                {
                                  text: "Cancel",
                                  onPress: () => {},
                                  style: "cancel",
                                },
                                {
                                  text: "Delete",
                                  onPress: async () => {
                                    await firestore
                                      .deleteData(
                                        FIRESTORE_COLLECTION_NAMES.FEATURE_WISHLIST,
                                        item.wishlist_id
                                      )
                                      .then(async () => {
                                        setPrivateLoading(true);
                                        await getPrivateWishlist();
                                      });
                                  },
                                },
                              ]
                            );
                          }}
                          onPressVote={async (item) => {
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
                                  setPrivateLoading(true);
                                  await getPrivateWishlist();
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
                                  setPrivateLoading(true);
                                  await getPrivateWishlist();
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
        </>
      )}
      {(!publicLoading || !privateLoading) &&
        (!publicWishlist.length || !privateWishlist.length) && (
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
              label="No feature wishlist yet"
              style={{
                paddingTop: 16,
              }}
            />
          </View>
        )}
      {(publicLoading || privateLoading) && (
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
            label="Fetching all wishlist..."
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
