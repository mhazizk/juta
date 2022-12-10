import { View, Text, StyleSheet, TouchableNativeFeedback, ScrollView } from "react-native";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { globalStyles, globalTheme } from "../assets/themes/globalStyles";

const TopExpenses = () => {
    return (
        <>
            <ScrollView>
                <TouchableNativeFeedback onPress={() => { }}>
                    <View style={styles.flatListView}>
                        <IonIcons name='car' size={18} color='black' />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Transport</Text>
                            <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>100.000.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => { }}>
                    <View style={styles.flatListView}>
                        <IonIcons name='pizza' size={18} color='black' />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Food</Text>
                            <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>900.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => { }}>
                    <View style={styles.flatListView}>
                        <IonIcons name='shirt' size={18} color='black' />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Cloth</Text>
                            <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>770.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => { }}>
                    <View style={styles.flatListView}>
                        <IonIcons name='laptop-outline' size={18} color='black' />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Laptop Accessories</Text>
                            <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>660.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => { }}>
                    <View style={styles.flatListView}>
                        <IonIcons name='play' size={18} color='black' />
                        <View style={styles.flatListViewUnderscore}>
                            <Text style={globalStyles.lightTheme.textPrimary}>Movies</Text>
                            <View style={{ ...styles.flatListViewText, flexDirection: 'row' }}>
                                <Text style={{ ...styles.flatListViewText, fontSize: 14, color: '#bbbbbb', marginRight: 4 }}>Rp</Text>
                                <Text style={{ ...styles.flatListViewText, fontSize: 18 }}>450.000</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </ScrollView>
        </>
    )
}

const styles = new StyleSheet.create({
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


export default TopExpenses;