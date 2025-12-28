# Leading Edge Technology - Admin Panel

A professional admin panel for managing all content of the Leading Edge Technology website.

## 🔐 Login Credentials

- **Username:** `admin`
- **Password:** `123456`

## 📁 File Structure

```
admin/
├── login.html              # Admin login page
├── dashboard.html          # Main dashboard with overview
├── hero.html              # Hero section editor
├── about.html             # About section editor
├── services.html          # Services management
├── core-values.html       # Core values editor
├── clients.html           # Client information editor
├── contact-info.html      # Contact details editor
├── settings.html          # General settings and data management
├── admin-utils.js         # Shared utility functions
├── admin-style.css        # Shared styling
└── README.md              # This file
```

## 🎯 Features

### Authentication

- Secure login system with session management
- "Remember me" functionality
- Auto-redirect if not logged in
- Logout option available on all pages

### Content Management

1. **Hero Section** - Edit main hero title, subtitle, buttons, and video URL
2. **About Section** - Update company information, tagline, and features
3. **Services** - Manage 6 service offerings with titles and descriptions
4. **Core Values** - Edit 8 company values with icons and descriptions
5. **Clients** - Manage client statistics and information
6. **Contact Info** - Update headquarters, branch, phone, email, and social links
7. **Settings** - General website settings, meta information, and data backup

### Dashboard

- Quick overview of all changes made
- Recent activity log
- Quick action cards for each section
- Statistics display

### Data Management

- **Real-time Preview** - See changes instantly
- **LocalStorage** - All data saved to browser
- **Export/Import** - Backup and restore data
- **Change History** - Track all modifications
- **Data Clear** - Reset all data if needed

## 🚀 How to Use

### Accessing the Admin Panel

1. Navigate to `admin/login.html` in your browser
2. Enter credentials:
   - Username: `admin`
   - Password: `123456`
3. Click "Sign In"

### Managing Sections

1. From the dashboard, click on any section card or use the sidebar navigation
2. Edit the content in the provided forms
3. See real-time preview of your changes
4. Click "Save Changes" to store data
5. View change history on the dashboard

### Backing Up Data

1. Go to **Settings** page
2. Click "Export Data"
3. A JSON file will be downloaded with all your settings

### Restoring Data

1. Go to **Settings** page
2. Click "Import Data"
3. Select your previously exported JSON file
4. Confirm the import

## 💾 Data Storage

All data is stored in **Browser LocalStorage**. This means:

- ✅ No server required
- ✅ Changes saved instantly
- ✅ Works offline
- ⚠️ Data is local to your browser
- ⚠️ Clearing browser data will delete all changes

**Important:** To preserve your data when:

- Upgrading your browser
- Switching computers
- Clearing browser cache

Always export your data first using the Settings page!

## 🔄 Syncing with index.html

The admin panel saves all changes to LocalStorage. To apply these changes to the actual website:

1. The settings are stored as JSON in localStorage
2. You can export them from the Settings page
3. To publish changes to the live website, you would need to:
   - Integrate an API backend OR
   - Manually update index.html with the exported values OR
   - Use a deployment script to sync localStorage to the server

For now, this admin panel serves as a content management interface with data persistence.

## 🎨 Design Features

- **Professional UI** - Modern gradient design with consistent styling
- **Responsive Layout** - Works on desktop and tablets
- **Smooth Animations** - Fade and slide animations throughout
- **Real-time Preview** - See changes as you type
- **Form Validation** - Basic validation on all inputs
- **Toast Notifications** - Success/error feedback

## 🔒 Security Notes

- Credentials are hardcoded for demo purposes
- In production, implement proper authentication
- Use HTTPS for the admin panel
- Consider adding:
  - Multi-factor authentication
  - Password hashing
  - Server-side validation
  - Role-based access control

## 📝 Editing Tips

### Hero Section

- Keep titles short and impactful
- Write descriptive button text
- Update video path to point to actual video file

### About Section

- Use compelling language
- Include 2-3 key features
- Make tagline memorable

### Services

- Keep descriptions under 150 characters
- Use action-oriented language
- Ensure clarity for all service types

### Core Values

- Each value should have a brief title and description
- Keep descriptions between 5-10 words
- Icons are pre-assigned and cannot be changed from admin

### Contact Info

- Always update phone and email
- Include both office locations
- Keep addresses updated
- Add social media links

## 🐛 Troubleshooting

**Problem:** Data not saving

- **Solution:** Check if LocalStorage is enabled in browser settings

**Problem:** Changes not appearing

- **Solution:** Clear browser cache and reload the page

**Problem:** Forgot password

- **Solution:** In demo mode, password is `123456`. For production, implement password reset.

**Problem:** Lost all data

- **Solution:** If you have an export file, use Import feature in Settings

## 📞 Support

For issues or questions about the admin panel:

1. Check that you're using the correct credentials
2. Ensure browser LocalStorage is enabled
3. Try a different browser
4. Export your data for backup before major changes

## 📌 Future Enhancements

Potential improvements for the admin panel:

- [ ] Backend API integration for persistent storage
- [ ] Image upload capability
- [ ] Multiple user accounts
- [ ] Content versioning/history
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Email notification on updates
- [ ] Multi-language support

---

**Version:** 1.0.0 (Beta)  
**Last Updated:** December 2025  
**Compatibility:** All modern browsers with LocalStorage support
