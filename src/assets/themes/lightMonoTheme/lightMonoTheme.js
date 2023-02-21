import icon from "./lightMonoTheme.png";
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
};

export const lightMonoTheme = {
  identifier: {
    id: "lightMonoTheme",
    name: "Light Mono",
    icon,
  },
  colors: {
    background: palette.white[600],
    foreground: palette.black[600],
    primary: palette.black[600],
    secondary: palette.white[400],
    header: palette.white[600],
    textHeader: palette.black[600],
    incomeAmount: "#008888",
    incomeSymbol: "#00B19B",
    success: palette.green,
    warn: palette.orange,
    danger: palette.red,
  },
  widgets: {
    totalExpense: {
      cardBackgroundColor: palette.black[600],
      cardTextColor: palette.white[600],
      cardIconColor: palette.black[600],
    },
    myLoans: {
      cardBackgroundColor: "#0899ba",
      cardTextColor: palette.white[600],
      cardIconColor: "#0f80aa",
    },
    myBudgets: {
      cardBackgroundColor: "#dbb42c",
      cardTextColor: palette.white[600],
      cardIconColor: "#edc531",
    },
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
  },
  button: {
    buttonPrimary: {
      buttonStyle: {
        backgroundColor: palette.black[600],
        borderRadius: 16,
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
        borderRadius: 16,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.black[600],
        fontSize: 16,
      },
    },
    buttonSecondaryDisabled: {
      buttonStyle: {
        backgroundColor: "transparent",
        borderColor: palette.white[200],
        borderRadius: 16,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.white[200],
        fontSize: 16,
      },
    },
    buttonDisabled: {
      buttonStyle: {
        backgroundColor: palette.white[200],
        borderRadius: 16,
      },
      textStyle: {
        color: palette.white[600],
        fontSize: 16,
      },
    },
    buttonSuccess: {
      buttonStyle: {
        backgroundColor: palette.green,
        borderRadius: 16,
      },
      textStyle: {
        color: palette.white[600],
        fontSize: 16,
      },
    },
    buttonWarn: {
      buttonStyle: {
        backgroundColor: palette.orange,
        borderRadius: 16,
      },
      textStyle: {
        color: palette.black[600],
        fontSize: 16,
      },
    },
    buttonDanger: {
      buttonStyle: {
        borderRadius: 16,
        backgroundColor: "transparent",
        borderColor: palette.red,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.white[600],
        fontSize: 16,
      },
    },
  },
  list: {
    incomeContainer: {
      backgroundColor: "#00B19B",
      color: "#c3f4f4",
    },
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
      borderColor: palette.black[400],
      display: "flex",
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      minHeight: 46,
      textAlignVertical: "center",
    },
  },
};
