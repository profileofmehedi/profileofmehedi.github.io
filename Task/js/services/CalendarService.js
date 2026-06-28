// Calendar Service (Service Layer)
// Aggregates tasks, reminders, and journal reviews into a unified Event feed.
// Globally Scoped.

class CalendarService {
  
  // Aggregate all events across domain collections
  getCalendarEvents() {
    const events = [];

    // 1. Tasks Events
    const tasks = window.taskService.getTasks();
    tasks.forEach(task => {
      if (task.dueDate) {
        events.push({
          id: `task_${task.id}`,
          title: `📝 [Task] ${task.title}`,
          start: `${task.dueDate}${task.dueTime ? 'T' + task.dueTime : 'T00:00:00'}`,
          type: 'task',
          color: task.color || '#3b82f6',
          completed: task.status === 'completed',
          original: task
        });
      }
    });

    // 2. Reminders Events
    const reminders = window.reminderService.getReminders();
    reminders.forEach(rem => {
      if (rem.dateTime && !rem.completed) {
        events.push({
          id: `rem_${rem.id}`,
          title: `🔔 [Alert] ${rem.title}`,
          start: rem.dateTime,
          type: 'reminder',
          color: '#f59e0b',
          completed: rem.completed,
          original: rem
        });
      }
    });

    // 3. Journal Reflection Logs
    const journals = window.storageService.get('journal') || [];
    journals.forEach(jou => {
      if (jou.date) {
        const moodEmojis = { happy: '😊', productive: '💪', tired: '🥱', stressed: '😰', neutral: '😐' };
        const emoji = moodEmojis[jou.mood] || '📝';
        events.push({
          id: `journal_${jou.id}`,
          title: `${emoji} [Journal] Mood: ${jou.mood}`,
          start: `${jou.date}T20:00:00`,
          type: 'journal',
          color: '#10b981',
          completed: true,
          original: jou
        });
      }
    });

    return events;
  }

  // Group events by YYYY-MM-DD for month grid loaders
  getEventsGroupedByDate() {
    const list = this.getCalendarEvents();
    const grouped = {};

    list.forEach(event => {
      const dateStr = event.start.split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(event);
    });

    return grouped;
  }
}

// Global Singleton instantiation
window.calendarService = new CalendarService();
