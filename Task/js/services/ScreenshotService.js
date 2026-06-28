// Screenshot Vault Service (Service Layer)
// Manages image assets compression, tags mapping, and base64 caches.
// Globally Scoped.

class ScreenshotService {
  constructor() {
    this.collection = 'screenshots';
  }

  getScreenshots() {
    return window.storageService.get(this.collection) || [];
  }

  // Handle uploaded file stream and compress before writing to LocalStorage
  async addScreenshot(title, fileObject, category = 'General', tags = []) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress utilizing standard Canvas contexts
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized low-quality JPEG format (highly compressed!)
          const base64Data = canvas.toDataURL('image/jpeg', 0.6);

          const newItem = {
            id: 'ss_' + Date.now(),
            title: title.trim() || fileObject.name,
            category,
            tags: tags.map(t => t.trim().toLowerCase()).filter(Boolean),
            src: base64Data,
            date: new Date().toISOString().split('T')[0]
          };

          const success = window.storageService.add(this.collection, newItem);
          if (success) {
            this.logGlobalActivity(`Uploaded screenshot "${newItem.title}" to vault`);
            resolve(newItem);
          } else {
            reject(new Error("Storage full: Could not save compressed image details."));
          }
        };
        img.onerror = () => reject(new Error("Failed to parse image headers."));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error("File reader read failure."));
      reader.readAsDataURL(fileObject);
    });
  }

  deleteScreenshot(id) {
    return window.storageService.delete(this.collection, id);
  }

  logGlobalActivity(text) {
    const activities = window.storageService.get('activities') || [];
    activities.unshift({
      timestamp: new Date().toISOString(),
      text
    });
    if (activities.length > 50) activities.pop();
    window.storageService.set('activities', activities);
  }
}

// Global Singleton instantiation
window.screenshotService = new ScreenshotService();
