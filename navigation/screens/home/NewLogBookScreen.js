import { Text, View } from "react-native";
import { globalStyles, globalTheme } from "../../../assets/globalStyles";

const NewLogBookScreen = () => {
    return (
        <>
            <View style={{ backgroundColor: '#fff', height:'100%', alignItems:'center',justifyContent: 'center' }}>
                <Text>Add new Log Book</Text>
            </View>
        </>
    )
}

export default NewLogBookScreen;