import {
  Image, StyleSheet, Text,
  TouchableNativeFeedback, View
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  globalStyles,
  globalTheme
} from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";

const DataSettingsScreen = ({ item, navigation }) => {
  return (
    <>
      <View style={{ height: "100%", backgroundColor: "#fff" }}>
        <UserHeaderComponent />
        <View style={{ backgroundColor: "#fff", padding: 16 }}>
          <Text style={{ fontSize: 32, color: "#bbb" }}>Data</Text>
        </View>

        {/* // TAG : Sync */}
        <ListItem
          onPress={() => alert("Feature in progress ...")}
          iconPack="IonIcons"
          iconLeftName="sync"
          leftLabel="Sync Data"
          rightLabel="Last sync : 17 Nov 2022"
        />

        {/* // TAG : Export */}
        <ListItem
          onPress={() => alert("Feature in progress ...")}
          iconPack="IonIcons"
          iconLeftName="download-outline"
          leftLabel="Export Data"
          rightLabel="Export all log books and records"
        />
      </View>
    </>
  );
};

const styles = new StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 48,
  },
  flatListViewUnderscore: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: 'green',
    paddingVertical: 0,
    paddingLeft: 16,
    borderColor: "#d9d9d9",
    borderBottomWidth: 0.5,
    minHeight: 46,
    textAlignVertical: "center",
  },
  flatListViewText: {
    display: "flex",
    color: "#000",
    textAlignVertical: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
});

export default DataSettingsScreen;
