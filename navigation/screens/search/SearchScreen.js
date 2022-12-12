import { StyleSheet, Text, TouchableNativeFeedback, View, Image, TextInput, TouchableOpacity } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader"
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import SearchResultTab from "../../../components/SearchResultTab";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";

const SearchScreen = ({ navigation }) => {

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // refresh
        console.log(searchQuery)
    }, [searchQuery]);

    const checkmark = require('../../../assets/img/checkmark.png')
    return (
        <>
            {/* <View style={{backgroundColor: '#fff', alignItems: 'flex-start' }}> */}

            {/* Search Bar */}
            <View style={{ display: 'flex', backgroundColor: '#fff', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingLeft: 16, paddingRight:8 }}>
                <View
                    style={{ flex:1, overflow:'hidden',flexDirection: 'row', borderColor: '#000', justifyContent:'space-between',marginRight:8,borderRadius: 8, borderWidth: 1.3 }}>
                    <TextInput
                        returnKeyType='search'
                        placeholder='I am looking for ...'
                        style={{ flex:1,paddingLeft: 8, height: 36, fontSize: 16 }}
                        onChangeText={(searchText) => setSearchQuery({ searchText })}
                        clearButtonMode='while-editing'
                        value={searchQuery}
                    />
                    <TouchableOpacity
                        onPress={() => { setSearchQuery('') }}>
                        <View style={{ flex:1,display: `${searchQuery ? 'flex' : 'none'}`, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                            <IonIcons name='close-outline' size={24} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => { alert(`Feature on progress ...\n${searchQuery?.searchText}`) }}>
                    <View style={{ flex:1,display: 'flex', height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcons name='search-outline' size={24} />
                    </View>
                </TouchableOpacity>
            </View>
            <SearchResultTab />

            {/* </View> */}
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
        justifyContent: 'flex-start',
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

export default SearchScreen;