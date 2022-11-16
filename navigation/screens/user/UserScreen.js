import { StyleSheet, Text, View } from "react-native"
import UserHeaderComponent from "../../../components/UserHeader"

const UserScreen = ({ navigation }) => {
    console.log('user')
    return (
        <>
        <UserHeaderComponent />
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
    }
})

export default UserScreen;