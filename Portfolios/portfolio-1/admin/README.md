# Admin Panel Documentation

## Overview

The refactored admin panel is now organized into separate, modular files for managing different sections of your portfolio website. Each section has its own dedicated page for better organization and maintainability.

## Folder Structure

```
admin/
├── index.html              # Main admin dashboard
├── js/
│   └── shared.js          # Shared utilities and data management
└── pages/
    ├── hero.html          # Hero section editor
    ├── portfolio.html     # Portfolio items manager
    ├── services.html      # Services manager
    ├── skills.html        # Skills manager
    ├── testimonials.html  # Testimonials manager
    ├── blog.html          # Blog posts manager
    ├── faq.html           # FAQ items manager
    ├── about.html         # About section editor
    ├── contact.html       # Contact information editor
    └── process.html       # Design process manager
```

## Features

### Main Dashboard (index.html)

- **Statistics Overview**: View counts of all content items
- **Quick Navigation**: Easy access to all management pages via cards
- **Sidebar Menu**: Fast navigation between sections
- **Data Reset**: Option to reset all data to defaults

### Modular Pages

#### 1. **Hero Section** (`pages/hero.html`)

- Edit main title and subtitle
- Real-time localStorage sync
- Simple, focused interface

#### 2. **Portfolio** (`pages/portfolio.html`)

- Add/delete portfolio items
- Set project title, category, icon, and color
- Visual list view with quick delete option

#### 3. **Services** (`pages/services.html`)

- Add/delete services
- Include title, description, and icon
- Manage your service offerings

#### 4. **Skills** (`pages/skills.html`)

- Add/delete skills
- Set proficiency percentage (0-100)
- Visual progress bar display

#### 5. **Testimonials** (`pages/testimonials.html`)

- Add/delete client testimonials
- Include text, author name, and position
- Star rating system support

#### 6. **Blog** (`pages/blog.html`)

- Add/delete blog posts
- Set title, category, date, and icon
- Manage your content calendar

#### 7. **FAQ** (`pages/faq.html`)

- Add/delete FAQ items
- Include question and detailed answers
- Accordion-style display on main site

#### 8. **About** (`pages/about.html`)

- Edit about section title and description
- More detailed content management
- Multiple paragraph support

#### 9. **Contact** (`pages/contact.html`)

- Update phone, email, and location
- All contact information in one place
- Easy to maintain

#### 10. **Process** (`pages/process.html`)

- Add/delete process steps
- Auto-numbered steps
- Include title and description for each

## How to Use

### Accessing the Admin Panel

1. Open `admin/index.html` in your browser
2. Use the sidebar to navigate to different sections
3. Each page handles one specific area of content

### Adding Content

1. Navigate to the desired section
2. Click "Add New" button
3. Fill in the form fields
4. Click "Add Item" to save
5. Changes are automatically saved to localStorage

### Editing Content

- Most sections allow deletion of items
- To edit existing items, delete and re-add with new content
- All changes persist in localStorage

### Data Persistence

- All data is saved to browser's localStorage
- Data persists across sessions
- Use "Reset Data" button to restore defaults
- Backup your localStorage data periodically

## Shared Data Management (`js/shared.js`)

This file contains:

- **Default Data Structure**: All default portfolio content
- **Load/Save Functions**: localStorage management
- **Utility Functions**: Alert notifications and data helpers
- **Global Data Object**: `portfolioData` - accessible across all pages

### Key Functions:

```javascript
loadData(); // Load from localStorage
saveData(data); // Save to localStorage
showAlert(msg); // Display notification
getDefaultData(); // Return default data structure
```

## Integration with Main Site

The main `index.html` automatically reads from the same localStorage:

- Any changes made in admin are immediately reflected on the live site
- No server/backend required
- Pure client-side data management

## Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- No additional dependencies beyond Bootstrap and jQuery

## Best Practices

1. **Regular Backups**: Export localStorage data regularly
2. **Consistent Naming**: Use clear, descriptive names for content
3. **Icon Names**: Use Font Awesome icon names (with or without 'fa-' prefix)
4. **Content Length**: Keep descriptions concise
5. **Date Format**: Use consistent date formatting (e.g., "Jan 15, 2024")

## Troubleshooting

### Data Not Saving

- Check if localStorage is enabled in browser
- Ensure you're not in private/incognito mode
- Clear browser cache and reload

### Missing Content

- Check that fields are filled before saving
- Verify localStorage isn't full (>5MB)
- Try resetting data and re-adding

### Styling Issues

- Ensure Bootstrap CDN is accessible
- Check browser console for errors
- Clear browser cache

## Future Enhancements

Possible improvements:

- Image upload functionality
- Rich text editor for descriptions
- Drag-and-drop reordering
- Multi-language support
- Data export/import feature
- Backend API integration

## Support

For issues or questions:

1. Check browser console for error messages
2. Verify all CDN links are accessible
3. Clear browser cache and localStorage
4. Test in different browser
