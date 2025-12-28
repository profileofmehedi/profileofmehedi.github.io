/**
* Template Main JS File
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Detect icon font availability (Remix Icon). If unavailable (common on some hosts),
   * enable a CSS fallback that draws the hamburger/cross via pseudo-elements.
   */
  const detectIconFontAvailability = () => {
    const enableFallback = () => {
      try { document.documentElement.classList.add('icons-fallback') } catch (_) {}
    }
    try {
      if (document.fonts && typeof document.fonts.check === 'function') {
        // Wait for font set readiness, then check if remixicon really loaded
        document.fonts.ready.then(() => {
          const ok = document.fonts.check('16px remixicon')
          if (!ok) enableFallback()
        }).catch(enableFallback)
      } else {
        // Heuristic probe
        const probe = document.createElement('i')
        probe.className = 'ri-close-line'
        probe.style.position = 'absolute'
        probe.style.visibility = 'hidden'
        probe.style.pointerEvents = 'none'
        document.body.appendChild(probe)
        const fam = window.getComputedStyle(probe).getPropertyValue('font-family') || ''
        document.body.removeChild(probe)
        if (!/remixicon/i.test(fam)) enableFallback()
      }
    } catch (e) {
      enableFallback()
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectIconFontAvailability)
  } else {
    detectIconFontAvailability()
  }

  /**
   * Consolidated scroll handler for header and navbar functionality
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  let lastScrollTop = 0
  let scrollThreshold = 50
  
  if (selectHeader) {
    const consolidatedScrollHandler = () => {
      const scrollTop = window.scrollY
      
      // Header scrolled class toggle
      if (scrollTop > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
      }
      
      // Mobile topbar auto-hide on scroll (only on mobile)
      if (window.innerWidth <= 991.98 && selectTopbar) {
        if (scrollTop > scrollThreshold) {
          if (scrollTop > lastScrollTop) {
            // Scrolling down - hide topbar
            selectTopbar.classList.add('mobile-hidden')
            selectHeader.style.top = '0px'
          } else {
            // Scrolling up - show topbar
            selectTopbar.classList.remove('mobile-hidden')
            selectHeader.style.top = '35px'
          }
        } else {
          // At top - always show topbar
          selectTopbar.classList.remove('mobile-hidden')
          selectHeader.style.top = '35px'
        }
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop // For Mobile or negative scrolling
    }
    
    window.addEventListener('load', consolidatedScrollHandler)
    onscroll(document, consolidatedScrollHandler)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  // Initialize accessibility attributes for the hamburger
  const mobileNavToggleEl = select('.mobile-nav-toggle')
  if (mobileNavToggleEl) {
    mobileNavToggleEl.setAttribute('role', 'button')
    mobileNavToggleEl.setAttribute('aria-controls', 'navbar')
    mobileNavToggleEl.setAttribute('aria-expanded', 'false')
  }

  const handleMobileToggle = function(e) {
    // Support click, touchstart and keyboard activation
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()

    const navbar = select('#navbar')
    if (!navbar) return

    navbar.classList.toggle('navbar-mobile')
    this.classList.toggle('ri-menu-line')
    this.classList.toggle('ri-close-line')
    this.classList.toggle('is-open')

    const expanded = this.getAttribute('aria-expanded') === 'true'
    this.setAttribute('aria-expanded', expanded ? 'false' : 'true')
  }

  on('click', '.mobile-nav-toggle', handleMobileToggle)
  on('touchstart', '.mobile-nav-toggle', handleMobileToggle)
  on('keydown', '.mobile-nav-toggle', handleMobileToggle)

  // Mark as bound so other scripts can avoid double-binding
  window.LETMobileNavBound = true
  if (mobileNavToggleEl) {
    try { mobileNavToggleEl.dataset.letBound = '1' } catch (e) {}
  }

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      const submenu = this.nextElementSibling
      const parentLi = this.parentElement
      const isOpen = submenu.classList.contains('dropdown-active') || submenu.style.display === 'block'

      // Close any other open submenus on mobile
      const openMenus = select('.navbar .dropdown-menu.dropdown-active', true)
      openMenus.forEach(menu => {
        if (menu !== submenu) {
          menu.classList.remove('dropdown-active')
          menu.style.display = 'none'
          const toggle = menu.previousElementSibling
          if (toggle) toggle.setAttribute('aria-expanded', 'false')
          const li = menu.parentElement
          if (li) li.classList.remove('active')
        }
      })

      // Toggle current submenu
      submenu.classList.toggle('dropdown-active')
      submenu.style.display = isOpen ? 'none' : 'block'
      parentLi.classList.toggle('active', !isOpen)

      // Update aria-expanded on the toggle link
      this.setAttribute('aria-expanded', isOpen ? 'false' : 'true')
    }
  }, true)

  // Extra safety: delegated handler for mobile dropdowns in case direct binding fails on some hosts
  document.addEventListener('click', function(evt) {
    const navbar = select('#navbar')
    if (!navbar || !navbar.classList.contains('navbar-mobile')) return
    const toggle = evt.target.closest('#navbar.navbar-mobile .dropdown > a')
    if (!toggle) return
    evt.preventDefault()
    const submenu = toggle.nextElementSibling
    if (!submenu) return
    const isOpen = submenu.classList.contains('dropdown-active') || submenu.style.display === 'block'
    submenu.classList.toggle('dropdown-active')
    submenu.style.display = isOpen ? 'none' : 'block'
    const parentLi = toggle.parentElement
    if (parentLi) parentLi.classList.toggle('active', !isOpen)
    toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true')
  }, { passive: false })

  /**
   * Desktop dropdown toggle functionality
   */
  on('click', '.navbar .dropdown > a', function(e) {
    // Only handle desktop dropdowns (not mobile)
    if (!select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      
      // Close other dropdowns
      const allDropdowns = select('.navbar .dropdown', true)
      allDropdowns.forEach(dropdown => {
        if (dropdown !== this.parentElement) {
          dropdown.classList.remove('active')
        }
      })
      
      // Toggle current dropdown
      this.parentElement.classList.toggle('active')
      
      // Add focus for accessibility
      if (this.parentElement.classList.contains('active')) {
        const firstMenuItem = this.parentElement.querySelector('.dropdown-item')
        if (firstMenuItem) {
          firstMenuItem.focus()
        }
      }
    }
  }, true)

  /**
   * Close dropdown when clicking outside
   */
  document.addEventListener('click', function(e) {
    if (!select('#navbar').classList.contains('navbar-mobile')) {
      const dropdown = e.target.closest('.navbar .dropdown')
      if (!dropdown) {
        // Close all dropdowns when clicking outside
        const allDropdowns = select('.navbar .dropdown', true)
        allDropdowns.forEach(dropdown => {
          dropdown.classList.remove('active')
        })
      }
    }
  })

  /**
   * Keyboard navigation for dropdowns
   */
  document.addEventListener('keydown', function(e) {
    if (!select('#navbar').classList.contains('navbar-mobile')) {
      const activeDropdown = select('.navbar .dropdown.active')
      if (activeDropdown) {
        const menuItems = activeDropdown.querySelectorAll('.dropdown-item')
        const firstItem = menuItems[0]
        const lastItem = menuItems[menuItems.length - 1]
        
        if (e.key === 'Escape') {
          // Close dropdown on Escape
          activeDropdown.classList.remove('active')
          activeDropdown.querySelector('.dropdown-toggle').focus()
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          const focusedItem = document.activeElement
          if (focusedItem === activeDropdown.querySelector('.dropdown-toggle')) {
            firstItem.focus()
          } else {
            const currentIndex = Array.from(menuItems).indexOf(focusedItem)
            const nextItem = menuItems[currentIndex + 1] || firstItem
            nextItem.focus()
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          const focusedItem = document.activeElement
          const currentIndex = Array.from(menuItems).indexOf(focusedItem)
          const prevItem = menuItems[currentIndex - 1] || lastItem
          prevItem.focus()
        }
      }
    }
  })

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .nav-link', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('ri-menu-line')
        navbarToggle.classList.toggle('ri-close-line')
        navbarToggle.classList.toggle('is-open')
        if (navbarToggle) {
          navbarToggle.setAttribute('aria-expanded', 'false')
        }
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Hero text animation
   */
  function heroTextAnimation() {
    const heroContent = select('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate__animated', 'animate__fadeIn');
    }
  }

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
    heroTextAnimation();
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
  }

  /**
   * Animation on scroll
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Initiate Pure Counter 
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Clients Slider with fallback mechanism
   */
  function initClientSliders() {
    if (typeof Swiper !== 'undefined') {
      // Initialize Clients Slider
      try {
        new Swiper('.clients-slider', {
          speed: 4000,
          loop: true,
          loopAdditionalSlides: 1,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          },
          slidesPerView: 'auto',
          spaceBetween: 10,
          centeredSlides: false,
          allowTouchMove: true,
          grabCursor: true,
          simulateTouch: true,
          breakpoints: {
            320: {
              slidesPerView: 3,
              spaceBetween: 5
            },
            480: {
              slidesPerView: 4,
              spaceBetween: 8
            },
            640: {
              slidesPerView: 6,
              spaceBetween: 10
            },
            992: {
              slidesPerView: 8,
              spaceBetween: 10
            },
            1200: {
              slidesPerView: 10,
              spaceBetween: 10
            }
          }
        });
      } catch (error) {
        console.warn('Clients slider initialization failed:', error);
        fallbackSlider('.clients-slider');
      }

      // Initialize Partners Slider
      try {
        new Swiper('.partners-slider', {
          speed: 4500,
          loop: true,
          loopAdditionalSlides: 1,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          },
          slidesPerView: 'auto',
          spaceBetween: 10,
          centeredSlides: false,
          allowTouchMove: true,
          grabCursor: true,
          simulateTouch: true,
          breakpoints: {
            320: {
              slidesPerView: 3,
              spaceBetween: 5
            },
            480: {
              slidesPerView: 4,
              spaceBetween: 8
            },
            640: {
              slidesPerView: 6,
              spaceBetween: 10
            },
            992: {
              slidesPerView: 8,
              spaceBetween: 10
            },
            1200: {
              slidesPerView: 10,
              spaceBetween: 10
            }
          }
        });
      } catch (error) {
        console.warn('Partners slider initialization failed:', error);
        fallbackSlider('.partners-slider');
      }
    } else {
      console.warn('Swiper not loaded, using fallback sliders');
      fallbackSlider('.clients-slider');
      fallbackSlider('.partners-slider');
    }
  }

  /**
   * Fallback slider for when Swiper fails to load
   */
  function fallbackSlider(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;
    
    const wrapper = slider.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    
    // Add fallback CSS animation class
    wrapper.classList.add('fallback-scroll');
    
    // Add CSS for fallback animation if it doesn't exist
    if (!document.querySelector('#fallback-slider-css')) {
      const style = document.createElement('style');
      style.id = 'fallback-slider-css';
      style.textContent = `
        .fallback-scroll {
          animation: scroll-horizontal 30s linear infinite;
          display: flex;
          width: max-content;
        }
        .fallback-scroll .swiper-slide {
          flex-shrink: 0;
          margin-right: 10px;
        }
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize sliders
  initClientSliders();

  /**
   * Partner Sliders Enhancement and other Swiper sliders
   */
  function initOtherSliders() {
    // Partner slider image enhancements
    document.querySelectorAll('#partners .clients-slider .swiper-slide img, .partners-slider .swiper-slide img').forEach(img => {
      img.style.maxHeight = '80px';
      img.style.maxWidth = '100%';
      img.style.objectFit = 'contain';
      
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        img.style.filter = 'none';
        img.style.opacity = '1';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.filter = 'none';
        img.style.opacity = '1';
      });
    });

    // Testimonials slider
    if (typeof Swiper !== 'undefined') {
      try {
        new Swiper('.testimonials-slider', {
          speed: 600,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        });
      } catch (error) {
        console.warn('Testimonials slider initialization failed:', error);
      }
    }
  }
  
  // Initialize other sliders
  initOtherSliders();

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    if (typeof Isotope !== 'undefined') {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item'
        });

        let portfolioFilters = select('#portfolio-filters li', true);

        on('click', '#portfolio-filters li', function(e) {
          e.preventDefault();
          portfolioFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          portfolioIsotope.on('arrangeComplete', function() {
            AOS.refresh()
          });
        }, true);
      }
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  if (typeof GLightbox !== 'undefined') {
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  /**
   * Portfolio details slider with fallback
   */
  if (typeof Swiper !== 'undefined') {
    try {
      new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    } catch (error) {
      console.warn('Portfolio details slider initialization failed:', error);
    }
  }

})(); 

/**
 * Scroll Animation - Handles all scroll-triggered animations and interactive elements
 */
document.addEventListener('DOMContentLoaded', function() {
  "use strict";
  
  // Preloader
  let preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      preloader.remove();
      
      // Start animations after preloader is gone
      setTimeout(function() {
        initScrollAnimations();
      }, 300);
    });
  } else {
    initScrollAnimations();
  }
  
  // Initialize all scroll-based animations
  function initScrollAnimations() {
    // Initialize scroll-triggered animations
    initScrollTriggeredElements();
    
    // Initialize circuit path animations
    initCircuitPaths();
    
    // Initialize tech terms cloud
    initTechTerms();
  }
  
  // Mobile topbar auto-hide on scroll - REMOVED (now handled in consolidatedScrollHandler)
  
  
  // Scroll-triggered animations for elements
  function initScrollTriggeredElements() {
    const scrollAnimatedElements = document.querySelectorAll('.scroll-animated');
    const codeTypingSections = document.querySelectorAll('.code-typing-section');
    
    function checkScroll() {
      const triggerPosition = window.innerHeight * 0.85;
      
      // Check and animate general scroll elements
      scrollAnimatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < triggerPosition) {
          element.classList.add('animate');
        }
      });
      
      // Check and animate code typing sections
      codeTypingSections.forEach(section => {
        const sectionPosition = section.getBoundingClientRect().top;
        
        if (sectionPosition < triggerPosition) {
          section.classList.add('animate');
        }
      });
    }
    
    // Run on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Run once on load
    checkScroll();
  }
  
  // Circuit path animations
  function initCircuitPaths() {
    const circuitPaths = document.querySelectorAll('.circuit-path');
    const circuitNodes = document.querySelectorAll('.circuit-node');
    
    function animateCircuits() {
      const triggerPosition = window.innerHeight * 0.85;
      
      // Animate circuit paths
      circuitPaths.forEach(path => {
        const pathPosition = path.getBoundingClientRect().top;
        
        if (pathPosition < triggerPosition) {
          setTimeout(() => {
            path.classList.add('animate-in');
          }, 300);
        }
      });
      
      // Animate circuit nodes
      circuitNodes.forEach((node, index) => {
        const nodePosition = node.getBoundingClientRect().top;
        
        if (nodePosition < triggerPosition) {
          setTimeout(() => {
            node.classList.add('animate-in');
          }, 800 + (index * 200));
        }
      });
    }
    
    // Run on scroll
    window.addEventListener('scroll', animateCircuits);
    
    // Run once on load
    animateCircuits();
  }
  
  // Tech terms cloud animations
  function initTechTerms() {
    const techTerms = document.querySelectorAll('.tech-term');
    
    function animateTechTerms() {
      const triggerPosition = window.innerHeight * 0.85;
      
      techTerms.forEach((term, index) => {
        const termPosition = term.getBoundingClientRect().top;
        
        if (termPosition < triggerPosition) {
          setTimeout(() => {
            term.classList.add('animate-in');
          }, 100 * index);
        }
      });
    }
    
    // Run on scroll
    window.addEventListener('scroll', animateTechTerms);
    
    // Run once on load
    animateTechTerms();
  }

})(); 

/**
 * Enhanced Interactive Elements for IT website scrolling
 */
document.addEventListener('DOMContentLoaded', function() {
  "use strict";

  // Initialize 3D cube animation
  initCube();
  
  // Initialize terminal typing effect
  initTerminal();
  
  // Initialize system metrics
  initSystemMetrics();
  
  // Initialize network map
  initNetworkMap();
  
  // Initialize matrix effect
  initMatrixEffect();
  
  // Initialize radar effect
  initRadar();
  
  // Initialize form loading bar
  initLoadingBar();
  
  // Initialize rotating gears
  initRotatingGears();
  
  // Initialize 3D floating icons
  initFloating3DIcons();
  
  // 3D rotating cube animation
  function initCube() {
    const cubeContainer = document.querySelector('.cube-container');
    if (!cubeContainer) return;
    
    const cube = cubeContainer.querySelector('.cube');
    
    // Observer for cube animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cube.classList.add('animate');
        } else {
          cube.classList.remove('animate');
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(cubeContainer);
  }
  
  // Terminal typing effect
  function initTerminal() {
    const terminalContainer = document.querySelector('.terminal-container');
    if (!terminalContainer) return;
    
    const terminalContent = terminalContainer.querySelector('.terminal-content');
    
    // Observer for terminal animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          terminalContent.classList.add('animate');
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(terminalContainer);
  }
  
  // System metrics animation
  function initSystemMetrics() {
    const metricBars = document.querySelectorAll('.metric-progress');
    if (!metricBars.length) return;
    
    // Observer for metric bars animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const value = target.getAttribute('data-value');
          target.style.width = value + '%';
        }
      });
    }, { threshold: 0.3 });
    
    metricBars.forEach(bar => {
      observer.observe(bar);
    });
  }
  
  // Network map animation
  function initNetworkMap() {
    const networkMap = document.querySelector('.network-map');
    if (!networkMap) return;
    
    const nodes = networkMap.querySelectorAll('.network-node');
    const lines = networkMap.querySelectorAll('.network-line');
    const packets = networkMap.querySelectorAll('.network-packet');
    
    // Observer for network map animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate nodes with delay
          nodes.forEach((node, index) => {
            setTimeout(() => {
              node.classList.add('animate');
            }, index * 1500);
          });
          
          // Animate lines with delay
          setTimeout(() => {
            lines.forEach((line, index) => {
              setTimeout(() => {
                line.classList.add('animate');
              }, index * 1200);
            });
          }, nodes.length * 1500);
          
          // Animate packets with delay
          setTimeout(() => {
            packets.forEach((packet, index) => {
              setTimeout(() => {
                packet.classList.add('animate');
              }, index * 4000);
            });
          }, (nodes.length * 1500) + (lines.length * 1200) + 2000);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(networkMap);
  }
  
  // Matrix effect
  function initMatrixEffect() {
    const matrixContainer = document.querySelector('.matrix-container');
    if (!matrixContainer) return;
    
    // Check if columns already exist to prevent duplication
    if (matrixContainer.querySelector('.matrix-column')) return;
    
    // Create matrix characters
    const characters = '01';
    const columnCount = 8; // Further reduced for subtler effect
    
    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      
      // Random column properties
      column.style.left = (i * 13) + '%'; // More spacing between columns
      column.style.animationDelay = (Math.random() * 8 + 2) + 's';
      column.style.setProperty('--fall-duration', (15 + Math.random() * 15) + 's'); // Extremely slow fall
      
      // Generate random binary text
      let columnText = '';
      for (let j = 0; j < 10; j++) { // Further reduced from 12
        columnText += characters.charAt(Math.floor(Math.random() * characters.length));
        if (j < 9) columnText += '<br>';
      }
      
      column.innerHTML = columnText;
      matrixContainer.appendChild(column);
    }
    
    // Observer for matrix animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const columns = matrixContainer.querySelectorAll('.matrix-column');
          columns.forEach((column, index) => {
            setTimeout(() => {
              column.classList.add('animate');
            }, index * 1000); // Even longer delay between columns
          });
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(matrixContainer);
  }
  
  // Radar scanning effect
  function initRadar() {
    const radarContainer = document.querySelector('.radar-container');
    if (!radarContainer) return;
    
    const radarSweep = radarContainer.querySelector('.radar-sweep');
    const radarPings = radarContainer.querySelectorAll('.radar-ping');
    
    // Observer for radar animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start sweep animation
          radarSweep.classList.add('animate');
          
          // Animate pings with delay
          radarPings.forEach((ping, index) => {
            setTimeout(() => {
              ping.classList.add('animate');
              
              // Reset ping animation after it completes
              setTimeout(() => {
                ping.classList.remove('animate');
                
                // Start it again after a delay
                setTimeout(() => {
                  ping.classList.add('animate');
                }, 8000);
              }, 10000);
            }, index * 12000);
          });
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(radarContainer);
  }
  
  // Form loading bar
  function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    if (!loadingBar) return;
    
    const form = document.querySelector('.php-email-form');
    
    if (form) {
      // Show animation when form is in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadingBar.classList.add('animate');
          }
        });
      }, { threshold: 0.3 });
      
      observer.observe(form);
      
      // Animate when form is submitted
      form.addEventListener('submit', function(e) {
        loadingBar.classList.remove('animate');
        setTimeout(() => {
          loadingBar.classList.add('animate');
        }, 10);
      });
    }
  }
  
  // Rotating gears animation
  function initRotatingGears() {
    const gearElements = document.querySelectorAll('.gear');
    if (!gearElements.length) return;
    
    // Observer for gear animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const gears = entry.target.querySelectorAll('.gear');
          gears.forEach(gear => {
            gear.classList.add('animate');
          });
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(document.querySelector('.parallax-gears'));
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
      gearElements.forEach(gear => {
        const scrollPos = window.scrollY;
        const speed = gear.classList.contains('gear-1') || gear.classList.contains('gear-3') ? 0.1 : -0.05;
        gear.style.transform = `rotate(${scrollPos * speed}deg)`;
      });
    });
  }
  
  // 3D floating icons
  function initFloating3DIcons() {
    const container = document.querySelector('.hero-content');
    if (!container) return;
    
    // Check if icons already exist to prevent duplication
    if (container.querySelector('.floating-3d-icon')) return;
    
    // Create 3D floating icons
    const iconClasses = [
      'ri-server-line',
      'ri-database-2-line',
      'ri-cloud-line',
      'ri-code-s-slash-line'
    ];
    
    for (let i = 0; i < 2; i++) {
      const icon = document.createElement('div');
      icon.className = 'floating-3d-icon';
      
      // Random position
      icon.style.left = (Math.random() * 80) + '%';
      icon.style.top = (Math.random() * 80) + '%';
      
      // Create all sides
      const sides = ['front', 'back', 'right', 'left', 'top', 'bottom'];
      const iconClass = iconClasses[Math.floor(Math.random() * iconClasses.length)];
      
      sides.forEach(side => {
        const faceElement = document.createElement('div');
        faceElement.className = `icon-3d-side icon-3d-${side}`;
        faceElement.innerHTML = `<i class="${iconClass}"></i>`;
        icon.appendChild(faceElement);
      });
      
      container.appendChild(icon);
    }
    
    // Animate 3D icons
    const floatingIcons = document.querySelectorAll('.floating-3d-icon');
    if (!floatingIcons.length) return;
    
    setTimeout(() => {
      floatingIcons.forEach((icon, index) => {
        setTimeout(() => {
          icon.classList.add('animate');
        }, index * 2000);
      });
    }, 3000);
  }
}); 