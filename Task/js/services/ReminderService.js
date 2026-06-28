// Reminder Service (Service Layer)
// Manages reminder dates, recurring schedules, and polling cycles.
// Globally Scoped.

class ReminderService {
  constructor() {
    this.collection = 'reminders';
  }

  getReminders() {
    return window.storageService.get(this.collection) || [];
  }

  getReminderById(id) {
    return window.storageService.getById(this.collection, id);
  }

  addReminder(reminder) {
    const defaultRem = {
      id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: '',
      dateTime: '',
      type: 'one-time',
      repeat: 'none',
      category: 'health',
      completed: false
    };

    const newRem = { ...defaultRem, ...reminder };
    window.storageService.add(this.collection, newRem);
    return newRem;
  }

  updateReminder(id, fields) {
    return window.storageService.update(this.collection, id, fields);
  }

  deleteReminder(id) {
    return window.storageService.delete(this.collection, id);
  }

  // Periodic polling checker called from app coordinator loop (every few seconds)
  checkPendingReminders() {
    const now = new Date();
    const reminders = this.getReminders();
    let updated = false;

    const modifiedList = reminders.map(rem => {
      if (rem.completed) return rem;

      const remTime = new Date(rem.dateTime);
      if (remTime <= now) {
        // Trigger!
        window.notificationService.triggerNotification(`Reminder: ${rem.title}`, `Scheduled for ${remTime.toLocaleTimeString()}`);
        updated = true;

        if (rem.type === 'one-time' || rem.repeat === 'none') {
          return { ...rem, completed: true };
        } else {
          // Calculate next recurrence date
          const nextTime = new Date(remTime);
          if (rem.repeat === 'daily') {
            nextTime.setDate(nextTime.getDate() + 1);
          } else if (rem.repeat === 'weekly') {
            nextTime.setDate(nextTime.getDate() + 7);
          } else if (rem.repeat === 'monthly') {
            nextTime.setMonth(nextTime.getMonth() + 1);
          }
          return { ...rem, dateTime: nextTime.toISOString().slice(0, 16) };
        }
      }
      return rem;
    });

    if (updated) {
      window.storageService.set(this.collection, modifiedList);
      window.dispatchEvent(new CustomEvent('lifeos-reminders-updated'));
    }
  }
}

// Global Singleton instantiation
window.reminderService = new ReminderService();
