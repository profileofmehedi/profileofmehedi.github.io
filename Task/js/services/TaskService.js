// Task Service (Service Layer)
// Exposes robust CRUD methods for advanced Task objects.
// Globally Scoped.

class TaskService {
  constructor() {
    this.collection = 'tasks';
  }

  getTasks() {
    return window.storageService.get(this.collection) || [];
  }

  getTaskById(id) {
    return window.storageService.getById(this.collection, id);
  }

  addTask(task) {
    const defaultTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      category: 'work',
      tags: [],
      estimatedTime: '',
      dueDate: '',
      dueTime: '',
      progress: 0,
      checklist: [],
      subtasks: [],
      attachments: [],
      color: '#3b82f6',
      repeat: 'none',
      notes: '',
      history: [{ timestamp: new Date().toISOString(), text: "Task created." }]
    };

    const newTask = { ...defaultTask, ...task };
    window.storageService.add(this.collection, newTask);
    this.logGlobalActivity(`Created task "${newTask.title}"`);
    return newTask;
  }

  updateTask(id, fields) {
    const task = this.getTaskById(id);
    if (!task) return false;

    // Build edit logs for history tracker
    const historyLogs = [...(task.history || [])];
    const changedFields = [];
    
    Object.keys(fields).forEach(key => {
      if (JSON.stringify(task[key]) !== JSON.stringify(fields[key])) {
        changedFields.push(key);
      }
    });

    if (changedFields.length > 0) {
      historyLogs.unshift({
        timestamp: new Date().toISOString(),
        text: `Updated fields: ${changedFields.join(', ')}.`
      });
    }

    const updatedFields = { ...fields, history: historyLogs };
    const success = window.storageService.update(this.collection, id, updatedFields);
    
    if (success && fields.title && fields.title !== task.title) {
      this.logGlobalActivity(`Renamed task to "${fields.title}"`);
    } else if (success && fields.status && fields.status !== task.status) {
      this.logGlobalActivity(`Moved task "${task.title}" to status: ${fields.status}`);
    }

    return success;
  }

  deleteTask(id) {
    const task = this.getTaskById(id);
    const success = window.storageService.delete(this.collection, id);
    if (success && task) {
      this.logGlobalActivity(`Deleted task "${task.title}"`);
    }
    return success;
  }

  // Toggle single checklist checkmark
  toggleChecklistItem(taskId, itemId, checked) {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    const checklist = task.checklist.map(item => {
      if (item.id === itemId) return { ...item, checked };
      return item;
    });

    // Compute progress % based on checked list
    const checkedCount = checklist.filter(i => i.checked).length;
    const progress = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : task.progress;

    return this.updateTask(taskId, { checklist, progress });
  }

  // Toggle subtask status
  toggleSubtask(taskId, subtaskId, checked) {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    const subtasks = task.subtasks.map(sub => {
      if (sub.id === subtaskId) return { ...sub, checked };
      return sub;
    });

    return this.updateTask(taskId, { subtasks });
  }

  // Filter Tasks by dates and categories
  getFilteredTasks(filters = {}) {
    let list = this.getTasks();
    const today = new Date().toISOString().split('T')[0];

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Due Date filters
    if (filters.due) {
      if (filters.due === 'today') {
        list = list.filter(t => t.dueDate === today);
      } else if (filters.due === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomStr = tomorrow.toISOString().split('T')[0];
        list = list.filter(t => t.dueDate === tomStr);
      } else if (filters.due === 'upcoming') {
        list = list.filter(t => t.dueDate > today);
      } else if (filters.due === 'overdue') {
        list = list.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed');
      }
    }

    // Priority filter
    if (filters.priority) {
      list = list.filter(t => t.priority === filters.priority);
    }

    // Status filter
    if (filters.status) {
      list = list.filter(t => t.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      list = list.filter(t => t.category === filters.category);
    }

    // Sorting
    if (filters.sortBy) {
      list.sort((a, b) => {
        if (filters.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (filters.sortBy === 'priority') {
          const map = { high: 3, medium: 2, low: 1 };
          return (map[b.priority] || 0) - (map[a.priority] || 0);
        }
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    }

    return list;
  }

  // Audit activities logger
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
window.taskService = new TaskService();
