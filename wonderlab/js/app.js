/**
 * WonderLab - Application Master Initializer
 */

$(document).ready(function () {
  // 1. Theme Setup (Dark / Light)
  const savedTheme = StorageManager.get('theme', 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  $('#theme-toggle-btn').on('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    StorageManager.set('theme', nextTheme);
    updateThemeIcon(nextTheme);
  });

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    if (theme === 'light') {
      btn.innerHTML = `<i data-lucide="moon" style="width:20px;height:20px;"></i>`;
    } else {
      btn.innerHTML = `<i data-lucide="sun" style="width:20px;height:20px;"></i>`;
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  // 2. Mobile Nav Drawer Toggle
  $('#mobile-nav-toggle-btn').on('click', function () {
    $('.nav-menu').toggleClass('open');
  });

  // 3. Initialize All 8 Experiences
  if (window.NameStoryExperience) NameStoryExperience.init();
  if (window.FingerprintExperience) FingerprintExperience.init();
  if (window.FriendshipExperience) FriendshipExperience.init();
  if (window.LifeTimelineExperience) LifeTimelineExperience.init();
  if (window.QuoteCardExperience) QuoteCardExperience.init();
  if (window.NameLanguagesExperience) NameLanguagesExperience.init();
  if (window.PosterStudioExperience) PosterStudioExperience.init();
  if (window.PortfolioExperience) PortfolioExperience.init();

  // 4. Initialize Router
  if (window.Router) Router.init();

  // 5. Initialize 3D Card Tilt Effects
  if (window.AnimationEngine) AnimationEngine.initTiltEffects();

  // 6. Global Result Modal Handlers
  $('.modal-close-btn, .modal-overlay').on('click', function (e) {
    if (e.target === this) {
      $('.modal-overlay').removeClass('active');
    }
  });

  // 7. Privacy & Storage Reset Button
  $('#reset-data-btn').on('click', function () {
    if (confirm('আপনি কি নিশ্চিত যে আপনার ব্রাউজারে সংরক্ষিত WonderLab-এর সকল লোকাল ডেটা মুছে ফেলতে চান?')) {
      StorageManager.clearAllUserData();
      Utils.showToast('সকল লোকাল ডেটা সফলভাবে মুছে ফেলা হয়েছে!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  // 8. Lucide Icons Initial Call
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
});
