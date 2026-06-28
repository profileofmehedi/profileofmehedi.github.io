// Storage Service (Storage Provider Layer)
// Exposes standard CRUD operations, abstracting LocalStorage.
// Fallback in-memory storage is used if localStorage is blocked (e.g. on file:// protocol).
// Globally Scoped.

class StorageService {
  constructor(storagePrefix = 'lifeos_') {
    this.prefix = storagePrefix;
    this.isSupported = this.checkSupport();
    this.memoryStorage = {};
  }

  // Check if localStorage is supported and accessible in current context
  checkSupport() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn("StorageService: LocalStorage is disabled or blocked. Defaulting to in-memory fallback.");
      return false;
    }
  }

  // Load a full collection
  get(collectionName) {
    const key = this.prefix + collectionName;
    if (!this.isSupported) {
      return this.memoryStorage[key] ? JSON.parse(JSON.stringify(this.memoryStorage[key])) : null;
    }
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`StorageService: Failed to retrieve collection '${collectionName}'`, e);
      return null;
    }
  }

  // Save a full collection
  set(collectionName, data) {
    const key = this.prefix + collectionName;
    if (!this.isSupported) {
      this.memoryStorage[key] = JSON.parse(JSON.stringify(data));
      return true;
    }
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`StorageService: Failed to save collection '${collectionName}'`, e);
      return false;
    }
  }

  // Get single record by ID
  getById(collectionName, id) {
    const items = this.get(collectionName);
    if (!items || !Array.isArray(items)) return null;
    return items.find(item => item.id === id) || null;
  }

  // Add item to a collection
  add(collectionName, item) {
    const items = this.get(collectionName) || [];
    if (!Array.isArray(items)) {
      console.error(`StorageService: Collection '${collectionName}' is not an array`);
      return false;
    }
    items.push(item);
    return this.set(collectionName, items);
  }

  // Update item in a collection
  update(collectionName, id, updatedFields) {
    const items = this.get(collectionName);
    if (!items || !Array.isArray(items)) return false;

    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;

    items[index] = { ...items[index], ...updatedFields };
    return this.set(collectionName, items);
  }

  // Delete item from a collection
  delete(collectionName, id) {
    const items = this.get(collectionName);
    if (!items || !Array.isArray(items)) return false;

    const filtered = items.filter(item => item.id !== id);
    return this.set(collectionName, filtered);
  }

  // Seed default data if storage is empty
  initialize(defaultSchema) {
    Object.entries(defaultSchema).forEach(([collectionName, defaultValue]) => {
      const key = this.prefix + collectionName;
      if (this.isSupported) {
        try {
          if (!localStorage.getItem(key)) {
            this.set(collectionName, defaultValue);
          }
        } catch (e) {
          this.set(collectionName, defaultValue);
        }
      } else {
        if (!this.memoryStorage[key]) {
          this.set(collectionName, defaultValue);
        }
      }
    });
  }

  // Clear specific collection
  clear(collectionName) {
    const key = this.prefix + collectionName;
    if (!this.isSupported) {
      delete this.memoryStorage[key];
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  // Reset entire application storage
  resetAll(defaultSchema) {
    if (!this.isSupported) {
      this.memoryStorage = {};
      if (defaultSchema) {
        this.initialize(defaultSchema);
      }
      return;
    }
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      if (defaultSchema) {
        this.initialize(defaultSchema);
      }
    } catch (e) {}
  }
}

// Global Singleton instantiation
window.storageService = new StorageService();
