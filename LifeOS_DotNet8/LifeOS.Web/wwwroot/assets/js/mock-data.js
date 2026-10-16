/**
 * LifeOS — Clean Neutral Template
 * All mock data has been removed as requested.
 * Real data is managed dynamically via SQL Server backend.
 */

const SEED_DATA = {
  user: {
    name: "মেহেদী হাসান",
    email: "",
    role: "ইউজার",
    avatar: "",
    location: "ঢাকা, বাংলাদেশ",
    timezone: "Asia/Dhaka",
    joinedDate: "2026-01-01",
    bio: ""
  },

  settings: {
    currency: "BDT",
    currencySymbol: "৳",
    theme: "light",
    dateFormat: "DD MMM YYYY",
    firstDayOfWeek: "Sunday",
    privacyMode: false,
    defaultPage: "dashboard",
    notificationSound: true,
    budgetAlertThreshold: 85
  },

  accounts: [],
  cards: [],
  transactions: [],
  budgets: [],
  savingsGoals: [],
  tasks: [],
  habits: [],
  routines: [],
  calendarEvents: [],
  conveyanceTrips: [],
  conveyanceClaims: [],
  lifeGoals: [],
  journalEntries: [],
  notifications: []
};

window.SEED_DATA = SEED_DATA;
