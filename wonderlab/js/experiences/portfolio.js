/**
 * Experience 8: One-Minute Portfolio (ওয়ান-মিনিট পোর্টফোলিও)
 * Instant portfolio builder with live preview, standalone HTML download, and summary card export.
 */

const PortfolioExperience = (function () {
  let portfolioData = {
    name: 'Mehedi Hasan',
    title: 'Full Stack Engineer & Creative Designer',
    bio: 'আমি প্রযুক্তির মাধ্যমে মানুষের জীবনকে সহজ এবং সুন্দর করতে ভালোবাসি। আধুনিক ওয়েব অ্যাপ্লিকেশন ও ইউজার এক্সপেরিয়েন্স তৈরিতে আমার বিশেষ আগ্রহ।',
    email: 'hello@mehedi.dev',
    github: 'https://github.com/profileofmehedi',
    linkedin: 'https://linkedin.com/in/mehedi',
    theme: 'theme-neo',
    avatar: '',
    skills: ['JavaScript', 'HTML5/CSS3', 'React', 'Node.js', 'UI/UX Design', 'Git & CI/CD'],
    projects: [
      {
        title: 'WonderLab Experience Studio',
        desc: 'একটি ইন্টারেক্টিভ পার্সোনাল এক্সপেরিয়েন্স প্ল্যাটফর্ম, যেখানে ব্যবহারকারীরা ক্রিয়েটিভ আর্টওয়ার্ক জেনারেট করতে পারেন।',
        tech: 'HTML5, CSS3, JavaScript, Canvas',
        link: 'https://github.com/profileofmehedi/wonderlab'
      },
      {
        title: 'Bill Collection App',
        desc: 'ব্যবসায়িক ক্লায়েন্ট এবং বিল কালেকশন ট্র্যাকিং করার আধুনিক মোবাইল ও ড্যাশবোর্ড সল্যুশন।',
        tech: 'Android, Kotlin, SQLite',
        link: '#'
      }
    ],
    education: {
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'University of Engineering and Technology',
      year: '2023'
    }
  };

  /**
   * Render portfolio preview inside app
   */
  const renderPreview = () => {
    const container = document.getElementById('portfolio-preview-box');
    if (!container) return;

    // Apply theme class
    container.className = `portfolio-preview-box portfolio-${portfolioData.theme}`;

    // Avatar
    const avatarEl = container.querySelector('.portfolio-avatar');
    if (avatarEl) {
      if (portfolioData.avatar) {
        avatarEl.innerHTML = `<img src="${portfolioData.avatar}" alt="${Utils.escapeHTML(portfolioData.name)}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
      } else {
        avatarEl.textContent = (portfolioData.name || 'M').charAt(0).toUpperCase();
      }
    }

    // Name & Title
    const nameEl = container.querySelector('.portfolio-name-disp');
    if (nameEl) nameEl.textContent = portfolioData.name || 'আপনার নাম';

    const titleEl = container.querySelector('.portfolio-title-disp');
    if (titleEl) titleEl.textContent = portfolioData.title || 'পেশাগত উপাধি';

    // Bio
    const bioEl = container.querySelector('.portfolio-bio-disp');
    if (bioEl) bioEl.textContent = portfolioData.bio || 'আপনার সংক্ষিপ্ত পরিচয়...';

    // Skills
    const skillsEl = container.querySelector('.portfolio-skills-pills');
    if (skillsEl) {
      skillsEl.innerHTML = portfolioData.skills.map(s => `
        <span class="portfolio-skill-tag">${Utils.escapeHTML(s.trim())}</span>
      `).join('');
    }

    // Projects
    const projectsEl = container.querySelector('.portfolio-projects-disp');
    if (projectsEl) {
      projectsEl.innerHTML = portfolioData.projects.map(p => `
        <div class="portfolio-project-card">
          <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">${Utils.escapeHTML(p.title)}</div>
          <p style="font-size:0.88rem; opacity:0.85; margin-bottom:0.5rem;">${Utils.escapeHTML(p.desc)}</p>
          <div style="font-size:0.78rem; opacity:0.7;"><strong>টুলস:</strong> ${Utils.escapeHTML(p.tech)}</div>
        </div>
      `).join('');
    }

    // Education
    const eduEl = container.querySelector('.portfolio-edu-disp');
    if (eduEl) {
      eduEl.innerHTML = `
        <div style="font-weight:600; font-size:0.95rem;">${Utils.escapeHTML(portfolioData.education.degree)}</div>
        <div style="font-size:0.85rem; opacity:0.8;">${Utils.escapeHTML(portfolioData.education.institution)} (${Utils.escapeHTML(portfolioData.education.year)})</div>
      `;
    }

    // Contacts
    const contactEl = container.querySelector('.portfolio-contact-disp');
    if (contactEl) {
      contactEl.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:1rem; font-size:0.85rem; margin-top:0.5rem;">
          ${portfolioData.email ? `<span>✉️ ${Utils.escapeHTML(portfolioData.email)}</span>` : ''}
          ${portfolioData.github ? `<span>🐙 GitHub</span>` : ''}
          ${portfolioData.linkedin ? `<span>💼 LinkedIn</span>` : ''}
        </div>
      `;
    }
  };

  /**
   * Generate complete standalone downloadable single-page HTML website
   */
  const generateStandaloneHTML = () => {
    const safeName = Utils.escapeHTML(portfolioData.name);
    const safeTitle = Utils.escapeHTML(portfolioData.title);
    const safeBio = Utils.escapeHTML(portfolioData.bio);
    const safeEmail = Utils.escapeHTML(portfolioData.email);

    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Hind Siliguri', 'Inter', sans-serif;
      background-color: #0d1117;
      color: #f0f6fc;
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .wrapper { max-width: 860px; margin: 0 auto; }
    .card {
      background: rgba(22, 27, 34, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .hero { text-align: center; margin-bottom: 2rem; }
    .avatar {
      width: 110px; height: 110px; border-radius: 50%;
      background: #8b5cf6; display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; font-weight: 800; color: #fff; margin: 0 auto 1.5rem;
      border: 4px solid #6366f1;
    }
    h1 { font-size: 2.4rem; font-weight: 800; margin-bottom: 0.4rem; color: #ffffff; }
    .title { font-size: 1.15rem; color: #a78bfa; margin-bottom: 1rem; }
    .bio { font-size: 1rem; color: #8b949e; max-width: 600px; margin: 0 auto 1.5rem; }
    h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; color: #58a6ff; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; }
    .skill-pill { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); padding: 5px 12px; border-radius: 99px; font-size: 0.85rem; font-weight: 600; }
    .project-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
    .project-title { font-size: 1.1rem; font-weight: 700; color: #f0f6fc; }
    .project-desc { font-size: 0.92rem; color: #8b949e; margin-top: 0.3rem; }
    .project-tech { font-size: 0.8rem; color: #a78bfa; margin-top: 0.5rem; font-weight: 600; }
    .footer { text-align: center; font-size: 0.85rem; color: #8b949e; margin-top: 3rem; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="hero">
        <div class="avatar">${portfolioData.avatar ? `<img src="${portfolioData.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : safeName.charAt(0)}</div>
        <h1>${safeName}</h1>
        <div class="title">${safeTitle}</div>
        <p class="bio">${safeBio}</p>
        <div style="display:flex; justify-content:center; gap:1.5rem; font-size:0.95rem;">
          ${safeEmail ? `<span>✉️ <a href="mailto:${safeEmail}" style="color:#58a6ff; text-decoration:none;">${safeEmail}</a></span>` : ''}
          ${portfolioData.github ? `<span>🐙 <a href="${Utils.escapeHTML(portfolioData.github)}" target="_blank" style="color:#58a6ff; text-decoration:none;">GitHub</a></span>` : ''}
          ${portfolioData.linkedin ? `<span>💼 <a href="${Utils.escapeHTML(portfolioData.linkedin)}" target="_blank" style="color:#58a6ff; text-decoration:none;">LinkedIn</a></span>` : ''}
        </div>
      </div>

      <h2>দক্ষতা ও প্রযুক্তি (Skills)</h2>
      <div class="skills-grid">
        ${portfolioData.skills.map(s => `<span class="skill-pill">${Utils.escapeHTML(s.trim())}</span>`).join('')}
      </div>

      <h2>প্রজেক্ট সমূহ (Featured Projects)</h2>
      ${portfolioData.projects.map(p => `
        <div class="project-card">
          <div class="project-title">${Utils.escapeHTML(p.title)}</div>
          <div class="project-desc">${Utils.escapeHTML(p.desc)}</div>
          <div class="project-tech">Tech Stack: ${Utils.escapeHTML(p.tech)}</div>
        </div>
      `).join('')}

      <h2>শিক্ষাগত যোগ্যতা (Education)</h2>
      <div style="font-weight:600;">${Utils.escapeHTML(portfolioData.education.degree)}</div>
      <div style="font-size:0.88rem; color:#8b949e;">${Utils.escapeHTML(portfolioData.education.institution)} — ${Utils.escapeHTML(portfolioData.education.year)}</div>
    </div>

    <div class="footer">
      Built with <strong>WonderLab</strong> Personal Experience Studio.
    </div>
  </div>
</body>
</html>`;
  };

  return {
    init: function () {
      const $form = $('#portfolio-form');
      if (!$form.length) return;

      // Inputs
      $('#pf-name-input').on('input', function () {
        portfolioData.name = $(this).val();
        renderPreview();
      });

      $('#pf-title-input').on('input', function () {
        portfolioData.title = $(this).val();
        renderPreview();
      });

      $('#pf-bio-input').on('input', function () {
        portfolioData.bio = $(this).val();
        renderPreview();
      });

      $('#pf-email-input').on('input', function () {
        portfolioData.email = $(this).val();
        renderPreview();
      });

      $('#pf-skills-input').on('input', function () {
        const val = $(this).val();
        portfolioData.skills = val.split(',').filter(s => s.trim().length > 0);
        renderPreview();
      });

      // Photo upload
      $('#pf-photo-upload').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            portfolioData.avatar = evt.target.result;
            renderPreview();
            Utils.showToast('প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });

      // Theme pills
      $('.pf-theme-pill').on('click', function () {
        $('.pf-theme-pill').removeClass('active');
        $(this).addClass('active');
        portfolioData.theme = $(this).data('theme');
        renderPreview();
      });

      // Export Standalone HTML button
      $('#pf-export-html-btn').on('click', function () {
        const html = generateStandaloneHTML();
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const filename = `${(portfolioData.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
        Utils.downloadFile(blob, filename);
        Utils.showToast('সম্পূর্ণ ওয়েবসাইট ফাইল (HTML) ডাউনলোড হয়েছে! 🎉', 'success');
        AnimationEngine.celebrate();
      });

      // Download summary image
      $('#pf-download-img-btn').on('click', async function () {
        const box = document.getElementById('portfolio-preview-box');
        await ImageExporter.exportElementToPNG(box, {
          filename: `portfolio-summary-${(portfolioData.name || 'card').toLowerCase()}.png`
        });
      });

      // Copy Markdown / text resume
      $('#pf-copy-text-btn').on('click', function () {
        const md = `# ${portfolioData.name}
**${portfolioData.title}**

${portfolioData.bio}

### Skills:
${portfolioData.skills.join(', ')}

### Projects:
${portfolioData.projects.map(p => `- **${p.title}**: ${p.desc} (${p.tech})`).join('\n')}

### Contact:
- Email: ${portfolioData.email}
- GitHub: ${portfolioData.github}
`;
        Utils.copyToClipboard(md, 'পোর্টফোলিও সারসংক্ষেপ কপি করা হয়েছে!');
      });

      renderPreview();
    },

    update: renderPreview
  };
})();

window.PortfolioExperience = PortfolioExperience;
