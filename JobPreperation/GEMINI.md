# Project: Senior Software Engineer Interview Prep

## Tech Stack
- **Frontend**: HTML5, Bootstrap 5 (CDN), jQuery (CDN)
- **Architecture**: Modular "Shell" Pattern (Dynamic Layout Injection)
- **Styling**: Custom CSS with CSS Variables for Theme Support (Light/Dark)
- **Data**: Static JSON-based content in `assets/js/data.js`
- **Theme**: Bangladeshi Flag Palette (Bottle Green: `#006a4e`, Red: `#f42a41`)

## Foundational Mandates
- **Patriotic Aesthetic**: Always maintain the Bangladeshi Flag color scheme for accents, progress bars, and active states.
- **Modular Integrity**: Layout components (Navbar, Sidebar) must be managed through `assets/js/app.js` and injected into `#nav-container` and `#sidebar-container`. Never hardcode navigation into individual pages.
- **Resource Depth**: The "ASP.NET Core & C#" category is the flagship resource; maintain its quality and ensure it scales to at least 100 deep-dive questions.
- **Performance**: Use CSS animations (`fade-in-up`) for all content transitions to maintain a high-end, modern feel.

## Engineering Standards
- **Folder Structure**:
    - `/` (Root): Dashboard (`index.html`)
    - `/pages/`: Category-specific HTML files.
    - `/assets/js/`: Data (`data.js`) and Logic (`app.js`).
    - `/assets/css/`: Professional styles (`styles.css`).
- **State Persistence**: Theme (Light/Dark), Sidebar state (Collapsed/Expanded), and Note Mastery must be persisted in `localStorage`.
- **Responsive Design**: The sidebar must remain fixed on desktop (collapsible to 80px) and transition to a Bootstrap Offcanvas on mobile devices (< 992px).
- **Code Presentation**: Technical answers must include syntax-highlighted blocks (using `<pre><code>`) with professional dark backgrounds for maximum readability.
