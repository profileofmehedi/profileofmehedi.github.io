# Project: Senior Software Engineer Interview Prep

## Tech Stack
- **Frontend**: HTML5, Bootstrap 5 (CDN), jQuery (CDN)
- **Architecture**: Modular "Shell" Pattern (Dynamic Layout Injection)
- **Styling**: Custom CSS with CSS Variables for Theme Support (Light/Dark)
- **Data**: Massive JSON-based content in `assets/js/data.js` (~400 Expert Notes)
- **Theme**: Bangladeshi Flag Palette (Bottle Green: `#006a4e`, Red: `#f42a41`)

## Foundational Mandates
- **Patriotic Aesthetic**: Always maintain the Bangladeshi Flag color scheme for accents, progress bars, and active states.
- **Modular Integrity**: Layout components (Navbar, Sidebar) must be managed through `assets/js/app.js` and injected into `#nav-container` and `#sidebar-container`. Never hardcode navigation into individual pages.
- **Resource Depth**: Maintain a minimum of 100 high-quality, descriptive questions per category (ASP.NET Core, Databases, Frontend, Cloud & DevOps).
- **Performance**: Use hardware-accelerated CSS animations (`fade-in-up`) for content transitions and ensure the search functionality is optimized for large DOM sets.

## Engineering Standards
- **Folder Structure**:
    - `/` (Root): Dashboard (`index.html`)
    - `/pages/`: Category-specific HTML files.
    - `/assets/js/`: Data (`data.js`) and Shared Logic (`app.js`).
    - `/assets/css/`: Professional styles (`styles.css`).
- **State Persistence**: 
    - Theme preference (Light/Dark).
    - Sidebar state (Collapsed/Expanded).
    - Note Mastery (Checkmarks/Progress).
    - All state must be persisted in `localStorage`.
- **Responsive Design**: 
    - Desktop: Fixed sidebar (Width: 280px) with collapsible functionality (Collapse to 80px).
    - Tablet/Mobile: Bootstrap Offcanvas menu for navigation.
    - Containerization: Use `.dashboard-wrapper` or similar classes to prevent layout stretching on ultra-wide screens.
- **Code Presentation**: Technical answers must include syntax-highlighted blocks (using `<pre><code>`) with professional dark backgrounds (`--code-bg`) for maximum readability.
- **Content Quality**: Answers must be descriptive, utilizing bullet points for readability, and include "Senior Insights" or "Scalability" context.
