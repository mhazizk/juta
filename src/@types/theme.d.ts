/**
 * Global Theme Type to be used in appSettings
 *
 * @type {GlobalThemeType}
 *
 */
export type GlobalThemeType = {
  id: string;
  name: string;
  style: ThemeStyleType;
}
/**
 * Theme Style Type
 * @type {ThemeStyleType}
 * 
 */
export type ThemeStyleType = {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    header: string;
    textHeader: string;
    incomeAmount: string;
    incomeSymbol: string;
    success: string;
    warn: string;
    danger: string;
  };
  text: {
    textPrimary: TextType;
    textSecondary: TextType;
    textDisabled: TextType;
    textSuccess: TextType;
    textWarn: TextType;
    textDanger: TextType;
  };
  button: {
    buttonPrimary: ButtonType;
    buttonSecondary: ButtonType;
    buttonSuccess: ButtonType;
    buttonWarn: ButtonType;
    buttonDanger: ButtonType;
    buttonDisabled: ButtonType;
  };
  list: {
    listContainer: {
      display: "flex";
      flexDirection: "row";
      justifyContent: "flex-start";
      alignItems: "center";
      backgroundColor: "transparent";
      paddingHorizontal: 16;
      minHeight: 48;
    };
    listItem: {
      borderColor: string;
      display: "flex";
      flex: 1;
      alignItems: "center";
      flexDirection: "row";
      justifyContent: "space-between";
      paddingVertical: 0 | 4 | 8;
      borderBottomWidth: 0.5;
      minHeight: 46;
      textAlignVertical: "center";
    };
  };
};

type TextType = {
  color: string;
  fontSize: number;
};

type ButtonType = {
  buttonStyle: {
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
  };
  textStyle: {
    color: string;
    fontSize: number;
  };
};
