import { View, Text, TouchableNativeFeedback, StyleSheet, Image } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader";
import IonIcons from 'react-native-vector-icons/Ionicons';


const DataScreen = ({ item, navigation }) => {

    const checkmark = require('../../../assets/checkmark.png');

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                <UserHeaderComponent />
                <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Data</Text>
                </View>

                {/* // ! Sync */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        {/* <Image source={checkmark} style={{ width: 18, height: 18 }} /> */}
                        <IonIcons name='sync' size={18}/>
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Sync Data</Text>
                            <Text style={{ ...styles.flatListViewText, color: '#bbb' }}>Last sync : 17 Nov 2022</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {/* // ! Export */}
                <TouchableNativeFeedback onPress={() => alert('Feature in progress ...')}>
                    <View style={styles.flatListView}>
                        <IonIcons name='download-outline' size={18} />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={styles.flatListViewText}>Export All Log Books and Records</Text>
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


export default DataScreen;