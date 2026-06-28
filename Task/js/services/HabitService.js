// Habit Service (Service Layer)
// Handles Habit CRUD and checks streaks, logs, and compliance.
// Globally Scoped.

class HabitService {
  constructor() {
    this.collection = 'habits';
  }

  getHabits() {
    return window.storageService.get(this.collection) || [];
  }

  getHabitById(id) {
    return window.storageService.getById(this.collection, id);
  }

  addHabit(title, frequency = 'daily') {
    const newHabit = {
      id: 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: title.trim(),
      frequency,
      history: {},
      createdAt: new Date().toISOString().split('T')[0]
    };
    window.storageService.add(this.collection, newHabit);
    return newHabit;
  }

  updateHabit(id, fields) {
    return window.storageService.update(this.collection, id, fields);
  }

  deleteHabit(id) {
    return window.storageService.delete(this.collection, id);
  }

  // Check or uncheck a habit for a specific date
  toggleHabitDay(id, dateStr) {
    const habit = this.getHabitById(id);
    if (!habit) return false;

    const history = { ...habit.history };
    history[dateStr] = !history[dateStr];

    return this.updateHabit(id, { history });
  }

  // Calculate streaks: current streak and longest streak
  getHabitStreaks(habit) {
    const history = habit.history || {};
    const checkedDates = Object.keys(history)
      .filter(date => history[date] === true)
      .sort((a, b) => new Date(a) - new Date(b));

    if (checkedDates.length === 0) {
      return { current: 0, longest: 0, completionRate: 0 };
    }

    // 1. Calculate Longest Streak
    let longest = 0;
    let tempStreak = 0;
    let prevDate = null;

    checkedDates.forEach(dateStr => {
      const currentDate = new Date(dateStr);
      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          if (tempStreak > longest) longest = tempStreak;
          tempStreak = 1;
        }
      }
      prevDate = currentDate;
    });
    longest = Math.max(longest, tempStreak);

    // 2. Calculate Current Streak
    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Current streak is active if checked today OR checked yesterday
    let checkDate = null;
    if (history[todayStr] === true) {
      checkDate = today;
    } else if (history[yesterdayStr] === true) {
      checkDate = yesterday;
    }

    if (checkDate !== null) {
      current = 0;
      let dateCursor = new Date(checkDate);
      while (true) {
        const dateCursorStr = dateCursor.toISOString().split('T')[0];
        if (history[dateCursorStr] === true) {
          current++;
          dateCursor.setDate(dateCursor.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // 3. Completion rate over the last 30 days
    const totalDays = 30;
    let checkCount = 0;
    const cursor = new Date();
    for (let i = 0; i < totalDays; i++) {
      const dStr = cursor.toISOString().split('T')[0];
      if (history[dStr] === true) {
        checkCount++;
      }
      cursor.setDate(cursor.getDate() - 1);
    }
    const completionRate = Math.round((checkCount / totalDays) * 100);

    return { current, longest, completionRate };
  }
}

// Global Singleton instantiation
window.habitService = new HabitService();
