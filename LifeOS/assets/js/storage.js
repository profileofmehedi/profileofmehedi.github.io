/**
 * LifeOS — State Management & LocalStorage Persistence
 * Implements centralized reactive state, double-entry financial integrity, and event bus.
 */

const LifeStorage = (() => {
  const STORAGE_KEY = "LIFEOS_DATA_BN_V2";
  const AUTH_KEY = "LIFEOS_AUTH_BN_V2";

  // Event bus subscribers
  const listeners = {};

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error("Storage event listener error:", e);
        }
      });
    }
  }

  // Load state from localStorage or initialize with seed data
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn("Error reading localStorage, reverting to SEED_DATA:", err);
    }

    // Initialize with clone of SEED_DATA
    const seedCopy = JSON.parse(JSON.stringify(window.SEED_DATA || {}));
    saveState(seedCopy);
    return seedCopy;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist LifeOS state to localStorage:", e);
    }
  }

  let state = loadState();

  function getState() {
    return state;
  }

  function get(key) {
    return state[key];
  }

  function set(key, value, silent = false) {
    state[key] = value;
    saveState(state);
    if (!silent) {
      emit("change", { key, value });
    }
  }

  // Authentication Management
  function getAuthSession() {
    try {
      const session = localStorage.getItem(AUTH_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  }

  function setAuthSession(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      user,
      loggedInAt: new Date().toISOString()
    }));
    emit("auth_change", { isLoggedIn: true, user });
  }

  function clearAuthSession() {
    localStorage.removeItem(AUTH_KEY);
    emit("auth_change", { isLoggedIn: false });
  }

  function isAuthenticated() {
    return !!getAuthSession();
  }

  /**
   * Financial Accounting Integrity Rules
   */

  // Apply financial effect of a transaction
  function applyTransactionImpact(tx, isReverse = false) {
    const factor = isReverse ? -1 : 1;
    const amount = Number(tx.amount) || 0;

    if (tx.type === "expense") {
      // Check if paid via Credit Card or standard Account
      const card = state.cards.find(c => c.id === tx.accountId || c.id === tx.cardId);
      if (card && card.type === "credit") {
        card.outstanding = Math.max(0, (Number(card.outstanding) || 0) + amount * factor);
        card.availableCredit = Math.max(0, (Number(card.limit) || 0) - card.outstanding);
      } else {
        const acc = state.accounts.find(a => a.id === tx.accountId);
        if (acc) {
          acc.balance = (Number(acc.balance) || 0) - amount * factor;
        }
      }
    } else if (tx.type === "income") {
      const acc = state.accounts.find(a => a.id === tx.accountId);
      if (acc) {
        acc.balance = (Number(acc.balance) || 0) + amount * factor;
      }
    } else if (tx.type === "transfer") {
      const srcAcc = state.accounts.find(a => a.id === tx.accountId);
      const destAcc = state.accounts.find(a => a.id === tx.destinationAccountId);
      if (srcAcc) {
        srcAcc.balance = (Number(srcAcc.balance) || 0) - amount * factor;
      }
      if (destAcc) {
        destAcc.balance = (Number(destAcc.balance) || 0) + amount * factor;
      }
    } else if (tx.type === "savings") {
      // Deduct from source account and add to savings goal
      const srcAcc = state.accounts.find(a => a.id === tx.accountId);
      if (srcAcc) {
        srcAcc.balance = (Number(srcAcc.balance) || 0) - amount * factor;
      }
      if (tx.savingsGoalId) {
        const goal = state.savingsGoals.find(g => g.id === tx.savingsGoalId);
        if (goal) {
          goal.currentAmount = Math.max(0, (Number(goal.currentAmount) || 0) + amount * factor);
        }
      }
    } else if (tx.type === "debt_payment") {
      // Deduct from bank account and reduce credit card outstanding
      const srcAcc = state.accounts.find(a => a.id === tx.accountId);
      const card = state.cards.find(c => c.id === (tx.cardId || tx.destinationAccountId));
      if (srcAcc) {
        srcAcc.balance = (Number(srcAcc.balance) || 0) - amount * factor;
      }
      if (card && card.type === "credit") {
        card.outstanding = Math.max(0, (Number(card.outstanding) || 0) - amount * factor);
        card.availableCredit = Math.max(0, (Number(card.limit) || 0) - card.outstanding);
      }
    }
  }

  // Transactions CRUD
  function addTransaction(tx) {
    if (!tx.id) tx.id = LifeUtils.generateId("tx");
    if (!tx.date) tx.date = LifeUtils.CURRENT_DEMO_DATE;
    tx.amount = Number(tx.amount) || 0;

    applyTransactionImpact(tx, false);
    state.transactions.unshift(tx);
    saveState(state);
    emit("change", { key: "transactions", action: "add", data: tx });
    return tx;
  }

  function updateTransaction(updatedTx) {
    const idx = state.transactions.findIndex(t => t.id === updatedTx.id);
    if (idx === -1) return null;

    const oldTx = state.transactions[idx];
    // Reverse old impact
    applyTransactionImpact(oldTx, true);
    // Apply new impact
    applyTransactionImpact(updatedTx, false);

    state.transactions[idx] = updatedTx;
    saveState(state);
    emit("change", { key: "transactions", action: "update", data: updatedTx });
    return updatedTx;
  }

  function deleteTransaction(txId) {
    const idx = state.transactions.findIndex(t => t.id === txId);
    if (idx === -1) return false;

    const oldTx = state.transactions[idx];
    applyTransactionImpact(oldTx, true);

    state.transactions.splice(idx, 1);
    saveState(state);
    emit("change", { key: "transactions", action: "delete", id: txId });
    return true;
  }

  // Accounts CRUD
  function addAccount(acc) {
    if (!acc.id) acc.id = LifeUtils.generateId("acc");
    acc.balance = Number(acc.balance) || 0;
    state.accounts.push(acc);
    saveState(state);
    emit("change", { key: "accounts", action: "add", data: acc });
    return acc;
  }

  function updateAccount(updatedAcc) {
    const idx = state.accounts.findIndex(a => a.id === updatedAcc.id);
    if (idx === -1) return null;
    state.accounts[idx] = { ...state.accounts[idx], ...updatedAcc };
    saveState(state);
    emit("change", { key: "accounts", action: "update", data: state.accounts[idx] });
    return state.accounts[idx];
  }

  function deleteAccount(accId) {
    state.accounts = state.accounts.filter(a => a.id !== accId);
    saveState(state);
    emit("change", { key: "accounts", action: "delete", id: accId });
    return true;
  }

  // Cards CRUD
  function addCard(card) {
    if (!card.id) card.id = LifeUtils.generateId("card");
    card.limit = Number(card.limit) || 0;
    card.outstanding = Number(card.outstanding) || 0;
    card.availableCredit = Math.max(0, card.limit - card.outstanding);
    state.cards.push(card);
    saveState(state);
    emit("change", { key: "cards", action: "add", data: card });
    return card;
  }

  function updateCard(updatedCard) {
    const idx = state.cards.findIndex(c => c.id === updatedCard.id);
    if (idx === -1) return null;
    updatedCard.availableCredit = Math.max(0, (Number(updatedCard.limit) || 0) - (Number(updatedCard.outstanding) || 0));
    state.cards[idx] = { ...state.cards[idx], ...updatedCard };
    saveState(state);
    emit("change", { key: "cards", action: "update", data: state.cards[idx] });
    return state.cards[idx];
  }

  function deleteCard(cardId) {
    state.cards = state.cards.filter(c => c.id !== cardId);
    saveState(state);
    emit("change", { key: "cards", action: "delete", id: cardId });
    return true;
  }

  // Budgets CRUD
  function addBudget(b) {
    if (!b.id) b.id = LifeUtils.generateId("bud");
    b.limit = Number(b.limit) || 0;
    state.budgets.push(b);
    saveState(state);
    emit("change", { key: "budgets", action: "add", data: b });
    return b;
  }

  function updateBudget(b) {
    const idx = state.budgets.findIndex(item => item.id === b.id);
    if (idx === -1) return null;
    state.budgets[idx] = { ...state.budgets[idx], ...b };
    saveState(state);
    emit("change", { key: "budgets", action: "update", data: state.budgets[idx] });
    return state.budgets[idx];
  }

  function deleteBudget(budgetId) {
    state.budgets = state.budgets.filter(b => b.id !== budgetId);
    saveState(state);
    emit("change", { key: "budgets", action: "delete", id: budgetId });
    return true;
  }

  // Savings Goals CRUD
  function addSavingsGoal(goal) {
    if (!goal.id) goal.id = LifeUtils.generateId("sav");
    goal.targetAmount = Number(goal.targetAmount) || 0;
    goal.currentAmount = Number(goal.currentAmount) || 0;
    if (!goal.contributions) goal.contributions = [];
    state.savingsGoals.push(goal);
    saveState(state);
    emit("change", { key: "savingsGoals", action: "add", data: goal });
    return goal;
  }

  function updateSavingsGoal(goal) {
    const idx = state.savingsGoals.findIndex(g => g.id === goal.id);
    if (idx === -1) return null;
    state.savingsGoals[idx] = { ...state.savingsGoals[idx], ...goal };
    saveState(state);
    emit("change", { key: "savingsGoals", action: "update", data: state.savingsGoals[idx] });
    return state.savingsGoals[idx];
  }

  function deleteSavingsGoal(goalId) {
    state.savingsGoals = state.savingsGoals.filter(g => g.id !== goalId);
    saveState(state);
    emit("change", { key: "savingsGoals", action: "delete", id: goalId });
    return true;
  }

  function contributeToGoal(goalId, amount, note, sourceAccountId) {
    const goal = state.savingsGoals.find(g => g.id === goalId);
    if (!goal) return null;

    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) return null;

    // Record transaction
    const tx = {
      id: LifeUtils.generateId("tx"),
      date: LifeUtils.CURRENT_DEMO_DATE,
      type: "savings",
      description: `Contribution: ${goal.name}`,
      amount: numAmount,
      category: "Savings Contribution",
      accountId: sourceAccountId || "acc-1",
      savingsGoalId: goalId,
      method: "Direct Allocation",
      merchant: goal.name,
      tags: ["GoalDeposit"],
      notes: note || "Manual goal contribution"
    };

    if (!goal.contributions) goal.contributions = [];
    goal.contributions.unshift({
      date: LifeUtils.CURRENT_DEMO_DATE,
      amount: numAmount,
      note: note || "Contribution"
    });

    addTransaction(tx);
    return goal;
  }

  // Habits CRUD & Toggle
  function toggleHabitCompletion(habitId, dateStr = LifeUtils.CURRENT_DEMO_DATE) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return null;

    if (!habit.completedDates) habit.completedDates = [];
    const dateIdx = habit.completedDates.indexOf(dateStr);

    if (dateIdx > -1) {
      habit.completedDates.splice(dateIdx, 1);
    } else {
      habit.completedDates.push(dateStr);
      habit.completedDates.sort();
    }

    saveState(state);
    emit("change", { key: "habits", action: "toggle", habitId, dateStr, completed: dateIdx === -1 });
    return habit;
  }

  function addHabit(habit) {
    if (!habit.id) habit.id = LifeUtils.generateId("hab");
    if (!habit.completedDates) habit.completedDates = [];
    state.habits.push(habit);
    saveState(state);
    emit("change", { key: "habits", action: "add", data: habit });
    return habit;
  }

  function updateHabit(habit) {
    const idx = state.habits.findIndex(h => h.id === habit.id);
    if (idx === -1) return null;
    state.habits[idx] = { ...state.habits[idx], ...habit };
    saveState(state);
    emit("change", { key: "habits", action: "update", data: state.habits[idx] });
    return state.habits[idx];
  }

  function deleteHabit(habitId) {
    state.habits = state.habits.filter(h => h.id !== habitId);
    saveState(state);
    emit("change", { key: "habits", action: "delete", id: habitId });
    return true;
  }

  // Tasks CRUD
  function addTask(task) {
    if (!task.id) task.id = LifeUtils.generateId("tsk");
    if (!task.status) task.status = "todo";
    state.tasks.unshift(task);
    saveState(state);
    emit("change", { key: "tasks", action: "add", data: task });
    return task;
  }

  function updateTask(task) {
    const idx = state.tasks.findIndex(t => t.id === task.id);
    if (idx === -1) return null;
    state.tasks[idx] = { ...state.tasks[idx], ...task };
    saveState(state);
    emit("change", { key: "tasks", action: "update", data: state.tasks[idx] });
    return state.tasks[idx];
  }

  function toggleTaskStatus(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = task.status === "completed" ? "todo" : "completed";
    saveState(state);
    emit("change", { key: "tasks", action: "toggle", taskId, status: task.status });
    return task;
  }

  function deleteTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveState(state);
    emit("change", { key: "tasks", action: "delete", id: taskId });
    return true;
  }

  // Routines CRUD
  function toggleRoutineStep(routineId, stepId) {
    const routine = state.routines.find(r => r.id === routineId);
    if (!routine) return null;
    const step = routine.steps.find(s => s.id === stepId);
    if (!step) return null;
    step.completed = !step.completed;
    saveState(state);
    emit("change", { key: "routines", action: "stepToggle", routineId, stepId });
    return step;
  }

  // Calendar Events CRUD
  function addCalendarEvent(evt) {
    if (!evt.id) evt.id = LifeUtils.generateId("evt");
    state.calendarEvents.push(evt);
    saveState(state);
    emit("change", { key: "calendarEvents", action: "add", data: evt });
    return evt;
  }

  function deleteCalendarEvent(evtId) {
    state.calendarEvents = state.calendarEvents.filter(e => e.id !== evtId);
    saveState(state);
    emit("change", { key: "calendarEvents", action: "delete", id: evtId });
    return true;
  }

  // Life Goals CRUD
  function addLifeGoal(lg) {
    if (!lg.id) lg.id = LifeUtils.generateId("lg");
    if (!lg.milestones) lg.milestones = [];
    state.lifeGoals.push(lg);
    saveState(state);
    emit("change", { key: "lifeGoals", action: "add", data: lg });
    return lg;
  }

  function updateLifeGoal(lg) {
    const idx = state.lifeGoals.findIndex(g => g.id === lg.id);
    if (idx === -1) return null;
    state.lifeGoals[idx] = { ...state.lifeGoals[idx], ...lg };
    saveState(state);
    emit("change", { key: "lifeGoals", action: "update", data: state.lifeGoals[idx] });
    return state.lifeGoals[idx];
  }

  function toggleMilestone(goalId, milestoneIdx) {
    const goal = state.lifeGoals.find(g => g.id === goalId);
    if (!goal || !goal.milestones || !goal.milestones[milestoneIdx]) return null;
    goal.milestones[milestoneIdx].done = !goal.milestones[milestoneIdx].done;

    // Recalculate progress percentage
    const doneCount = goal.milestones.filter(m => m.done).length;
    goal.progress = Math.round((doneCount / goal.milestones.length) * 100);

    saveState(state);
    emit("change", { key: "lifeGoals", action: "milestoneToggle", goalId });
    return goal;
  }

  function deleteLifeGoal(goalId) {
    state.lifeGoals = state.lifeGoals.filter(g => g.id !== goalId);
    saveState(state);
    emit("change", { key: "lifeGoals", action: "delete", id: goalId });
    return true;
  }

  // Journal CRUD
  function addJournalEntry(entry) {
    if (!entry.id) entry.id = LifeUtils.generateId("jou");
    if (!entry.date) entry.date = LifeUtils.CURRENT_DEMO_DATE;
    state.journalEntries.unshift(entry);
    saveState(state);
    emit("change", { key: "journalEntries", action: "add", data: entry });
    return entry;
  }

  function updateJournalEntry(entry) {
    const idx = state.journalEntries.findIndex(j => j.id === entry.id);
    if (idx === -1) return null;
    state.journalEntries[idx] = { ...state.journalEntries[idx], ...entry };
    saveState(state);
    emit("change", { key: "journalEntries", action: "update", data: state.journalEntries[idx] });
    return state.journalEntries[idx];
  }

  function deleteJournalEntry(entryId) {
    state.journalEntries = state.journalEntries.filter(j => j.id !== entryId);
    saveState(state);
    emit("change", { key: "journalEntries", action: "delete", id: entryId });
    return true;
  }

  // Notifications
  function markNotificationRead(notifId) {
    const n = state.notifications.find(item => item.id === notifId);
    if (n) {
      n.read = true;
      saveState(state);
      emit("change", { key: "notifications" });
    }
  }

  function markAllNotificationsRead() {
    state.notifications.forEach(n => (n.read = true));
    saveState(state);
    emit("change", { key: "notifications" });
  }

  function clearAllNotifications() {
    state.notifications = [];
    saveState(state);
    emit("change", { key: "notifications" });
  }

  // Conveyance Trips CRUD
  function addConveyanceTrip(trip) {
    if (!state.conveyanceTrips) state.conveyanceTrips = [];
    if (!trip.id) trip.id = LifeUtils.generateId("trip");
    trip.actualCost = Number(trip.actualCost) || 0;
    trip.claimedCost = Number(trip.claimedCost) || 0;
    trip.pocketGap = Math.max(0, trip.actualCost - trip.claimedCost);
    if (!trip.status) trip.status = "unsubmitted";

    // Deduct actual cost from selected paying account as an expense
    if (trip.accountId) {
      const tx = {
        id: LifeUtils.generateId("tx"),
        date: trip.date || LifeUtils.CURRENT_DEMO_DATE,
        type: "expense",
        description: `Official Conveyance: ${trip.clientOrPurpose}`,
        amount: trip.actualCost,
        category: "Transport & Fuel",
        accountId: trip.accountId,
        method: "Direct Payment",
        merchant: trip.location || "Official Trip",
        tags: ["Conveyance", "Meeting"],
        notes: `Route: ${trip.route || "City commute"}. Submitted: ${trip.claimedCost} BDT. Pocket gap: ${trip.pocketGap} BDT.`
      };
      addTransaction(tx);
    }

    state.conveyanceTrips.unshift(trip);
    saveState(state);
    emit("change", { key: "conveyanceTrips", action: "add", data: trip });
    return trip;
  }

  function updateConveyanceTrip(trip) {
    if (!state.conveyanceTrips) state.conveyanceTrips = [];
    const idx = state.conveyanceTrips.findIndex(t => t.id === trip.id);
    if (idx === -1) return null;
    trip.actualCost = Number(trip.actualCost) || 0;
    trip.claimedCost = Number(trip.claimedCost) || 0;
    trip.pocketGap = Math.max(0, trip.actualCost - trip.claimedCost);
    state.conveyanceTrips[idx] = { ...state.conveyanceTrips[idx], ...trip };
    saveState(state);
    emit("change", { key: "conveyanceTrips", action: "update", data: state.conveyanceTrips[idx] });
    return state.conveyanceTrips[idx];
  }

  function deleteConveyanceTrip(tripId) {
    if (!state.conveyanceTrips) state.conveyanceTrips = [];
    state.conveyanceTrips = state.conveyanceTrips.filter(t => t.id !== tripId);
    saveState(state);
    emit("change", { key: "conveyanceTrips", action: "delete", id: tripId });
    return true;
  }

  // Conveyance Claims (Batches) Management
  function addConveyanceClaim(claim) {
    if (!state.conveyanceClaims) state.conveyanceClaims = [];
    if (!claim.id) claim.id = LifeUtils.generateId("clm");
    if (!claim.voucherNumber) claim.voucherNumber = `VCH-${new Date().getFullYear()}-${String(state.conveyanceClaims.length + 1).padStart(3, "0")}`;
    if (!claim.status) claim.status = "pending_approval";
    claim.disbursedAmount = 0;
    claim.companyDeduction = 0;

    // Mark included trips as submitted and link to claimId
    if (claim.tripIds && state.conveyanceTrips) {
      state.conveyanceTrips.forEach(t => {
        if (claim.tripIds.includes(t.id)) {
          t.status = "submitted";
          t.claimId = claim.id;
        }
      });
    }

    state.conveyanceClaims.unshift(claim);
    saveState(state);
    emit("change", { key: "conveyanceClaims", action: "add", data: claim });
    return claim;
  }

  function disburseConveyanceClaim(claimId, disbursedAmount, deductionReason, targetAccountId) {
    if (!state.conveyanceClaims) return null;
    const claim = state.conveyanceClaims.find(c => c.id === claimId);
    if (!claim) return null;

    const disbursed = Number(disbursedAmount) || 0;
    const deduction = Math.max(0, (Number(claim.totalClaimed) || 0) - disbursed);

    claim.disbursedAmount = disbursed;
    claim.companyDeduction = deduction;
    claim.disbursementDate = LifeUtils.CURRENT_DEMO_DATE;
    claim.targetAccountId = targetAccountId || "acc-3";
    claim.status = deduction > 0 ? "partially_disbursed" : "fully_disbursed";
    claim.disbursementNote = deductionReason || (deduction > 0 ? `Company deducted ${deduction} BDT.` : "Full reimbursement disbursed.");

    // Mark all linked trips as settled
    if (claim.tripIds && state.conveyanceTrips) {
      state.conveyanceTrips.forEach(t => {
        if (claim.tripIds.includes(t.id)) {
          t.status = "settled";
        }
      });
    }

    // Add reimbursement transaction into target account
    if (disbursed > 0) {
      const tx = {
        id: LifeUtils.generateId("tx"),
        date: LifeUtils.CURRENT_DEMO_DATE,
        type: "income",
        description: `কোম্পানি রিইমবার্সমেন্ট: ${claim.voucherNumber} (${claim.title})`,
        amount: disbursed,
        category: "অন্যান্য",
        accountId: claim.targetAccountId,
        method: "ব্যাংক / এমএফএস ক্রেডিট",
        merchant: "অফিস রিইমবার্সমেন্ট",
        tags: ["রিইমবার্সমেন্ট", "যাতায়াত"],
        notes: `দাবিকৃত: ৳${claim.totalClaimed}। পরিশোধিত: ৳${disbursed}। অফিস কর্তন: ৳${deduction}।`
      };
      addTransaction(tx);
    }

    saveState(state);
    emit("change", { key: "conveyanceClaims", action: "disburse", data: claim });
    return claim;
  }

  // Reset to original Seed Data
  function resetDemoData() {
    state = JSON.parse(JSON.stringify(window.SEED_DATA));
    saveState(state);
    emit("change", { key: "all", reset: true });
    return state;
  }

  return {
    on,
    emit,
    getState,
    get,
    set,
    getAuthSession,
    setAuthSession,
    clearAuthSession,
    isAuthenticated,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addCard,
    updateCard,
    deleteCard,
    addBudget,
    updateBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal,
    toggleHabitCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    toggleRoutineStep,
    addCalendarEvent,
    deleteCalendarEvent,
    addLifeGoal,
    updateLifeGoal,
    toggleMilestone,
    deleteLifeGoal,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    addConveyanceTrip,
    updateConveyanceTrip,
    deleteConveyanceTrip,
    addConveyanceClaim,
    disburseConveyanceClaim,
    resetDemoData
  };
})();

if (typeof window !== "undefined") {
  window.LifeStorage = LifeStorage;
}

