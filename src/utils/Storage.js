import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const STORAGE_ACTIONS = {
  SET: "SET",
  GET: "GET",
  DELETE: "DELETE",
};

// ! Async Secure Storage
const asyncSecureStorage = async ({ action, key, rawValue }) => {
  // Save Secure Data
  if (action === STORAGE_ACTIONS.SET) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(rawValue));
    } catch (error) {
      alert(error);
    }
  }

  // Get Secure Data
  if (action === STORAGE_ACTIONS.GET) {
    try {
      const get = await SecureStore.getItemAsync(key);
      if (get) {
        return JSON.parse(get);
      }
    } catch (error) {
      alert(error);
    }
  }

  // Delete Secure Data
  if (action === STORAGE_ACTIONS.DELETE) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      alert(error);
    }
  }
};

// ! Async Standard Storage
const asyncStorage = async ({ action, key, rawValue }) => {
  // Save Data
  if (action === STORAGE_ACTIONS.SET) {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify(rawValue),
        alert("item saved")
      );
    } catch (error) {
      alert(error);
    }
  }

  // Get Data
  if (action === STORAGE_ACTIONS.GET) {
    try {
      const get = await AsyncStorage.getItem(key);
      if (get) {
        return JSON.parse(get);
      }
    } catch (error) {
      alert(error);
    }
  }

  // Delete Data
  if (action === STORAGE_ACTIONS.DELETE) {
    try {
      await AsyncStorage.removeItem(key, alert("item deleted"));
    } catch (error) {
      alert(error);
    }
  }
};

export const storage = {
  asyncSecureStorage,
  asyncStorage,
};
