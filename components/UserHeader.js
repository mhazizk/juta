import { Text, View, StyleSheet, Image } from 'react-native';

const UserHeaderComponent = ({ navigation }) => {
    const checkmark = require('../assets/checkmark.png');
    return (
        <View style={styles.container}>
            <Image source={checkmark} style={{ height: 128, width: 128 }} />
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
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default UserHeaderComponent;