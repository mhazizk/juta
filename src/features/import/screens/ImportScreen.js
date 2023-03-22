import { View, Text } from "react-native";
import React from "react";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { TextPrimary } from "../../../components/Text";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import Papa from "papaparse";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

const ImportScreen = ({ route, navigation }) => {
  const { globalTheme } = useGlobalTheme();
  return (
    <CustomScrollView>
      <TextPrimary />
    </CustomScrollView>
  );
};

export default ImportScreen;
