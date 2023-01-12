import { FlatList, ScrollView, View } from "react-native";
import { ListItem } from "../../../components/List";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import ListSection from "../../../components/List/ListSection";

const DevicesScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const renderIcon = (device_os_name) => {
    let name = "";
    switch (true) {
      case device_os_name.includes("iOS"):
        name = "logo-apple";
        break;
      case device_os_name.includes("Android"):
        name = "logo-android";
        break;
      default:
        break;
    }
    return name;
    // return (
    //   <IonIcons
    //     name={name}
    //     size={32}
    //     color={appSettings.theme.style.colors.foreground}
    //     style={{
    //       padding: 8,
    //     }}
    //   />
    // );
  };
  return (
    <>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <ListSection marginTop={16}>
          {userAccount.devicesLoggedIn.map((device) => (
            <>
              <ListItem
                pressable
                leftLabel={device.device_name}
                iconLeftName={renderIcon(device.device_os_name)}
                // iconLeftColor={appSettings.theme.style.colors.success}
                iconPack="IonIcons"
                rightLabel={new Date(device.last_login).toDateString()}
              />
            </>
          ))}
        </ListSection>
        {/* <FlatList
          data={userAccount.devicesLoggedIn}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between", padding: 16 }}
          keyExtractor={(item) => item.device_id}
          renderItem={({ item }) => (
            <>
              <ListItem leftLabel={item.device_name} />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderIcon(item.device_os_name)}
                <TextPrimary label={item.device_name} />
                <TextPrimary label={new Date(item.last_login).toDateString()} />
              </View>
            </>
          )}
        /> */}
      </ScrollView>
    </>
  );
};

export default DevicesScreen;
