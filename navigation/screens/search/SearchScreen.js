import { Text, TouchableOpacity, View } from "react-native"

const SearchScreen = ({ navigation }) => {
    return (
        <TouchableOpacity onPress={() => navigation.push('Record Details Screen')}>
            <View>
                <Text>
                    Search Screen
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchScreen;