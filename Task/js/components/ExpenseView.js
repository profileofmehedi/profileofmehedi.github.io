// Expense Books View Component (UI Module)
// Draws balance ledger sheets, income/expense distributions, category charts (Chart.js), and add.
// Globally Scoped.

window.ExpenseView = class ExpenseView {
  constructor(app) {
    this.app = app;
    this.chartInstance = null;
  }

  render(container) {
    const list = window.expenseService.getExpenses();
    const summary = window.expenseService.getSummary();

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 class="font-bold mb-1">Financial Ledger</h2>
            <p class="text-muted text-sm mb-0">Record your income flow, savings rates, and categorize spending.</p>
          </div>
          <button class="btn btn-primary btn-sm font-semibold flex-shrink-0" id="tx-add-btn">
            <i class="bi bi-plus-lg"></i> Log Transaction
          </button>
        </div>

        <!-- Ledger balance sheet cards -->
        <div class="row g-2 g-sm-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Total Income Flow</div>
                <div class="h4 font-bold mb-0 text-success">$${summary.income}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(239, 68, 68, 0.1); color: #ef4444; flex-shrink: 0;">
                <i class="bi bi-graph-down-arrow"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Total Spending</div>
                <div class="h4 font-bold mb-0 text-danger">$${summary.expense}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Net Savings Balance</div>
                <div class="h4 font-bold mb-0 text-primary">$${summary.savings}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-2 p-sm-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 gap-sm-3 h-100">
              <div class="rounded-circle d-none d-sm-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(139, 92, 246, 0.1); color: #8b5cf6; flex-shrink: 0;">
                <i class="bi bi-percent"></i>
              </div>
              <div class="text-center text-sm-start">
                <div class="text-2xs text-muted font-bold text-uppercase">Savings Rate</div>
                <div class="h4 font-bold mb-0 text-main">${summary.savingsRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Transaction Creator Card -->
        <div class="premium-card p-3 mb-4">
          <h6 class="font-bold text-xs text-uppercase text-muted mb-2"><i class="bi bi-lightning-charge"></i> Quick Transaction Logger</h6>
          <form id="quick-tx-form" class="row g-3 align-items-center">
            <div class="col-12 col-md-4">
              <input type="text" id="quick-tx-desc" class="form-control form-control-sm text-sm" placeholder="Description (e.g. Groceries, Coffee)..." required>
            </div>
            <div class="col-12 col-md-2">
              <input type="number" id="quick-tx-amount" class="form-control form-control-sm text-sm font-semibold" step="0.01" min="0.01" placeholder="Amount ($)..." required>
            </div>
            <div class="col-12 col-md-2">
              <select id="quick-tx-category" class="form-select form-select-sm text-xs">
                <option value="Groceries" selected>Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Salary">Salary (Income)</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <select id="quick-tx-type" class="form-select form-select-sm text-xs">
                <option value="expense" selected>Expense Debit</option>
                <option value="income">Income Credit</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button type="submit" class="btn btn-primary btn-sm font-semibold w-100 py-1"><i class="bi bi-plus-lg"></i> Log Entry</button>
            </div>
          </form>
        </div>

        <div class="row g-4">
          <!-- Transaction Ledger -->
          <div class="col-lg-7">
            <div class="premium-card p-0 overflow-hidden h-100">
              <div class="py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                <h6 class="font-bold mb-0 text-main">Ledger Transactions Sheet</h6>
                <span class="text-xs text-muted">${list.length} rows logged</span>
              </div>
              
              <!-- Desktop Table View -->
              <div class="d-none d-md-block overflow-y-auto" style="max-height: 450px;">
                <table class="table table-hover align-middle mb-0 text-sm">
                  <thead class="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th class="text-end">Amount</th>
                      <th width="50" class="pe-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${list.map(tx => {
                      const amountColor = tx.type === 'income' ? 'text-success' : 'text-danger';
                      const prefix = tx.type === 'income' ? '+' : '-';
                      return `
                        <tr>
                          <td class="text-muted text-xs">${tx.date}</td>
                          <td><span class="badge bg-light text-dark border text-capitalize">${tx.category}</span></td>
                          <td class="text-main font-semibold">${tx.description || 'No notes'}</td>
                          <td class="text-end font-bold ${amountColor}">${prefix}$${tx.amount}</td>
                          <td class="pe-3">
                            <button class="btn btn-sm btn-link text-danger p-0 delete-tx-btn" data-id="${tx.id}"><i class="bi bi-trash-fill"></i></button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                    ${list.length === 0 ? '<tr><td colspan="5" class="text-center text-muted py-5">No transaction items found.</td></tr>' : ''}
                  </tbody>
                </table>
              </div>

              <!-- Mobile List View -->
              <div class="d-block d-md-none overflow-y-auto" style="max-height: 450px;">
                <div class="list-group list-group-flush">
                  ${list.map(tx => {
                    const amountColor = tx.type === 'income' ? 'text-success' : 'text-danger';
                    const prefix = tx.type === 'income' ? '+' : '-';
                    return `
                      <div class="list-group-item py-3 px-3 border-bottom d-flex align-items-center justify-content-between bg-transparent">
                        <div class="min-width-0 flex-grow-1 me-2 text-start">
                          <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge bg-light text-dark border text-2xs text-capitalize">${tx.category}</span>
                            <span class="text-3xs text-muted">${tx.date}</span>
                          </div>
                          <div class="text-sm font-semibold text-main text-truncate">${tx.description || 'No notes'}</div>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                          <span class="font-bold text-sm ${amountColor}">${prefix}$${tx.amount}</span>
                          <button class="btn btn-sm btn-link text-danger p-0 delete-tx-btn" data-id="${tx.id}"><i class="bi bi-trash-fill"></i></button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                  ${list.length === 0 ? '<div class="text-center text-muted py-5">No transaction items logged.</div>' : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Category Distribution Chart -->
          <div class="col-lg-5">
            <div class="premium-card h-100">
              <h6 class="font-bold mb-3 text-main">Spending Categories Share</h6>
              <div class="d-flex align-items-center justify-content-center" style="height: 320px;">
                <canvas id="spending-distribution-chart"></canvas>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  init(container) {
    container.querySelector('#tx-add-btn').addEventListener('click', () => {
      this.openAddTxDrawer();
    });

    container.querySelectorAll('.delete-tx-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Delete this ledger entry?")) {
          window.expenseService.deleteTransaction(btn.getAttribute('data-id'));
          window.notificationService.showToast('Transaction removed', 'success');
          this.render(container);
          this.init(container);
        }
      });
    });

    // Quick Transaction Logger form submission
    const quickForm = container.querySelector('#quick-tx-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = container.querySelector('#quick-tx-desc').value.trim();
        const amount = parseFloat(container.querySelector('#quick-tx-amount').value);
        const category = container.querySelector('#quick-tx-category').value;
        const type = container.querySelector('#quick-tx-type').value;
        const date = new Date().toISOString().split('T')[0];

        window.expenseService.addTransaction({
          type,
          amount,
          category,
          description,
          date
        });

        window.notificationService.showToast('Ledger sheet updated', 'success');
        this.render(container);
        this.init(container);
      });
    }

    this.renderSpendingChart(container);
  }

  renderSpendingChart(container) {
    const canvas = container.querySelector('#spending-distribution-chart');
    if (!canvas) return;

    const data = window.expenseService.getCategorySummary();
    const labels = Object.keys(data);
    const values = Object.values(data);

    if (labels.length === 0) {
      const ctx = canvas.getContext('2d');
      ctx.font = '12px Outfit';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('No spending items logged to distribute', canvas.width / 2, canvas.height / 2);
      return;
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    if (window.Chart) {
      this.chartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444', '#64748b'],
            borderWidth: 2,
            borderColor: 'var(--bg-card)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Outfit', size: 11 },
                color: 'var(--text-main)'
              }
            }
          }
        }
      });
    }
  }

  openAddTxDrawer() {
    const html = `
      <form id="add-tx-drawer-form">
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Ledger Type</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="tx-type" id="tx-type-expense" value="expense" checked>
              <label class="form-check-label text-sm" for="tx-type-expense">Expense Debit</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="tx-type" id="tx-type-income" value="income">
              <label class="form-check-label text-sm" for="tx-type-income">Income Credit</label>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Ledger Amount ($)</label>
          <input type="number" id="tx-amount" class="form-control" step="0.01" min="0.01" required placeholder="0.00">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Category Label</label>
          <select id="tx-category" class="form-select">
            <option value="Salary">Salary (Credit)</option>
            <option value="Investments">Investments (Credit)</option>
            <option value="Housing">Housing (Rent/Mortgage)</option>
            <option value="Groceries">Groceries</option>
            <option value="Utilities">Utilities</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other" selected>Other Miscellaneous</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Transaction Description</label>
          <input type="text" id="tx-desc" class="form-control" required placeholder="Whole Foods, consulting retainer...">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Debit/Credit Date</label>
          <input type="date" id="tx-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3">Log Transaction</button>
      </form>
    `;

    this.app.openDrawer('Log Ledger Transaction', html, (content) => {
      content.querySelector('#add-tx-drawer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = content.querySelector('input[name="tx-type"]:checked').value;
        const amount = content.querySelector('#tx-amount').value;
        const category = content.querySelector('#tx-category').value;
        const description = content.querySelector('#tx-desc').value;
        const date = content.querySelector('#tx-date').value;

        window.expenseService.addTransaction({
          type,
          amount,
          category,
          description,
          date
        });

        window.notificationService.showToast('Ledger sheet updated', 'success');
        this.app.closeDrawer();

        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
