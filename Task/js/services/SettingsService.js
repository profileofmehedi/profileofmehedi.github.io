// Settings Service (Service Layer)
// Manages system settings configurations, user profile profiles, theme modifiers,
// data exports, and file import overrides.
// Globally Scoped.

class SettingsService {
  getSettings() {
    return window.storageService.get('settings') || window.demoData.settings;
  }

  updateSettings(fields) {
    const current = this.getSettings();
    const updated = { ...current, ...fields };
    window.storageService.set('settings', updated);
    this.applyTheme(updated.themeColor, updated.themeMode);
    return updated;
  }

  getProfile() {
    return window.storageService.get('profile') || window.demoData.profile;
  }

  updateProfile(fields) {
    const current = this.getProfile();
    const updated = { ...current, ...fields };
    window.storageService.set('profile', updated);
    return updated;
  }

  // Set visual DOM values matching color and dark modes
  applyTheme(color, mode) {
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('data-theme-color', color || 'blue');
    htmlEl.setAttribute('data-theme-mode', mode || 'dark');
  }

  // Export full database as stringified JSON format (No bookmarks, leetcode, aws study)
  exportBackup() {
    const collections = [
      'profile', 'settings', 'tasks', 'reminders', 'notes',
      'habits', 'expenses', 'journal', 'activities'
    ];
    
    const backup = {};
    collections.forEach(key => {
      backup[key] = window.storageService.get(key);
    });

    return JSON.stringify(backup, null, 2);
  }

  // Import full backup and write to LocalStorage
  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.profile || !data.settings) {
        throw new Error("Invalid backup format: Missing core configuration parameters.");
      }

      // Overwrite each collection
      Object.entries(data).forEach(([key, value]) => {
        window.storageService.set(key, value);
      });

      // Apply newly loaded themes
      const settings = data.settings;
      this.applyTheme(settings.themeColor, settings.themeMode);
      
      return { success: true };
    } catch (e) {
      console.error("SettingsService: Restore failed", e);
      return { success: false, message: e.message };
    }
  }

  // Clear customizations and reload demo state
  resetDemoData() {
    window.storageService.resetAll(window.demoData);
    const settings = window.demoData.settings;
    this.applyTheme(settings.themeColor, settings.themeMode);
    return true;
  }
}

// Global Singleton instantiation
window.settingsService = new SettingsService();
