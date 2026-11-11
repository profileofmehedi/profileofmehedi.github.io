const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const filesToProcess = [
  { file: 'index.html', active: 'home' },
  { file: 'courses.html', active: 'courses' },
  { file: 'course-details.html', active: 'courses' },
  { file: 'dashboard.html', active: 'dashboard' },
  { file: 'dotnet-enterprise.html', active: 'courses' },
  { file: 'database-mastery.html', active: 'courses' },
  { file: 'frontend-mastery.html', active: 'courses' },
  { file: 'system-design.html', active: 'courses' },
  { file: 'server-devops.html', active: 'courses' },
  { file: 'blog.html', active: 'courses' },
  { file: 'profile.html', active: 'dashboard' },
  { file: 'achievement.html', active: 'dashboard' },
  { file: 'about.html', active: 'home' }
];

function getNavHtml(active) {
  return `
        <!-- Floating Back To Top Button -->
        <button id="btnBackToTop" class="floating-back-to-top" title="উপরে যান">
            <i class="bi bi-arrow-up"></i>
        </button>

        <!-- Mobile App Bottom Navigation Bar (Handheld Phone UX) -->
        <div class="mobile-bottom-nav">
            <a href="index.html" class="mobile-nav-link ${active === 'home' ? 'active' : ''}">
                <i class="bi bi-house-door"></i>
                <span>হোম</span>
            </a>
            <a href="courses.html" class="mobile-nav-link ${active === 'courses' ? 'active' : ''}">
                <i class="bi bi-grid"></i>
                <span>ট্র্যাকসমূহ</span>
            </a>
            <a href="senior-interview-vault.html" class="mobile-nav-link ${active === 'interview' ? 'active' : ''}">
                <i class="bi bi-trophy-fill"></i>
                <span>ইন্টারভিউ</span>
            </a>
            <a href="dashboard.html" class="mobile-nav-link ${active === 'dashboard' ? 'active' : ''}">
                <i class="bi bi-speedometer2"></i>
                <span>ড্যাশবোর্ড</span>
            </a>
            <label for="theme-toggle" class="mobile-nav-link cursor-pointer m-0">
                <i class="bi bi-moon-stars"></i>
                <span>থিম</span>
            </label>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const btn = document.getElementById('btnBackToTop');
                if (btn) {
                    window.addEventListener('scroll', function() {
                        if (window.scrollY > 300) {
                            btn.classList.add('visible');
                        } else {
                            btn.classList.remove('visible');
                        }
                    });
                    btn.addEventListener('click', function() {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
            });
        </script>
`;
}

filesToProcess.forEach(({ file, active }) => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing file: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already injected
  if (content.includes('mobile-bottom-nav')) {
    console.log(`Already has mobile-bottom-nav: ${file}`);
    return;
  }

  const navHtml = getNavHtml(active);

  // If there is an app-container closing div, insert right before </div>\n</body> or right before </body>
  if (content.includes('</body>')) {
    content = content.replace('</body>', `${navHtml}\n</body>`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully injected mobile nav into: ${file}`);
  } else {
    console.log(`No </body> tag found in: ${file}`);
  }
});
