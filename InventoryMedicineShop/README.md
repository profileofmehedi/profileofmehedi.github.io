# MediShop - Medicine Shop Inventory Management System

A professional, responsive, and feature-rich web application for managing medicine shop inventory with admin, manager, and seller roles.

## 🎯 Features

### Core Features

- **User Authentication**: Role-based login system with three user types (Admin, Manager, Seller)
- **Responsive Design**: Fully responsive UI optimized for mobile, tablet, and desktop
- **Beautiful Animations**: CSS keyframe animations for smooth user experience
- **Theme Customization**: Dynamic theme color system changeable from frontend
- **Custom Calculator**: Quick access calculator in the top bar
- **Keyboard Shortcuts**: Application-wide keyboard shortcuts manageable by admin

### Inventory Management

- **Medicine Management**: Full CRUD operations for medicines with category and supplier assignment
- **Stock Management**: Real-time stock tracking with low stock alerts
- **Categories**: Organize medicines by categories
- **Suppliers**: Manage supplier information and contacts

### Point of Sale (POS)

- **Sales Module**: Shopping cart-based POS system
- **Multiple Payment Methods**: Support for Cash, Card, Cheque, and Online payments
- **Transaction Logging**: All sales recorded automatically

### Reporting

- **Sales Reports**: Comprehensive sales analytics with date filtering
- **Statistics Dashboard**: Total sales, transaction count, average order value
- **Transaction History**: Detailed transaction records with user information

### Administration

- **User Management**: Create, edit, and manage users with role assignment
- **Menu Management**: Assign menu items to user roles
- **Admin Settings**: Global application settings, shop information, contact details

### User Profiles

- **My Profile**: View user information and status
- **Password Management**: Secure password change functionality

## 📋 Default User Credentials

| Username | Password   | Role    |
| -------- | ---------- | ------- |
| admin    | admin123   | Admin   |
| manager  | manager123 | Manager |
| seller   | seller123  | Seller  |

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (inline styles), Bootstrap 5.3.0
- **JavaScript**: jQuery 3.6.0
- **UI Components**:
  - SweetAlert2 (notifications & modals)
  - DataTables 1.13.6 (data management)
  - Font Awesome 6.4.0 (icons)
- **Data Storage**: localStorage (client-side persistence)
- **Architecture**: Single-page application with separate HTML files per module

## 📁 Project Structure

```
InventoryMedicineShop/
├── index.html           # Login page
└── pages/
    ├── dashboard.html   # Main dashboard
    ├── medicines.html   # Medicine inventory
    ├── categories.html  # Medicine categories
    ├── suppliers.html   # Supplier management
    ├── inventory.html   # Stock management
    ├── sales.html       # Point of Sale
    ├── reports.html     # Sales reporting
    ├── users.html       # User management
    ├── menus.html       # Menu role assignment
    ├── settings.html    # Admin settings
    └── profile.html     # User profile
```

## 🚀 How to Use

1. **Open the application**: Open `index.html` in a modern web browser
2. **Login**: Use one of the default credentials above
3. **Navigate**: Use the sidebar menu to access different modules
4. **Dashboard**: View overview stats and quick access calculator
5. **Manage Inventory**: Add/edit/delete medicines, categories, suppliers
6. **Process Sales**: Use the POS system to record transactions
7. **View Reports**: Check sales analytics and transaction history
8. **Admin Panel**: Manage users, assign menus, configure settings

## 🎨 Customization

### Change Theme Color

1. Go to Settings (Admin only)
2. Select "Theme" tab
3. Use the color picker to set primary color
4. Changes apply immediately across the application

### Manage User Access

1. Go to Menu Management (Admin only)
2. Select a user role
3. Choose which menu items to show
4. Save changes

### Add New Users

1. Go to User Management (Admin only)
2. Click "Add User"
3. Fill in details and assign role
4. Save

## 📊 Role Permissions

### Admin

- Full access to all modules
- User management
- Settings configuration
- Menu management

### Manager

- Access to: Dashboard, Medicines, Categories, Suppliers, Inventory, Sales, Reports
- Cannot access: User Management, Settings, Menu Management

### Seller

- Access to: Dashboard, Sales
- Limited to POS operations only

## 💾 Data Storage

All data is stored in browser's localStorage:

- `currentUser`: Currently logged-in user
- `users`: User accounts database
- `medicines`: Medicine inventory
- `categories`: Medicine categories
- `suppliers`: Supplier information
- `transactions`: Sales transactions
- `appSettings`: Application configuration
- `roleMenus`: Role-based menu assignments
- `shortcuts`: Keyboard shortcuts mapping

## 🔐 Security Notes

- Passwords are stored in plain text in localStorage (demonstration only)
- For production: Implement proper backend authentication
- Use HTTPS to encrypt data in transit
- Consider implementing proper password hashing

## 🎮 Keyboard Shortcuts

- **Ctrl + Shift + C**: Open Calculator
- More shortcuts can be configured in Settings

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer Notes

- All CSS is inline (no external stylesheets)
- All JavaScript is inline (no external scripts)
- Responsive design using Bootstrap grid and custom media queries
- Animations use CSS keyframes for better performance
- localStorage provides client-side data persistence
- No backend/database required for basic functionality

---

**Last Updated**: 2024
**Version**: 1.0.0
