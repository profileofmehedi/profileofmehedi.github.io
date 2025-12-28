/**
 * cPanel Compatibility Layer
 * Ensures website works identically on localhost and cPanel hosting
 */

(function() {
    'use strict';
    
    /**
     * CDN Fallback System
     */
    function checkCDNFallbacks() {
        // Check if Bootstrap is loaded
        if (typeof bootstrap === 'undefined' && typeof window.bootstrap === 'undefined') {
            console.warn('Bootstrap CDN failed, using fallback styles');
            addFallbackCSS('bootstrap-fallback', `
                .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
                .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
                .col-lg-12 { width: 100%; padding: 0 15px; }
                .d-flex { display: flex !important; }
                .align-items-center { align-items: center !important; }
                .justify-content-center { justify-content: center !important; }
                .text-center { text-align: center !important; }
                .img-fluid { max-width: 100%; height: auto; }
            `);
        }
        
        // Check if AOS is loaded
        if (typeof AOS === 'undefined') {
            console.warn('AOS CDN failed, using fallback animations');
            // Initialize simple fade-in animations
            initFallbackAnimations();
        }
        
        // Check if Swiper is loaded
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper CDN failed, using fallback sliders');
            // This is already handled in modern-main.js
        }
    }
    
    /**
     * Add fallback CSS dynamically
     */
    function addFallbackCSS(id, css) {
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Fallback animations when AOS fails
     */
    function initFallbackAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        // Add fallback CSS for animations
        addFallbackCSS('aos-fallback', `
            .aos-animate { 
                opacity: 1 !important; 
                transform: translate(0) !important; 
                transition: opacity 0.6s ease, transform 0.6s ease !important;
            }
            .aos-init { 
                opacity: 0; 
                transform: translateY(30px);
            }
        `);
        
        // Simple intersection observer for fade-in
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(el => {
                el.classList.add('aos-init');
                observer.observe(el);
            });
        } else {
            // Fallback for old browsers
            animatedElements.forEach(el => {
                el.classList.add('aos-animate');
            });
        }
    }
    
    /**
     * Fix case sensitivity issues for cPanel Linux hosting
     */
    function fixCaseSensitivity() {
        // Check all images and fix potential case mismatches
        const images = document.querySelectorAll('img[src*="assets/img"]');
        
        images.forEach(img => {
            const originalSrc = img.src;
            
            // Create a new image to test if the file loads
            const testImg = new Image();
            testImg.onload = function() {
                // Image loaded successfully, no change needed
            };
            testImg.onerror = function() {
                console.warn(`Image failed to load: ${originalSrc}`);
                // Add a placeholder or try alternative naming
                img.alt = img.alt || 'Image not found';
                img.style.display = 'none'; // Hide broken images
            };
            testImg.src = originalSrc;
        });
    }
    
    /**
     * Ensure proper JavaScript execution order
     */
    function ensureExecutionOrder() {
        // Make sure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCompatibilityFixes);
        } else {
            initCompatibilityFixes();
        }
    }
    
    /**
     * Initialize all compatibility fixes
     */
    function initCompatibilityFixes() {
        // Small delay to ensure other scripts have loaded
        setTimeout(() => {
            checkCDNFallbacks();
            fixCaseSensitivity();
            
            // Initialize sliders if not already done
            if (typeof window.slidersInitialized === 'undefined') {
                window.slidersInitialized = true;
                // This will be handled by modern-main.js
            }
        }, 100);
    }
    
    /**
     * Monitor and fix scroll behavior
     */
    function fixScrollBehavior() {
        let ticking = false;
        
        function updateScrollEffects() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const header = document.getElementById('header');
            const topbar = document.getElementById('topbar');
            
            if (header && topbar) {
                // Throttle scroll events for better performance
                if (scrollTop > 100) {
                    header.classList.add('header-scrolled');
                    topbar.classList.add('topbar-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                    topbar.classList.remove('topbar-scrolled');
                }
            }
            
            ticking = false;
        }
        
        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }
    
    /**
     * Mobile compatibility fixes
     */
    function initMobileCompatibility() {
        // Fix mobile navbar toggle
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        const navbar = document.getElementById('navbar');
        
        // Avoid double-binding if modern-main.js already attached
        const alreadyBound = (window.LETMobileNavBound === true) || (mobileToggle && mobileToggle.dataset && mobileToggle.dataset.letBound === '1');
        if (mobileToggle && navbar && !alreadyBound) {
            mobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                navbar.classList.toggle('navbar-mobile');
                this.classList.toggle('ri-menu-line');
                this.classList.toggle('ri-close-line');
            }, { once: false });
        }
        
        // Fix mobile topbar behavior
        if (window.innerWidth <= 991.98) {
            const topbar = document.getElementById('topbar');
            const header = document.getElementById('header');
            
            if (topbar && header) {
                let lastScrollTop = 0;
                const scrollThreshold = 50;
                
                window.addEventListener('scroll', function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    if (scrollTop > scrollThreshold) {
                        if (scrollTop > lastScrollTop) {
                            topbar.classList.add('mobile-hidden');
                            header.style.top = '0px';
                        } else {
                            topbar.classList.remove('mobile-hidden');
                            header.style.top = '35px';
                        }
                    } else {
                        topbar.classList.remove('mobile-hidden');
                        header.style.top = '35px';
                    }
                    
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                }, { passive: true });
            }
        }
    }
    
    // Initialize everything when DOM is ready
    ensureExecutionOrder();
    
    // Additional initialization on window load
    window.addEventListener('load', function() {
        setTimeout(() => {
            fixScrollBehavior();
            initMobileCompatibility();
        }, 200);
    });
    
    // Expose compatibility check function globally
    window.cPanelCompatibility = {
        checkCDNFallbacks: checkCDNFallbacks,
        fixCaseSensitivity: fixCaseSensitivity,
        version: '1.0.0'
    };
    
})();