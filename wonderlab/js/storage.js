/**
 * WonderLab - Storage & Privacy Manager
 * Handles localStorage with safe private browsing fallbacks.
 */

const StorageManager = (function () {
  const PREFIX = 'wonderlab_';
  let memoryStorage = {};

  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  const hasStorage = isLocalStorageAvailable();

  return {
    get: function (key, defaultValue = null) {
      try {
        if (hasStorage) {
          const item = window.localStorage.getItem(PREFIX + key);
          return item ? JSON.parse(item) : defaultValue;
        }
        return memoryStorage[PREFIX + key] !== undefined ? memoryStorage[PREFIX + key] : defaultValue;
      } catch (e) {
        console.warn('Storage read error:', e);
        return defaultValue;
      }
    },

    set: function (key, value) {
      try {
        if (hasStorage) {
          window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } else {
          memoryStorage[PREFIX + key] = value;
        }
        return true;
      } catch (e) {
        console.warn('Storage write error:', e);
        return false;
      }
    },

    remove: function (key) {
      try {
        if (hasStorage) {
          window.localStorage.removeItem(PREFIX + key);
        } else {
          delete memoryStorage[PREFIX + key];
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    clearAllUserData: function () {
      try {
        if (hasStorage) {
          const keysToRemove = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(PREFIX)) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => window.localStorage.removeItem(k));
        }
        memoryStorage = {};
        return true;
      } catch (e) {
        console.warn('Storage clear error:', e);
        return false;
      }
    },

    isAvailable: function () {
      return hasStorage;
    }
  };
})();

window.StorageManager = StorageManager;
