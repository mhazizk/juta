import { Text, View, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons'


const UserHeaderComponent = ({ navigation }) => {
    const checkmark = require('../assets/checkmark.png');
    return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center', borderColor: '#000', height: 128, width: 128, borderRadius: 128 / 2, borderWidth: 3 }}>
                    {/* <Image source={checkmark} style={{ height: 128, width: 128 }} /> */}
                    <IonIcons name='person' size={64} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 32, marginRight: 8 }}>
                        Hi,
                    </Text>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', marginRight: 4 }}>
                        Haziz
                    </Text>
                    <Image source={checkmark} style={{ height: 22, width: 22 }} />
                </View>
            </View>
    )
}

const styles = new StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default UserHeaderComponent;