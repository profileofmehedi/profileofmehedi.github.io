// Journal Service (Service Layer)
// Manages daily reflections, mood tracking indexes, achievements, and plans.
// Globally Scoped.

class JournalService {
  constructor() {
    this.collection = 'journal';
  }

  getEntries() {
    return window.storageService.get(this.collection) || [];
  }

  getEntryById(id) {
    return window.storageService.getById(this.collection, id);
  }

  getEntryByDate(dateStr) {
    const list = this.getEntries();
    return list.find(j => j.date === dateStr) || null;
  }

  addEntry(mood, reflection, achievements = [], tomorrowPlan = '') {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if entry for today already exists to prevent duplicate entries
    const existing = this.getEntryByDate(todayStr);
    if (existing) {
      return this.updateEntry(existing.id, { mood, reflection, achievements, tomorrowPlan });
    }

    const newEntry = {
      id: 'journal_' + Date.now(),
      date: todayStr,
      mood,
      reflection: reflection.trim(),
      achievements: Array.isArray(achievements) ? achievements : [],
      tomorrowPlan: tomorrowPlan.trim()
    };

    window.storageService.add(this.collection, newEntry);
    this.logGlobalActivity(`Log daily reflection - Mood: ${mood}`);
    return newEntry;
  }

  updateEntry(id, fields) {
    return window.storageService.update(this.collection, id, fields);
  }

  deleteEntry(id) {
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
window.journalService = new JournalService();
