import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ListItem } from "../../../components/List";
import { TextPrimary } from "../../../components/Text";

const RecentTransactions = () => {
  return (
    <>
      <View
        style={{
          flex: 0,
          flexDirection: "column",
          paddingHorizontal: 16,
        }}
      >
        <TextPrimary
          label="Recent Transactions"
          style={{ fontSize: 18, fontWeight: "bold" }}
        />
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <>
              <TextPrimary label={item} />
            </>
          )}
        />
      </View>
    </>
  );
};

export default RecentTransactions;
