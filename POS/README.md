# Deshi POS - Bangladesh Professional Point of Sale

A complete, responsive, and lucrative POS Admin Panel and Interface designed for Bangladeshi businesses. This is a frontend-only application with a simulated backend using `localStorage`.

## Features

- **Authentication:** Login as Super Admin, Admin, Manager, or Cashier.
- **Dashboard:** Real-time statistics, charts (Chart.js), and recent sales.
- **POS Screen:**
    - Fast product search & category filtering.
    - Cart management (Qty, Delete).
    - Discount & Tax calculation.
    - Payment Modal (Cash, Card, Bkash/Nagad).
    - Invoice printing simulation.
- **Product Management:** Add, Edit, Delete products with image placeholders.
- **Customer Management:** CRM with purchase history tracking.
- **Sales History:** View all transactions and generate invoices.
- **User Management:** Role-based user control.
- **Data Persistence:** All data is saved in browser `localStorage`. Closing the browser does not lose data.

## Demo Credentials

- **Super Admin:** `superadmin` / `123`
- **Admin:** `admin` / `123`
- **Manager:** `manager` / `123`
- **Cashier:** `cashier` / `123`

## Installation & Usage

1.  Simply open `index.html` in your web browser.
2.  Login with any of the demo credentials (buttons provided for quick login).
3.  Navigate through the sidebar to access different modules.
4.  **Note:** Since this uses `localStorage`, if you want to reset the database, open the browser console (F12) and type `localStorage.clear()` and refresh.

## Technologies Used

- HTML5, CSS3
- Bootstrap 5
- jQuery
- DataTables (for advanced tables)
- SweetAlert2 (for beautiful alerts)
- Chart.js (for analytics)
- FontAwesome (for icons)

## Folder Structure

```
/POS
  /assets
    /css
      style.css
    /js
      db.js       <-- Core Mock Database Logic
      layout.js   <-- Sidebar & Auth Logic
  /pages
    pos.html      <-- Main POS Interface
    products.html
    customers.html
    sales.html
    users.html
  index.html      <-- Login Page
  dashboard.html  <-- Admin Dashboard
```

## Customization

To change the currency symbol or tax rate, edit `assets/js/db.js` or the specific page logic in `pages/pos.html`.
