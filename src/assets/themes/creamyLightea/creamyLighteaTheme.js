import icon from "./creamyLighteaTheme.png";
const palette = {
  white: {
    600: "#f8edeb",
    500: "#f1dad7",
    400: "#e6bfb8",
    300: "#e2b5ae",
    200: "#dfaca4",
    100: "#dba39a",
  },
  black: {
    600: "#6b3026",
    500: "#7a453c",
    400: "#895951",
    300: "#976e67",
    200: "#a6837d",
    100: "#b59893",
  },
  red: "#CD0E61",
  purple: "#5A31F4",
  green: "#008888",
  orange: "#F49D1A",
  accentOne: "#6b3026",
  accentTwo: "#DBA39A",
  accentThree: "#F0DBDB",
  accentFour: "#F5EBE0",
  accentFive: "#FEFCF3",
};

export const creamyLighteaTheme = {
  identifier: {
    id: "creamyLighteaTheme",
    name: "Creamy Lightea",
    icon,
  },
  colors: {
    background: palette.white[600],
    foreground: palette.black[600],
    primary: palette.black[600],
    secondary: palette.white[400],
    header: palette.accentThree,
    textHeader: palette.black[600],
    listSection: palette.accentOne,
    incomeAmount: "#008888",
    incomeSymbol: "#00B19B",
    success: palette.green,
    warn: palette.orange,
    danger: palette.red,
  },
  headerButton: {
    backgroundColor: palette.accentTwo,
    color: palette.black[600],
  },
  bottomTab: {
    activeTintColor: palette.accentTwo,
    inactiveTintColor: palette.white[200],
    actionButton: {
      backgroundColor: palette.accentTwo,
      iconColor: palette.white[600],
    },
  },
  widgets: {
    totalExpense: {
      cardBackgroundColor: palette.accentTwo,
      cardTextColor: palette.accentOne,
      cardIconColor: palette.accentOne,
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
      color: palette.black[600],
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
        backgroundColor: palette.accentOne,
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
        borderColor: palette.accentOne,
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
      borderColor: palette.white[400],
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
