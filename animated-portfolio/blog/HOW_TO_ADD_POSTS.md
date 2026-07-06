# How to Add a New Blog Post to CodingDrop

This document provides step-by-step instructions for adding new articles to the dynamic dev blog. Use this reference whenever you need to add a new post.

---

## 📁 File & Folder Structure

All blog posts are driven dynamically by JavaScript. Place your assets in a standalone directory named by the post slug under `blog/posts/`:

```text
animated-portfolio/
└── blog/
    ├── data.js                          # <-- Main data file (Add metadata here!)
    └── posts/
        └── <your-post-slug>/            # <-- Standalone directory for the post
            ├── post.json                # <-- Dynamic HTML content JSON file
            ├── <thumbnail>.png          # <-- Post cover/thumbnail image
            └── <document>.pdf           # <-- Any related documents/attachments (optional)
```

---

## 📝 Step-by-Step Procedure

### Step 1: Place Your Assets
1. Create a standalone folder inside `animated-portfolio/blog/posts/` named exactly after your post's slug (e.g., `blog/posts/your-post-slug/`).
2. Inside this folder, save:
   - The cover image/thumbnail.
   - Any reference attachments or PDFs.
   - A `post.json` file containing the JSON article body structure:
     ```json
     {
       "content": "<!-- HTML content of your article -->\n<p class=\"lead\">Introductory paragraph...</p>\n<h2>১. First Section</h2>\n<p>Body...</p>"
     }
     ```

### Step 2: Add the Post Object to `data.js`
Open [blog/data.js](data.js) and add a new object to the end of the `POSTS` array (without the `content` field, which now lives in `post.json`):

```javascript
    {
        id: 11, // Increment the ID sequentially
        slug: "your-post-slug", // URL-friendly name, e.g., "jwt-authentication-aspnet"
        title: "Your Post Title",
        excerpt: "A brief summary of your post to be shown on the homepage card.",
        category: "devops", // Must match one of the defined category keys (see below)
        tags: ["Tag1", "Tag2"], // Bullet tags for filtering
        date: "Jul 06, 2026", // Format: "MMM DD, YYYY"
        readTime: "8 min", // Estimated read time
        icon: "fas fa-shield-halved", // FontAwesome icon code for fallbacks
        thumbnail: "posts/your-post-slug/your-cover.png", // Path relative to blog/
        featured: false // Set to true if this is the main highlighted post
    },
```

### Step 3: Regenerate SEO Sitemap & Robots.txt
After adding the post to `data.js`, update the search engine sitemap and robots.txt files by running this command in the project root:
```bash
node generate-seo.js
```

---

## 🏷️ Available Categories

The category key in your post object must match one of the following from the `CATEGORIES` object in `data.js`:

| Key | Label | Theme Color (Dark Mode) |
|---|---|---|
| `architecture` | Architecture | Cyan (`#58e6c8`) |
| `performance` | Performance | Orange (`#fb923c`) |
| `frontend` | Front-End | Light Blue (`#38bdf8`) |
| `backend` | Back-End | Purple (`#a78bfa`) |
| `database` | Database | Green (`#4ade80`) |
| `devops` | DevOps | Pink (`#f472b6`) |

---

## 🔍 How to Verify and Test

After editing `data.js`, run this quick terminal validation to make sure there are no syntax errors (like unescaped quotes or backticks):

```powershell
node -e "var POSTS; var CATEGORIES; const fs = require('fs'); const file = fs.existsSync('blog/data.js') ? 'blog/data.js' : 'animated-portfolio/blog/data.js'; const code = fs.readFileSync(file, 'utf8').replace('const CATEGORIES =', 'var CATEGORIES =').replace('const POSTS =', 'var POSTS ='); eval(code); console.log('Syntax OK. Total posts:', POSTS.length);"
```

If it prints `Syntax OK`, the post will load automatically in:
1. The homepage grid (`blog/index.html`)
2. The detailed post reader page (`blog/post.html?slug=<your-post-slug>`)
3. The sidebar recommendation widget for relevant categories

