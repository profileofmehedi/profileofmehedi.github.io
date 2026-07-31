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
   - A `post.json` file containing dual-language (`bn` & `en`) HTML content:
     ```json
     {
       "content": {
         "bn": "<p class=\"lead\">বাংলা ইন্ট্রোডাকশন...</p>\n<h2>১. প্রথম অংশ</h2>\n<p>মূল লেখা...</p>",
         "en": "<p class=\"lead\">English introduction...</p>\n<h2>1. First Section</h2>\n<p>Body text...</p>"
       }
     }
     ```
     *(Note: Single string `"content": "<p>...</p>"` is also supported for backward compatibility).*

### Step 2: Add the Post Object to `data.js`
Open [blog/data.js](data.js) and add a new object to the `POSTS` array:

```javascript
    {
        id: 11, // Increment the ID sequentially
        slug: "your-post-slug", // URL-friendly name
        title: {
            bn: "বাংলা টাইটেল",
            en: "English Title"
        },
        excerpt: {
            bn: "বাংলা সামারি বা সামারি প্যারাগ্রাফ...",
            en: "English excerpt summary for card preview..."
        },
        category: "devops", // Must match one of the defined category keys
        tags: ["Tag1", "Tag2"],
        date: "Jul 06, 2026",
        readTime: {
            bn: "৮ মিনিট",
            en: "8 min"
        },
        icon: "fas fa-shield-halved",
        thumbnail: "posts/your-post-slug/your-cover.png",
        featured: false
    },
```
*(Note: Simple strings for `title`, `excerpt`, and `readTime` are also supported).*

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

