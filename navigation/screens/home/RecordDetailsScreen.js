import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyles from "../../../assets/globalStyles";

const RecordDetailsScreen = ({ route, navigation }) => {

    const [edit, setEdit] = useState(
        {
            mode: 'expense'

        }
    );

    const [record, setRecord] = useState({
        amount: 0,

    })

    useEffect(() => {
        setRecord({
            amount: route?.params.amount,
        })
    }, [])

    useEffect(() => {
        // refresh
        console.log(record)
    }, [record])

    return (
        <>
            <View style={{ ...globalStyles.lightTheme.view, height: '100%' }}>
                <View style={{ ...globalStyles.lightTheme.view, flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary, paddingRight: 8 }}>Rp</Text>
                    <TextInput
                        returnKeyType='done'
                        keyboardType='number-pad'
                        placeholder='0.000'
                        style={{ ...globalStyles.lightTheme.textPrimary, height: 36, fontSize: 36 }}
                        onChangeText={(searchText) => setRecord({ ...record, amount: searchText })}
                        clearButtonMode='while-editing'
                        defaultValue={route?.params?.amount}
                        value={record.amount}
                    />
                </View>
                <View style={{ ...globalStyles.lightTheme.view }}>
                    <Text style={{ ...globalStyles.lightTheme.textSecondary }}>Details</Text>
                </View>
                <Text>{route.params ? route.params.record_id : null}</Text>
                <Text>{route.params ? route.params.name : null}</Text>
                <Text>{route.params ? route.params.amount : null}</Text>

                <View style={globalStyles.lightTheme.view}></View>

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>


                    {/* // ! Cancel Button */}
                    <View style={{
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 1,
                        borderRadius: 8,
                        margin: 4
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Log Book Screen')}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonSecondary }}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* // ! Save Button */}
                    <View style={{
                        ...globalStyles.lightTheme.buttonPrimary,
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 0,
                        borderRadius: 8,
                        margin: 4,
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Log Book Screen')}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </>
    )
}

export default RecordDetailsScreen;