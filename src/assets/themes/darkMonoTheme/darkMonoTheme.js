import icon from "./darkMonoTheme.png";
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

export const darkMonoTheme = {
  identifier: {
    id: "darkMonoTheme",
    name: "Dark Mono",
    icon,
  },
  colors: {
    background: palette.black[600],
    foreground: palette.white[600],
    primary: palette.white[600],
    secondary: palette.black[400],
    header: palette.black[600],
    textHeader: palette.white[600],
    listSection: palette.white[600],
    incomeAmount: "#00B19B",
    incomeSymbol: "#008888",
    success: palette.green,
    warn: palette.orange,
    danger: palette.red,
  },
  headerButton: {
    backgroundColor: palette.white[600],
    color: palette.black[600],
  },
  bottomTab: {
    activeTintColor: palette.white[600],
    inactiveTintColor: palette.black[200],
    actionButton: {
      backgroundColor: palette.white[600],
      iconColor: palette.black[600],
    },
  },
  widgets: {
    totalExpense: {
      cardBackgroundColor: palette.white[600],
      cardTextColor: palette.black[600],
      cardIconColor: palette.black[600],
    },
    myLoans: {
      cardBackgroundColor: "#0899ba",
      cardTextColor: palette.white[600],
      cardIconColor: "#0f80aa",
    },
    myBudgets: {
      cardBackgroundColor: "#c9a227",
      cardTextColor: palette.white[600],
      cardIconColor: "#dbb42c",
    },
  },
  text: {
    textPrimary: {
      fontSize: 16,
      color: palette.white[500],
    },
    textSecondary: {
      fontSize: 16,
      color: palette.black[200],
    },
    textDisabled: {
      fontSize: 16,
      color: palette.black[200],
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
        backgroundColor: palette.white[600],
        borderRadius: 16,
      },
      textStyle: {
        color: palette.black[600],
        fontSize: 16,
      },
    },
    buttonSecondary: {
      buttonStyle: {
        backgroundColor: "transparent",
        borderColor: palette.white[600],
        borderRadius: 16,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.white[600],
        fontSize: 16,
      },
    },
    buttonSecondaryDisabled: {
      buttonStyle: {
        backgroundColor: "transparent",
        borderColor: palette.black[300],
        borderRadius: 16,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.black[300],
        fontSize: 16,
      },
    },
    buttonDisabled: {
      buttonStyle: {
        backgroundColor: palette.black[300],
        borderRadius: 16,
      },
      textStyle: {
        color: palette.black[100],
        fontSize: 16,
      },
    },
    buttonSuccess: {
      buttonStyle: {
        backgroundColor: palette.green,
        borderColor: palette.white[600],
        borderRadius: 16,
        borderWidth: 1,
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
        color: palette.white[600],
        fontSize: 16,
      },
    },
    buttonDanger: {
      buttonStyle: {
        backgroundColor: "transparent",
        borderColor: palette.red,
        borderRadius: 16,
        borderWidth: 1,
      },
      textStyle: {
        color: palette.red,
        fontSize: 16,
      },
    },
  },
  list: {
    incomeContainer: {
      color: "#00695c",
      backgroundColor: "#c3f4f4",
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
