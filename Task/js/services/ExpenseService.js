// Expense Service (Service Layer)
// Manages transaction log CRUD and processes reports and totals.
// Globally Scoped.

class ExpenseService {
  constructor() {
    this.collection = 'expenses';
  }

  getExpenses() {
    return window.storageService.get(this.collection) || [];
  }

  addTransaction(transaction) {
    const defaultTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'expense',
      amount: 0,
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      description: ''
    };

    const newTx = { ...defaultTx, ...transaction, amount: parseFloat(transaction.amount) || 0 };
    window.storageService.add(this.collection, newTx);
    return newTx;
  }

  deleteTransaction(id) {
    return window.storageService.delete(this.collection, id);
  }

  // Get aggregated finance metrics
  getSummary() {
    const list = this.getExpenses();
    let income = 0;
    let expense = 0;

    list.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });

    const savings = income - expense;
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

    return {
      income,
      expense,
      savings,
      savingsRate
    };
  }

  // Group spending by categories
  getCategorySummary() {
    const list = this.getExpenses();
    const summary = {};

    list.filter(tx => tx.type === 'expense').forEach(tx => {
      const cat = tx.category || 'Other';
      if (!summary[cat]) {
        summary[cat] = 0;
      }
      summary[cat] += tx.amount;
    });

    return summary;
  }
}

// Global Singleton instantiation
window.expenseService = new ExpenseService();
