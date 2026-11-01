/**
 * WonderLab - Animation Engine & Micro-Interactions
 */

const AnimationEngine = (function () {
  return {
    /**
     * Trigger confetti fireworks.
     */
    triggerConfetti: function (options = {}) {
      if (typeof confetti === 'function') {
        const defaults = {
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981']
        };
        confetti(Object.assign(defaults, options));
      }
    },

    /**
     * Big celebration confetti with multi-burst.
     */
    celebrate: function () {
      if (typeof confetti !== 'function') return;

      const end = Date.now() + 1000;
      const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#facc15'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    },

    /**
     * Initialize 3D interactive tilt effect on cards.
     */
    initTiltEffects: function () {
      // Check if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      document.addEventListener('mousemove', function (e) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
          } else {
            card.style.transform = '';
          }
        });
      });
    }
  };
})();

window.AnimationEngine = AnimationEngine;
