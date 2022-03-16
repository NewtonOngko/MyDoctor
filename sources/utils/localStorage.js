import AsyncStorage from '@react-native-async-storage/async-storage';

const getStorageItem = async (varItem) => {
  try {
    const value = await AsyncStorage.getItem(varItem);
    if (value !== null) {
      return JSON.parse(value);
    }
    return value;
  } catch (e) {
    console.log(e);
  }
};
const setStorageItem = async (varItem, value) => {
  try {
    await AsyncStorage.setItem(varItem, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

const removeStorageItem = async () => {
  AsyncStorage.getAllKeys().then((keys) => {
    AsyncStorage.multiRemove(keys);
  });
};

export {getStorageItem, setStorageItem, removeStorageItem};
