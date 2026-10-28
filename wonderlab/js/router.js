/**
 * WonderLab - Client-Side Hash Router
 * Smoothly switches views, updates titles, and activates experiences.
 */

const Router = (function () {
  const routes = {
    '': { viewId: 'view-landing', title: 'WonderLab — Interactive Experience Studio' },
    '#home': { viewId: 'view-landing', title: 'WonderLab — Interactive Experience Studio' },
    '#name-story': { viewId: 'view-name-story', title: 'My Name Story — WonderLab', exp: 'NameStoryExperience' },
    '#fingerprint': { viewId: 'view-fingerprint', title: 'Digital Fingerprint — WonderLab', exp: 'FingerprintExperience' },
    '#friendship': { viewId: 'view-friendship', title: 'Friendship Challenge — WonderLab', exp: 'FriendshipExperience' },
    '#life-timeline': { viewId: 'view-life-timeline', title: 'Life in Weeks — WonderLab', exp: 'LifeTimelineExperience' },
    '#quote-card': { viewId: 'view-quote-card', title: 'My Quote Card — WonderLab', exp: 'QuoteCardExperience' },
    '#name-languages': { viewId: 'view-name-languages', title: 'Name in Different Languages — WonderLab', exp: 'NameLanguagesExperience' },
    '#poster-studio': { viewId: 'view-poster-studio', title: 'Bangla Poster Studio — WonderLab', exp: 'PosterStudioExperience' },
    '#portfolio': { viewId: 'view-portfolio', title: 'One-Minute Portfolio — WonderLab', exp: 'PortfolioExperience' },
    '#about': { viewId: 'view-about', title: 'About & Privacy — WonderLab' }
  };

  const handleRoute = () => {
    let hash = window.location.hash || '';

    // Handle query params attached to hash like #friendship?quiz=...
    let cleanHash = hash;
    if (cleanHash.includes('?')) {
      cleanHash = cleanHash.split('?')[0];
    }

    const route = routes[cleanHash] || routes[''];

    // Update active view
    $('.view-section').removeClass('active');
    const $targetView = $(`#${route.viewId}`);
    if ($targetView.length) {
      $targetView.addClass('active');
    } else {
      $('#view-landing').addClass('active');
    }

    // Update document title
    document.title = route.title;

    // Update Navbar active link
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="${cleanHash || '#home'}"]`).addClass('active');

    // Close mobile nav drawer if open
    $('.nav-menu').removeClass('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh lucide icons if present
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    // Call update on experience if available
    if (route.exp && window[route.exp] && typeof window[route.exp].update === 'function') {
      window[route.exp].update();
    }
  };

  return {
    init: function () {
      window.addEventListener('hashchange', handleRoute);
      handleRoute();
    },

    navigate: function (hash) {
      window.location.hash = hash;
    }
  };
})();

window.Router = Router;
