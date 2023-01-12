const palette = {
  white: {
    600: "#F5F5F5",
    500: "#E5E5E5",
    400: "#D5D5D5",
    300: "#C5C5C5",
    200: "#B5B5B5",
    100: "#A5A5A5",
  },
  black: {
    600: "#151515",
    500: "#252525",
    400: "#353535",
    300: "#454545",
    200: "#555555",
    100: "#656565",
  },
  red: "#CD0E61",
  purple: "#5A31F4",
  green: "#0ECD9D",
  orange: "#F49D1A",
  primary: "#BC2649",
};

export const colorOfTheYear2023 = {
  colors: {
    background: palette.white[600],
    foreground: palette.black[600],
    primary: palette.primary,
    secondary: palette.white[400],
    header: palette.primary,
    cardBackground: '#eabdc8',
    textHeader: palette.white[600],
    success: palette.green,
    warn: palette.orange,
    danger: palette.red,
    failure: palette.red,
  },
  text: {
    textPrimary: {
      fontSize: 16,
      color: palette.black[500],
    },
    textSecondary: {
      fontSize: 16,
      color: palette.white[200],
    },
    textDisabled: {
      fontSize: 16,
      color: palette.white[200],
    },
    textSuccess: {
      fontSize: 16,
      color: palette.green,
    },
    textWarn: {
      fontSize: 16,
      color: palette.orange,
    },
    textDanger: {
      fontSize: 16,
      color: palette.red,
    },
    textFailure: {
      fontSize: 16,
      color: palette.red,
    },
  },
  button: {
    buttonPrimary: {
      buttonStyle: {
        backgroundColor: palette.black[600],
        borderRadius: 8,
      },
      textStyle: {
        color: palette.white[600],
        fontSize: 16,
      },
    },
    buttonSecondary: {
      buttonStyle: {
        backgroundColor: "transparent",
        borderColor: palette.black[600],
        borderRadius: 8,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.black[600],
        fontSize: 16,
      },
    },
    buttonDisabled: {
      backgroundColor: palette.white[200],
      borderRadius: 8,
    },
    buttonSuccess: {
      backgroundColor: palette.green,
      borderRadius: 8,
    },
    buttonWarn: {
      backgroundColor: palette.orange,
      borderRadius: 8,
    },
    buttonDanger: {
      backgroundColor: "transparent",
      borderColor: palette.red,
      borderRadius: 8,
      borderWidth: 1,
    },
    buttonFailure: {
      backgroundColor: palette.red,
      borderRadius: 8,
    },
  },
  list: {
    listContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "transparent",
      paddingHorizontal: 16,
      minHeight: 48,
    },
    listItem: {
      borderColor: palette.white[400],
      display: "flex",
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 0,
      borderBottomWidth: 0.5,
      minHeight: 46,
      textAlignVertical: "center",
    },
  },
};