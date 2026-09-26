/**
 * Safe AsyncStorage Wrapper
 * Wraps @react-native-async-storage/async-storage with an in-memory dictionary fallback.
 * Prevents "Native module is null" runtime crashes on any mobile device or simulator.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryFallback = new Map();

export const safeStorage = {
  async getItem(key) {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) return value;
      }
    } catch (e) {
      console.warn(`[safeStorage] AsyncStorage.getItem failed for "${key}", using memory fallback:`, e.message);
    }
    return memoryFallback.get(key) || null;
  },

  async setItem(key, value) {
    memoryFallback.set(key, value);
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[safeStorage] AsyncStorage.setItem failed for "${key}", using memory fallback:`, e.message);
    }
  },

  async removeItem(key) {
    memoryFallback.delete(key);
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] AsyncStorage.removeItem failed for "${key}":`, e.message);
    }
  },
};

export default safeStorage;
