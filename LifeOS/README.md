# LifeOS — Your Life, Under Control

> A premium, animated, responsive Personal Life & Finance Operating System built with modern web technologies, Chart.js, and Three.js.

![LifeOS Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**LifeOS** is a unified personal management dashboard that consolidates money, bank accounts, credit cards, habits, routines, tasks, savings goals, calendar events, and reflections into one high-performance interface.

### Highlights
- ⚡ **Zero-Build & Zero-Dependency Setup:** Runs directly in any modern browser by double-clicking `index.html` or launching a static local web server.
- 🎨 **Fintech Visual Direction:** Inspired by Linear, Stripe, and Apple. Minimalist whitespace, fluid card hover elevation, and dark/light themes.
- 🌐 **Interactive 3D Visuals (Three.js):** Ambient particle constellation background and interactive 3D physics tilt on credit/debit cards.
- 📊 **Dynamic Data Visualizations (Chart.js):** Real-time responsive charts for 6-month cashflow, category expenditures, account allocations, habit radar, and net worth growth curves.
- 🇧🇩 **Bangladesh-Oriented Dataset:** Realistic BDT (৳) balances across Prime Bank, BRAC Bank, bKash, Nagad, and credit cards.
- 🔒 **Double-Entry Financial Integrity:** Real-time balance updates on transactions, transfers, savings allocations, and credit card payments.
- 📱 **Mobile-First Responsive Layout:** Full drawer navigation on tablets, bottom navigation bar on mobile, and zero horizontal overflow.

---

## 🚀 Features

### 1. Overview
- **Command Center Dashboard:** Personalized time-of-day greeting ("Good evening, Mehedi"), daily execution progress bar, 6 financial metric cards (Net Worth, Income, Expenses, Savings, Liquid Balance, Savings Rate), privacy mode eye mask, Chart.js cashflow and balance charts, and live widgets.
- **My Day:** Daily command center with date selector, execution score ring, scheduled tasks, habit checklist, daily routine timeline, financial inflow/outflow, and evening reflection.
- **Calendar & Agenda:** 7-column monthly and weekly calendar displaying scheduled tasks, bill due dates, meetings, and personal milestones.

### 2. Money & Wealth
- **Transactions Ledger:** Comprehensive ledger supporting Income, Expense, Transfer, Savings Contribution, and Debt Payments. Multi-column filters (type, category, account), real-time search, date/amount sorting, pagination, summary totals banner, and **CSV export download**.
- **Accounts & Cards:** Interactive fintech portfolio for bank accounts, mobile wallets (bKash/Nagad), cash, and 3D credit/debit cards with cardholder details, masked numbers, credit limits, and money transfers between accounts.
- **Monthly Budgets:** Dynamic category budgets comparing actual spending (derived from transactions) vs planned limits with visual threshold warnings (80% warning, 100%+ alert).
- **Savings & Goals:** Target-based savings goals (Emergency Fund, MacBook Pro, Cox's Bazar Vacation, Home Down Payment) with deposit contributions deducted directly from bank balances and milestone timelines.
- **Financial Reports:** Cashflow breakdown, 6-month net worth trajectory curve, and category expenditure rankings.

### 3. Lifestyle & Productivity
- **Habit Tracker:** 9 daily habits with an accurate **30-day activity heatmap grid** (GitHub-style contributions), exact streak calculation (current streak & longest streak), category filtering, and weekly discipline scores.
- **Tasks & Execution:** Dual-view system supporting a structured **List View** with priority badges and a dynamic **Kanban Board** (To Do, In Progress, Completed).
- **Daily Routines:** Ordered steps with estimated durations (Morning Miracle, Deep Work Sprint, Evening Wind-down, Weekly Financial Review) with interactive checkboxes and progress bars.
- **Personal Life Goals:** Vision planner across Career, Learning, Health, Finance, and Personal Growth with milestone checklists and completion percentages.
- **Journal & Reflections:** Distraction-free reflective journaling with mood states (Great, Good, Neutral, Tired, Stressed), gratitude notes, priorities for tomorrow, and tag search.

### 4. Global Tools & Preferences
- **Global Search (Ctrl + K):** Instant omnibox search indexing transactions, accounts, tasks, habits, goals, and journal entries.
- **Global Quick Add (+):** Fast dropdown modal trigger for expenses, income, transfers, tasks, habits, and reflections from anywhere in the app.
- **Notification Center:** Local in-app notifications with unread badge counters, bill alerts, habit milestone toasts, and read/clear actions.
- **Settings & Sandbox Reset:** Profile customization, theme selection (Light / Dark), currency preference (BDT, USD, EUR), and a safe demo reset button that restores the clean seed dataset via SweetAlert2.

---

## 🛠️ Technology Stack

- **HTML5 & Modern CSS3:** Custom CSS properties (variables), fluid light/dark themes, and responsive media queries.
- **Bootstrap 5.3.3 & Bootstrap Icons 1.11.3:** Responsive grid, modal dialogs, dropdowns, and icon set.
- **Vanilla JavaScript (ES6+) & jQuery 3.7.1:** Reactive state management, DOM manipulation, event delegation, and accounting calculations.
- **Chart.js 4.4.2:** Bar charts, doughnut charts, polar charts, and radar charts.
- **Three.js (r128):** 3D particle constellation and card perspective tilt physics.
- **SweetAlert2 11.10.7:** Modal dialogs, toasts, and destructive action confirmations.
- **Google Fonts:** `Inter` and `Hind Siliguri`.

---

## 💻 How to Run Locally

### Option 1: Direct File Launch
Simply double-click `index.html` or open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Static Server
If you prefer running via a local HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then navigate to `http://localhost:8000/LifeOS/` in your browser.

### Demo Credentials
- **Quick Login:** Click the **Quick Demo Login** button for instant entry.
- **Email:** `demo@lifeos.app`
- **Password:** `Demo@123`

---

## 📂 File Structure

```
LifeOS/
├── index.html                       # Main SPA container, views, navigation & modals
├── README.md                        # Documentation & setup guide
├── prompt.txt                       # Project specifications
└── assets/
    ├── css/
    │   └── styles.css               # Design tokens, dark mode, 3D cards, responsive rules
    └── js/
        ├── mock-data.js             # Realistic Bangladesh-oriented seed dataset
        ├── utils.js                 # Currency formatters, date helpers, calculations, CSV export
        ├── storage.js               # Reactive LocalStorage state manager & double-entry logic
        ├── three-scene.js           # Three.js 3D ambient particles & card tilt engine
        ├── charts.js                # Chart.js visual chart renderers & theme adaptation
        ├── modules/
        │   ├── auth.js              # Demo login, session handling, password toggle
        │   ├── dashboard.js         # Command center metrics, charts, privacy toggle & widgets
        │   ├── myday.js             # Daily command center, routines timeline & priorities
        │   ├── calendar.js          # Monthly calendar grid & agenda event scheduler
        │   ├── transactions.js      # Ledger, dynamic transaction form, filters & pagination
        │   ├── accounts.js          # Accounts & Cards, 3D cards, transfers & balances
        │   ├── budgets.js           # Category budgets vs actual spending calculation & alerts
        │   ├── savings.js           # Savings goals, deposits with account deduction & projections
        │   ├── habits.js            # Habit tracker, 30-day heatmap grid & streak tracker
        │   ├── tasks.js             # List view & Kanban board, priority badges
        │   ├── routines.js          # Reusable routines with ordered duration steps
        │   ├── lifegoals.js         # Life goals planner with milestone checklists
        │   ├── journal.js           # Reflection journal, mood tracking & gratitude
        │   ├── analytics.js         # Net worth growth curve & lifestyle radar
        │   ├── search.js            # Global Ctrl+K omnibox search
        │   └── settings.js          # Preferences, light/dark switcher, demo data reset
        └── app.js                   # Application coordinator, SPA router & notifications
```

---

## ⚖️ License & Credits

Designed and developed for Mehedi Hasan. Fictional sample data for demonstration purposes only.
