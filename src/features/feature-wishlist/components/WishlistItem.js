import { useEffect, useState } from "react";
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";

const WishlistItem = ({ uid, item, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {}, [voteLoading]);

  return (
    <>
      <TouchableNativeFeedback
        onPress={() => {
          setVoteLoading(true);
          setTimeout(() => {
            onPress(item);
          }, 1);
        }}
      >
        <View>
          <View
            style={{
              // backgroundColor: appSettings.theme.style.colors.background,
              // borderRadius: 16,
              padding: 16,
              // width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor: appSettings.theme.style.colors.foreground,
                  // flex: 1,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                  }}
                >
                  {voteLoading && <Loading size={30} />}
                  {!voteLoading && (
                    <IonIcons
                      name="caret-up"
                      size={36}
                      color={
                        item?.voters.some((voter) => voter === uid)
                          ? appSettings.theme.style.colors.success
                          : appSettings.theme.style.colors.foreground
                      }
                      style={
                        {
                          // alignSelf: "center",
                        }
                      }
                    />
                  )}
                </View>
                <TextPrimary label={item.voters_count || "0"} />
              </View>

              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingLeft: 16,
                  flex: 8,
                }}
              >
                <TextPrimary
                  label={item.title}
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                />
                {item.description && (
                  <TextPrimary
                    label={item.description}
                    style={
                      {
                        // flex: 8,
                        // paddingLeft: 8,
                      }
                    }
                  />
                )}
              </View>
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingLeft: 16,
                  flex: 0,
                }}
              >
                {item.status && (
                  <View
                    style={{
                      borderColor: appSettings.theme.style.colors.success,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 16,
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                    }}
                  >
                    <TextPrimary label={item.status} />
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* <View
            style={{
              alignSelf: "center",
              height: 0.5,
              width: "90%",
              backgroundColor: appSettings.theme.style.colors.secondary,
            }}
          /> */}
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export default WishlistItem;
