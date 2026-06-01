# CareerGuide - Project Instructions

## 🎯 Architectural Intent
CareerGuide is a robust Multi-Page Application (MPA) designed for zero-configuration usage and maximum reliability. By using separate HTML files for each topic, the site avoids CORS issues when opened locally (`file://`) and remains highly maintainable as a collection of static assets.

## 🛠️ Tech Stack & Conventions
- **Language**: Vanilla JS (ES6+), jQuery 3.7+
- **Structure**: Each topic has its own standalone `.html` file.
- **Styling**: Bootstrap 5 + Custom CSS with CSS Variables.
- **Naming Convention**: Use kebab-case for filenames (e.g., `system-design.html`).

## 🎨 Visual Identity
- **Glassmorphism**: Consistent blur effects across all pages.
- **Typography**: 'Inter' font stack with premium gradient titles.
- **Dark Mode**: High-contrast slate theme with persistent state in `localStorage`.

## 📋 File structure
- `index.html`: Welcome & Dashboard
- `dotnet.html`: .NET & C# Notes
- `cloud.html`: Azure & Cloud Notes
- `system-design.html`: Architecture Notes
- `patterns.html`: Design Patterns Notes

## 🔄 Core Workflows
- **Theme Sync**: Shared logic in `app.js` ensures theme persistence across page navigations.
- **Sidebar States**: Collapsed/Expanded state is remembered via `localStorage`.
- **Search**: Real-time filtering of both the sidebar and the current page's content sections.

## 🚀 Deployment
Deploy by pushing the root directory directly to the GitHub repository `profileofmehedi.github.io`.
