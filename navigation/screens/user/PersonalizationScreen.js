import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';


const PersonalizationScreen = ({ item, navigation }) => {

    const checkmark = require('../../../assets/checkmark.png');

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                <UserHeaderComponent />
                <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Personalization</Text>
                </View>

                {/* // ! App Theme */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='contrast' size={18}/>
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>App Theme</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>Light Theme</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Font Size */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='text' size={18}/>
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Font Size</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>Medium</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Language */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        <IonIcons name='language' size={18} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Language</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>English</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

            </View>
        </>
    )
}

const styles = new StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatListView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        height: 48
    },
    flatListViewUnderscore: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        paddingVertical: 0,
        paddingLeft: 16,
        borderColor: '#d9d9d9',
        borderBottomWidth: 0.5,
        minHeight: 46,
        textAlignVertical: 'center'
    },
    flatListViewText: {
        display: 'flex',
        color: '#000',
        textAlignVertical: 'center',
        fontSize: 18,
        textAlignVertical: 'center'
    }

})


export default PersonalizationScreen;