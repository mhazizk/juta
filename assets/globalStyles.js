import { StyleSheet } from "react-native";

const globalStyles = {
    lightTheme:
        new StyleSheet.create({
            view: {
                backgroundColor: '#fff'
            },
            textPrimary: {
                fontSize: 16,
                color: '#000',
                textAlignVertical: 'center'
            },
            textSecondary: {
                fontSize: 16,
                color: '#bbb',
                textAlignVertical: 'center'
            },
            listContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 16,
                height: 48
            },
            listItem: {
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: '#fff',
                paddingVertical: 0,
                paddingLeft: 16,
                borderColor: '#ddd',
                borderBottomWidth: 0.5,
                minHeight: 46,
                textAlignVertical: 'center'
            }
        }),
    darkTheme:
        new StyleSheet.create({
            view: {
                backgroundColor: '#111'
            },
            textPrimary: {
                fontSize: 16,
                color: '#fff',
                textAlignVertical: 'center'
            },
            textSecondary: {
                fontSize: 16,
                color: '#666',
                textAlignVertical: 'center'
            },
            listContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#111',
                paddingHorizontal: 16,
                height: 48
            },
            listItem: {
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: '#111',
                paddingVertical: 0,
                paddingLeft: 16,
                borderColor: '#444',
                borderBottomWidth: 0.5,
                minHeight: 46,
                textAlignVertical: 'center'
            },

        })
}

export default globalStyles;