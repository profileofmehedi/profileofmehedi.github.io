# Blog Integration Rules

When managing the blog posts in this workspace, future agents must adhere to the following decoupled architecture rules:

## 📁 Modular Directory Structure
Each post must live in its own standalone directory under `blog/posts/` named exactly after its unique `slug`:
```text
blog/posts/<post-slug>/
├── post.json          # Dynamic HTML body (JSON format: { "content": "..." })
├── thumbnail.png      # Cover image
└── attachment.pdf     # Reference downloads/attachments (optional)
```

## 📝 Metadata & Data Binding
*   **Metadata Array:** Post meta (title, date, excerpt, slug, category, tags, readTime, icon, thumbnail) resides in [blog/data.js](file:///c:/MyDrive/Projects/profileofmehedi.github.io/animated-portfolio/blog/data.js).
*   **No Inline Content:** Do **NOT** add the `content` key to [blog/data.js](file:///c:/MyDrive/Projects/profileofmehedi.github.io/animated-portfolio/blog/data.js) object.
*   **Asset Paths:** Set `thumbnail` paths inside `data.js` to: `posts/<post-slug>/<image-name>`.

## ⚙️ Build Process
After adding or editing any post metadata in `data.js`, always run the SEO builder script in the project root:
```bash
node generate-seo.js
```
This updates [sitemap.xml](file:///c:/MyDrive/Projects/profileofmehedi.github.io/animated-portfolio/sitemap.xml) and [robots.txt](file:///c:/MyDrive/Projects/profileofmehedi.github.io/animated-portfolio/robots.txt).
