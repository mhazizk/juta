import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';


const AboutScreen = ({ item, navigation }) => {

    const checkmark = require('../../../assets/checkmark.png');

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                <UserHeaderComponent />
                <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>About Cash Log</Text>
                </View>

                {/* // ! Made by */}
                <TouchableNativeFeedback onPress={() => alert('Thank you for using Cash Log App.\nI hope this app helps you alot.\nHappy logging !')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='information-circle' size={20} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Made by</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>Haziz</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Contact */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        <IonIcons name='mail' size={18} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Contact Me</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Donate */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        <IonIcons name='pizza' size={18} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Buy Me a Pizza</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! App Version */}
                <TouchableNativeFeedback onPress={() => alert('Thank you for using Cash Log App.\nI hope this app helps you alot.\nHappy logging !')}>
                    <View style={styles.flatListView}>
                        <IonIcons name='phone-portrait' size={18} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>App Version</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>v.1.0.0</Text>

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


export default AboutScreen;