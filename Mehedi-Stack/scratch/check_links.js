const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'scratch') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files.`);

let totalLinks = 0;
let brokenLinks = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relFile = path.relative(rootDir, file);
  const dir = path.dirname(file);

  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    // Ignore external links, mailto, tel, javascript, or pure hashes
    if (href.startsWith('http://') || href.startsWith('https://') || 
        href.startsWith('mailto:') || href.startsWith('tel:') || 
        href.startsWith('javascript:') || href.startsWith('#') || href === '') {
      continue;
    }

    totalLinks++;
    const [cleanPath, hash] = href.split('#');
    if (!cleanPath) continue; // It was just #something

    const targetPath = path.resolve(dir, cleanPath);
    if (!fs.existsSync(targetPath)) {
      console.error(`[BROKEN LINK] in ${relFile} -> "${href}" (resolved to: ${targetPath})`);
      brokenLinks++;
    }
  }
});

console.log(`\nScan complete: Verified ${totalLinks} internal links.`);
if (brokenLinks === 0) {
  console.log(` SUCCESS: 0 broken links! All internal links resolve cleanly.`);
} else {
  console.error(` FAILED: Found ${brokenLinks} broken links.`);
}
