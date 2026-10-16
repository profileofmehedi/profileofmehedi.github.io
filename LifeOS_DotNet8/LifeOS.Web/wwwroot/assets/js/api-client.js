/**
 * LifeOS — ASP.NET Core 8 Web API Client
 * Seamlessly connects LifeOS frontend with SQL Server backend.
 */
const LifeApiClient = (function() {
  const API_BASE = '/api';

  async function fetchJson(endpoint, options = {}) {
    try {
      const res = await fetch(API_BASE + endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        },
        ...options
      });
      if (!res.ok) {
        console.warn(`API call failed [${options.method || 'GET'} ${endpoint}]:`, res.status);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error(`Network error calling ${endpoint}:`, err);
      return null;
    }
  }

  // Load all live data from SQL Server into LifeStorage
  async function syncFromDatabase() {
    try {
      const [
        dashSummary,
        accountsData,
        transactions,
        budgets,
        savings,
        tasks,
        habits,
        routines,
        calendar,
        trips,
        claims,
        lifeGoals,
        journal,
        settings,
        notifications
      ] = await Promise.all([
        fetchJson('/dashboard/summary'),
        fetchJson('/accounts'),
        fetchJson('/transactions'),
        fetchJson('/budgets'),
        fetchJson('/savings'),
        fetchJson('/tasks'),
        fetchJson('/habits'),
        fetchJson('/routines'),
        fetchJson('/calendar'),
        fetchJson('/conveyance/trips'),
        fetchJson('/conveyance/claims'),
        fetchJson('/lifegoals'),
        fetchJson('/journal'),
        fetchJson('/settings'),
        fetchJson('/notifications')
      ]);

      if (dashSummary && dashSummary.user) {
        LifeStorage.set('user', dashSummary.user, true);
      }
      if (settings) {
        LifeStorage.set('settings', settings, true);
      }
      if (accountsData) {
        if (accountsData.accounts) LifeStorage.set('accounts', accountsData.accounts, true);
        if (accountsData.cards) LifeStorage.set('cards', accountsData.cards, true);
      }
      if (transactions) LifeStorage.set('transactions', transactions, true);
      if (budgets) LifeStorage.set('budgets', budgets, true);
      if (savings) LifeStorage.set('savingsGoals', savings, true);
      if (tasks) LifeStorage.set('tasks', tasks, true);
      if (habits) LifeStorage.set('habits', habits, true);
      if (routines) LifeStorage.set('routines', routines, true);
      if (calendar) LifeStorage.set('calendarEvents', calendar, true);
      if (trips) LifeStorage.set('conveyanceTrips', trips, true);
      if (claims) LifeStorage.set('conveyanceClaims', claims, true);
      if (lifeGoals) LifeStorage.set('lifeGoals', lifeGoals, true);
      if (journal) LifeStorage.set('journalEntries', journal, true);
      if (notifications) LifeStorage.set('notifications', notifications, true);

      console.log('LifeOS: Synchronized successfully with SQL Server backend.');
      LifeStorage.emit('db_synced', { timestamp: new Date() });
      return true;
    } catch (e) {
      console.warn('LifeOS: Error synchronizing with SQL Server:', e);
      return false;
    }
  }

  return {
    syncFromDatabase,
    fetchJson,

    // Accounts & Cards
    createAccount: (acc) => fetchJson('/accounts', { method: 'POST', body: JSON.stringify(acc) }),
    updateAccount: (id, acc) => fetchJson(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(acc) }),
    deleteAccount: (id) => fetchJson(`/accounts/${id}`, { method: 'DELETE' }),
    payDpsInstallment: (id, data) => fetchJson(`/accounts/${id}/pay-dps`, { method: 'POST', body: JSON.stringify(data) }),
    payLoanEmi: (id, data) => fetchJson(`/accounts/${id}/pay-loan`, { method: 'POST', body: JSON.stringify(data) }),

    createCard: (card) => fetchJson('/accounts/cards', { method: 'POST', body: JSON.stringify(card) }),
    updateCard: (id, card) => fetchJson(`/accounts/cards/${id}`, { method: 'PUT', body: JSON.stringify(card) }),
    deleteCard: (id) => fetchJson(`/accounts/cards/${id}`, { method: 'DELETE' }),
    payCardBill: (id, data) => fetchJson(`/accounts/cards/${id}/pay-bill`, { method: 'POST', body: JSON.stringify(data) }),

    // Transactions
    createTransaction: (tx) => fetchJson('/transactions', { method: 'POST', body: JSON.stringify(tx) }),
    deleteTransaction: (id) => fetchJson(`/transactions/${id}`, { method: 'DELETE' }),

    // Tasks
    createTask: (task) => fetchJson('/tasks', { method: 'POST', body: JSON.stringify(task) }),
    toggleTask: (id) => fetchJson(`/tasks/${id}/toggle`, { method: 'POST' }),
    deleteTask: (id) => fetchJson(`/tasks/${id}`, { method: 'DELETE' }),

    // Habits
    createHabit: (habit) => fetchJson('/habits', { method: 'POST', body: JSON.stringify(habit) }),
    toggleHabit: (id, date) => fetchJson(`/habits/${id}/toggle`, { method: 'POST', body: JSON.stringify({ date }) }),
    deleteHabit: (id) => fetchJson(`/habits/${id}`, { method: 'DELETE' }),

    // Routines
    createRoutine: (routine) => fetchJson('/routines', { method: 'POST', body: JSON.stringify(routine) }),
    toggleRoutineStep: (id, stepId) => fetchJson(`/routines/${id}/toggle-step`, { method: 'POST', body: JSON.stringify({ stepId }) }),
    resetRoutine: (id) => fetchJson(`/routines/${id}/reset`, { method: 'POST' }),
    deleteRoutine: (id) => fetchJson(`/routines/${id}`, { method: 'DELETE' }),

    // Budgets
    createBudget: (budget) => fetchJson('/budgets', { method: 'POST', body: JSON.stringify(budget) }),
    updateBudget: (id, budget) => fetchJson(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(budget) }),
    deleteBudget: (id) => fetchJson(`/budgets/${id}`, { method: 'DELETE' }),

    // Savings Goals
    createSavingsGoal: (goal) => fetchJson('/savings', { method: 'POST', body: JSON.stringify(goal) }),
    addSavingsDeposit: (id, amount) => fetchJson(`/savings/${id}/deposit`, { method: 'POST', body: JSON.stringify({ amount }) }),
    deleteSavingsGoal: (id) => fetchJson(`/savings/${id}`, { method: 'DELETE' }),

    // Conveyance
    createTrip: (trip) => fetchJson('/conveyance/trips', { method: 'POST', body: JSON.stringify(trip) }),
    deleteTrip: (id) => fetchJson(`/conveyance/trips/${id}`, { method: 'DELETE' }),
    createClaim: (claim, tripIds) => fetchJson('/conveyance/claims', { method: 'POST', body: JSON.stringify({ claim, tripIds }) }),
    settleClaim: (id, data) => fetchJson(`/conveyance/claims/${id}/settle`, { method: 'POST', body: JSON.stringify(data) }),
    deleteClaim: (id) => fetchJson(`/conveyance/claims/${id}`, { method: 'DELETE' }),

    // Calendar
    createEvent: (evt) => fetchJson('/calendar', { method: 'POST', body: JSON.stringify(evt) }),
    deleteEvent: (id) => fetchJson(`/calendar/${id}`, { method: 'DELETE' }),

    // Journal
    createJournal: (entry) => fetchJson('/journal', { method: 'POST', body: JSON.stringify(entry) }),
    deleteJournal: (id) => fetchJson(`/journal/${id}`, { method: 'DELETE' }),

    // Life Goals
    createLifeGoal: (goal) => fetchJson('/lifegoals', { method: 'POST', body: JSON.stringify(goal) }),
    updateLifeGoal: (id, goal) => fetchJson(`/lifegoals/${id}`, { method: 'PUT', body: JSON.stringify(goal) }),
    deleteLifeGoal: (id) => fetchJson(`/lifegoals/${id}`, { method: 'DELETE' }),

    // Settings & Profile
    updateSettings: (settings) => fetchJson('/settings', { method: 'POST', body: JSON.stringify(settings) }),
    updateProfile: (profile) => fetchJson('/settings/profile', { method: 'POST', body: JSON.stringify(profile) }),
    resetDemoData: () => fetchJson('/settings/reset-demo', { method: 'POST' }),

    // Notifications
    markNotificationRead: (id) => fetchJson(`/notifications/${id}/read`, { method: 'POST' }),
    markAllNotificationsRead: () => fetchJson('/notifications/read-all', { method: 'POST' })
  };
})();

if (typeof window !== 'undefined') {
  window.LifeApiClient = LifeApiClient;
}
