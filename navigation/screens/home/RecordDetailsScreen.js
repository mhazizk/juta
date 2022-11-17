import { Text } from "react-native";

const RecordDetailsScreen = ({ route, navigation }) => {
    return (
        <>
            <Text>{route.params ? route.params.record_id : null}</Text>
            <Text>{route.params ? route.params.name : null}</Text>
            <Text>{route.params ? route.params.amount : null}</Text>
        </>
    )
}

export default RecordDetailsScreen;