import { Text, TouchableNativeFeedback, View, StyleSheet, Image } from "react-native"
import IonIcons from 'react-native-vector-icons/Ionicons';

const DashboardScreen = ({navigation}) => {

    const checkmark = require('../../../assets/checkmark.png');

    return (
        <>
            <View style={{ height: '100%', backgroundColor: '#fff' }}>
                {/* //! Header Section */}
                <View style={{ ...styles.container, flexDirection: 'column' }}>
                    <Text style={{ fontSize: 24 }}>
                        Good Morning,
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={{ fontSize: 36, fontWeight: 'bold' }}>
                            Haziz
                        </Text>
                        <Image source={checkmark} style={{ width: 22, height: 22, marginLeft: 4 }} />
                    </View>
                </View>

                {/* //! Summary Section */}
                <TouchableNativeFeedback onPress={() => navigation.navigate('Analytics Screen')}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', height: 300, justifyContent: 'center', backgroundColor: '#fff' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{ fontSize: 18, opacity: 0.3 }}>
                                Rp
                            </Text>
                            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
                                1.500.000
                            </Text>
                        </View>
                        <Text style={{ fontSize: 18, opacity: 0.3 }}>
                            Total Expense this week
                        </Text>
                        <IonIcons name='analytics' color='black' size={36} />
                    </View>
                </TouchableNativeFeedback>
            </View>
        </>
    )
}

const styles = new StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        height: '30%',
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },
    HeadContainer: {
        display: 'flex',
        flex: 1,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    scrollView: {
        backgroundColor: 'aqua'
    }
})


export default DashboardScreen;