# MediShop - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### Step 1: Open the Application

1. Navigate to the folder containing the application
2. Double-click on `index.html` to open it in your default browser
3. Or right-click → Open with → Your preferred browser

### Step 2: Login

Use one of these demo accounts:

**Admin Account** (Full Access)

- Username: `admin`
- Password: `admin123`

**Manager Account** (Limited Access)

- Username: `manager`
- Password: `manager123`

**Seller Account** (POS Only)

- Username: `seller`
- Password: `seller123`

### Step 3: Explore!

After login, you'll see the Dashboard with:

- Statistics cards showing key metrics
- Quick calculator in the top bar
- Navigation sidebar on the left
- Profile menu in the top right

---

## 📖 Common Tasks

### 💊 Add a New Medicine

1. Click **Medicines** in the sidebar
2. Click **+ Add Medicine** button
3. Fill in: Name, Code, Category, Supplier, Price, Quantity, Expiry Date
4. Click **Save**

### 🛒 Process a Sale

1. Click **Sales** in the sidebar
2. Search for medicines in the list
3. Click a medicine to add to cart
4. Enter quantity
5. Click **Checkout**
6. Select payment method
7. Click **Pay** to complete sale

### 📊 View Reports

1. Click **Reports** in the sidebar
2. Optional: Set date range with From/To dates
3. View statistics and transaction history
4. Data updates in real-time

### 👥 Manage Users (Admin Only)

1. Click **User Management** in sidebar
2. View all users in the list
3. Click edit icon to modify user
4. Click delete icon to remove user
5. Click **+ Add User** to create new account

### ⚙️ Change Theme Color (Admin Only)

1. Click **Settings** in sidebar
2. Click **Theme** tab
3. Use color picker or enter hex code
4. Color changes apply immediately

### 🔐 Change Your Password

1. Click your profile dropdown (top right)
2. Click **My Profile**
3. Scroll to "Change Password" section
4. Enter current password
5. Enter new password (twice for confirmation)
6. Click **Update Password**

---

## 🎯 User Role Guide

### If you're an **ADMIN**

You have full access to:

- Dashboard with all statistics
- Medicines & Inventory management
- Point of Sale system
- Sales Reports
- User Management
- Menu Management
- Settings & Configuration

**Best for**: Store managers, business owners

### If you're a **MANAGER**

You have access to:

- Dashboard
- Medicines & Inventory
- Point of Sale
- Sales Reports
- Your Profile

**Cannot do**: Manage users, change settings, manage menus

**Best for**: Assistant managers, supervisors

### If you're a **SELLER**

You have access to:

- Dashboard (basic view)
- Point of Sale (Sales system)
- Your Profile

**Best for**: Sales staff, cashiers

---

## 💡 Pro Tips

### Calculator Shortcut

Press **Ctrl + Shift + C** to quickly open the calculator in the top bar!

### Quick Navigation

- Click the **MediShop logo** in top-left to return to Dashboard anytime
- Use the **sidebar menu** to jump between sections
- Click your **avatar/name** in top-right for profile options

### Stock Status

When viewing medicines, you'll see color-coded badges:

- 🟢 **Green** = In Stock (normal quantity)
- 🟡 **Yellow** = Low Stock (below reorder point)
- 🔴 **Red** = Out of Stock (zero quantity)

### Payment Methods in POS

When checking out, choose from:

- **Cash** - Physical payment
- **Card** - Debit/Credit card
- **Cheque** - Check payment
- **Online** - Digital payment

---

## ❓ Frequently Asked Questions

### Q: Where is my data saved?

**A**: All data is saved in your browser's localStorage. It persists even if you close the browser, as long as you don't clear your browser data.

### Q: How do I export data?

**A**: Currently, data is stored locally. For production use, you would need backend integration. You can screenshot reports or use browser developer tools to export localStorage data.

### Q: Can I use this on mobile?

**A**: Yes! The application is fully responsive. Open it on your phone's browser and it will adapt to mobile view. The sidebar hides on small screens.

### Q: How do I reset all data?

**A**:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page

### Q: Can I add more users?

**A**: Yes! Only Admin can manage users.

1. Go to User Management
2. Click "Add User"
3. Fill in details and assign role
4. Click Save

### Q: What if I forget my password?

**A**: In the demo version, all passwords are reset when you clear localStorage. For production, implement password recovery via email.

### Q: Can I change my role?

**A**: No, only Admin can assign roles. Ask your admin to update your account.

---

## 🔒 Important Notes

⚠️ **This is a DEMONSTRATION application**

- Uses client-side storage only (localStorage)
- Passwords are NOT encrypted
- Not suitable for production without backend
- Data is visible in browser DevTools
- Not secure for sensitive information

For production use:

- Implement proper backend authentication
- Use HTTPS encryption
- Hash passwords
- Use a secure database
- Implement access controls
- Regular security audits

---

## 🐛 Troubleshooting

### Application won't load

- Check if you have a modern browser (Chrome, Firefox, Safari, Edge)
- Try opening in Incognito/Private mode
- Clear browser cache and try again

### Data not saving

- Check if localStorage is enabled in browser settings
- Make sure you're not in private/incognito mode (some browsers disable localStorage)
- Try a different browser

### Pages not loading

- All pages are HTML files in the `pages/` folder
- Make sure all files are in the correct folder structure
- Try refreshing the page (F5 or Ctrl+R)

### Slow performance

- Close other browser tabs
- Clear browser cache
- Try a different browser
- Disable browser extensions

---

## 📞 Support

For issues or questions:

1. Check this Quick Start Guide
2. Read the full README.md
3. Check IMPLEMENTATION_SUMMARY.md for technical details

---

## 🎓 Next Steps

1. **Explore all modules** - Get familiar with each section
2. **Try different roles** - Login with different user accounts to see different UIs
3. **Test CRUD operations** - Add, edit, and delete items
4. **Process test sales** - Use the POS to record transactions
5. **View reports** - Check the sales analytics
6. **Customize settings** - Change theme colors and shop info

---

## ✨ Features You'll Love

- 🎨 Beautiful, professional design
- 📱 Works on all devices (mobile, tablet, desktop)
- ⚡ Fast and responsive
- 🎯 Intuitive navigation
- 🔐 Role-based access control
- 📊 Complete sales reporting
- 💾 Automatic data saving
- 🎮 Keyboard shortcuts

---

**Ready? Open `index.html` and start managing your medicine shop!** 💊

Happy selling! 🚀
