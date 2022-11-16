import { useState } from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, Dimensions } from "react-native";


const LogBookScrollView = () => {
    const [logBooks, setLogBooks] = useState();
    // const screenWidth = Dimensions.get('window').width;
    return (
        <View>
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ height:33 ,display: 'flex', flexDirection: 'row' }}>
                {/* <FlatList
                    data={{ logBooks }}
                    keyExtractor={(item, index) => item.logbook_id}
                    renderItem={(lists) => logBooks(lists)}
                /> */}
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                <Text>Log Books 1</Text>
                {/* <View> */}
                {/* </View> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    ScrollContainer: {
    }
})


export default LogBookScrollView;