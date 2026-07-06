# How to Add a New Blog Post to CodingDrop

This document provides step-by-step instructions for adding new articles to the dynamic dev blog. Use this reference whenever you need to add a new post.

---

## 📁 File & Folder Structure

All blog posts are driven dynamically by JavaScript. Place your assets according to this structure:

```text
animated-portfolio/
└── blog/
    ├── data.js                          # <-- Main data file (Add post object here!)
    └── posts/
        └── <category>/
            └── <post-folder>/
                ├── <image>.png          # <-- Place post thumbnail/images here
                └── <source-document>    # <-- Put reference PDFs/documents here (optional)
```

---

## 📝 Step-by-Step Procedure

### Step 1: Place Your Assets
1. Create a subfolder inside `animated-portfolio/blog/posts/` organized by category.
2. Put the cover image/thumbnail (and any other inline images/source files) inside that folder.
   - Example: `animated-portfolio/blog/posts/server/cloudflare-1/cloud-flare-blog-1.png`

### Step 2: Add the Post Object to `data.js`
Open [blog/data.js](file:///e:/Mehedi/Projects/profileofmehedi.github.io/animated-portfolio/blog/data.js) and add a new object to the end of the `POSTS` array:

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
        thumbnail: "posts/your-category-folder/your-post-folder/your-cover.png", // Path relative to blog/
        featured: false, // Set to true if this is the main highlighted post
        content: `
<!-- Add Cover Image at the top of content -->
<img src="posts/your-category-folder/your-post-folder/your-cover.png" alt="Cover Description" style="width:100%;border-radius:12px;margin-bottom:32px;display:block;box-shadow:0 8px 32px rgba(0,0,0,0.3);">

<!-- Use <p class="lead"> for the intro paragraph -->
<p class="lead">Introductory paragraph in Bengali or English...</p>

<!-- Use <h2> for section headers -->
<h2>১. First Section Heading</h2>
<p>Content goes here...</p>

<!-- Use <ul> / <li> for bullet lists -->
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<!-- Use <pre><code> for code blocks -->
<pre><code>// C# or JavaScript code block here
public void Configure() 
{
    // ...
}</code></pre>

<!-- Add Tag Hashtags at the end of the content -->
<p style="margin-top:24px; padding: 16px 20px; background: rgba(244,114,182,0.08); border-left: 3px solid rgba(244,114,182,0.5); border-radius: 8px; font-size: 0.9rem; color: var(--text-secondary);">
  <i class="fas fa-hashtag" style="color: #f472b6; margin-right: 6px;"></i>
  <strong style="color: var(--text-primary);">Tags:</strong> #Tag1 #Tag2 #SystemDesign
</p>
        `
    },
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
node -e "const fs = require('fs'); const code = fs.readFileSync('animated-portfolio/blog/data.js', 'utf8'); eval(code); console.log('Syntax OK. Total posts:', POSTS.length);"
```

If it prints `Syntax OK`, the post will load automatically in:
1. The homepage grid (`blog/index.html`)
2. The detailed post reader page (`blog/post.html?id=<your-new-id>`)
3. The sidebar recommendation widget for relevant categories
