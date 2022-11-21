import { StyleSheet } from "react-native";

export const globalStyles = {
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
            },
            buttonPrimary: {
                backgroundColor: '#000',
                borderRadius:8
            },
            buttonSecondary :{
                borderRadius:8,
                borderWidth:1,
            },
            textButtonPrimary: {
                color: '#fff',
                fontSize: 16
            },
            textButtonSecondary: {
                color: '#000',
                fontSize: 16
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
            buttonPrimary: {
                backgroundColor: '#fff'
            },
            textButtonPrimary: {
                color: '#000',
                fontSize: 16
            },
            textButtonSecondary: {
                color: '#fff',
                fontSize: 16
            }


        })
}
export const globalTheme = {
    lightTheme:
        new StyleSheet.create({
            view: {
                backgroundColor: '#fff'
            },
            textPrimary: {
                color: '#000',
            },
            textSecondary: {
                color: '#bbb',
            },
            listContainer: {
                backgroundColor: '#fff',
            },
            listItem: {
                borderColor: '#ddd',
            },
            buttonPrimary: {
                backgroundColor: '#000',
            },
            buttonSecondary: {
                backgroundColor: '#fff',
                borderColor:'#000'
            },
            textButtonPrimary: {
                color: '#fff',
            },
            textButtonSecondary: {
                color: '#000',
            }
        }),
    darkTheme:
        new StyleSheet.create({
            view: {
                backgroundColor: '#111'
            },
            textPrimary: {
                color: '#fff',
            },
            textSecondary: {
                color: '#666',
            },
            listContainer: {
                backgroundColor: '#111',
            },
            listItem: {
                borderColor: '#444',
            },
            buttonPrimary: {
                backgroundColor: '#fff'
            },
            buttonSecondary: {
                backgroundColor: '#111',
            },
            textButtonPrimary: {
                color: '#000',
            },
            textButtonSecondary: {
                color: '#fff',
            }


        })
}


// export default globalStyles;