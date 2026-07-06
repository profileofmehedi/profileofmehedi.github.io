const fs = require('fs');
const path = require('path');

// Read data.js
const dataJsPath = path.join(__dirname, 'blog', 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// We need to evaluate the code to get the POSTS array
var POSTS;
var CATEGORIES;
eval(dataJsContent.replace('const CATEGORIES =', 'var CATEGORIES =').replace('const POSTS =', 'var POSTS ='));

const baseUrl = 'https://profileofmehedi.github.io/animated-portfolio';

// Generate sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/index.html</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/index.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

POSTS.forEach(post => {
    sitemap += `  <url>
    <loc>${baseUrl}/blog/post.html?slug=${post.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('Generated sitemap.xml');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsTxt);
console.log('Generated robots.txt');
