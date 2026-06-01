# CareerGuide

A professional, static note-taking platform tailored for Senior Software Engineer interview preparation, specifically focused on .NET and Cloud technologies.

## 🚀 Overview

CareerGuide is designed to be a high-performance, aesthetically pleasing, and professional repository for technical notes. It features a modern Single Page Application (SPA) feel using only static technologies, making it perfect for hosting on GitHub Pages.

## ✨ Features

-   **Advanced Professional UI**: A sleek "Glassmorphism" design with a responsive sidebar and a fluid content area.
-   **Dual-State Sidebar**: Supports both desktop collapse (for focused reading) and mobile drawer modes with state persistence.
-   **Intelligent Theming**: Comprehensive Light/Dark mode with synchronized syntax highlighting for code blocks.
-   **Markdown Engine**: Built-in `marked.js` integration allows notes to be written in powerful Markdown within simple JSON data files.
-   **Developer Experience**: High-quality syntax highlighting via Prism.js and integrated copy-to-clipboard functionality.
-   **Smart Analytics**: Automatic calculation of reading time and section counts for each topic.
-   **Reading Progress**: A subtle top-mounted progress bar tracks your reading position.

## 🛠️ Tech Stack

-   **HTML5 / CSS3**: Custom styles with CSS variables and cubic-bezier transitions.
-   **Bootstrap 5**: For layout foundations and responsive components.
-   **jQuery**: Orchestrates the SPA logic, theme switching, and sidebar management.
-   **Marked.js**: Renders Markdown content dynamically.
-   **Prism.js**: Professional syntax highlighting for .NET, C#, Cloud patterns, and more.

## 📁 Project Structure

```text
CareerGuide/
├── index.html          # Main entry point (SPA shell)
├── css/
│   └── style.css       # Core styling & theme variables
├── js/
│   └── app.js          # Core logic, theme, & sidebar management
├── data/               # JSON-based Markdown notes
│   ├── dotnet.json
│   ├── cloud.json
│   └── ...
└── README.md           # Project documentation
```

## 📝 Adding New Notes

To add a new topic:
1. Create a new `.json` file in the `data/` folder following the established schema.
2. Add a new navigation item in the `index.html` sidebar with a matching `data-topic` attribute.

## 🌐 Deployment

This project is fully static. To deploy to GitHub Pages:
1. Push the code to your GitHub repository (e.g., `profileofmehedi.github.io`).
2. Ensure the "GitHub Pages" setting is pointed to the `main` branch (or `docs` folder if applicable).

---
*Prepared for Senior Software Engineer Interview Readiness.*
