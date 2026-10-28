/**
 * WonderLab - General Utilities & Helpers
 */

const Utils = (function () {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  return {
    /**
     * Escape HTML special characters for safe output.
     */
    escapeHTML: function (str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /**
     * Convert English digits in string or number to Bengali digits.
     */
    toBengaliNumerals: function (input) {
      if (input === null || input === undefined) return '';
      return String(input).replace(/[0-9]/g, function (w) {
        return bengaliDigits[+w];
      });
    },

    /**
     * Convert Bengali digits to English digits.
     */
    toEnglishNumerals: function (input) {
      if (!input) return '';
      let res = String(input);
      bengaliDigits.forEach((digit, i) => {
        res = res.split(digit).join(i);
      });
      return res;
    },

    /**
     * Deterministic pseudo-random number generator (Mulberry32).
     */
    createRNG: function (seedStr) {
      let seed = 0;
      if (typeof seedStr === 'string') {
        for (let i = 0; i < seedStr.length; i++) {
          seed = (seed << 5) - seed + seedStr.charCodeAt(i);
          seed |= 0;
        }
      } else {
        seed = seedStr || 123456789;
      }

      return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },

    /**
     * Show modern toast message.
     */
    showToast: function (message, type = 'info', duration = 3500) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = '✨';
      if (type === 'success') icon = '✓';
      if (type === 'error') icon = '⚠️';

      toast.innerHTML = `<span style="font-size:1.1rem">${icon}</span> <span>${this.escapeHTML(message)}</span>`;
      container.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, duration);
    },

    /**
     * Copy text to clipboard with toast notification.
     */
    copyToClipboard: function (text, successMsg = 'সফলভাবে কপি করা হয়েছে!') {
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          this.showToast(successMsg, 'success');
        } catch (err) {
          this.showToast('কপি করতে ব্যর্থ হয়েছে', 'error');
        }
        document.body.removeChild(textarea);
        return;
      }

      navigator.clipboard.writeText(text).then(
        () => {
          this.showToast(successMsg, 'success');
        },
        () => {
          this.showToast('কপি করতে ব্যর্থ হয়েছে', 'error');
        }
      );
    },

    /**
     * Trigger file download in browser.
     */
    downloadFile: function (blobOrDataUrl, filename) {
      const link = document.createElement('a');
      link.download = filename;

      if (typeof blobOrDataUrl === 'string') {
        link.href = blobOrDataUrl;
      } else {
        link.href = URL.createObjectURL(blobOrDataUrl);
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof blobOrDataUrl !== 'string') {
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }
    },

    /**
     * Debounce helper.
     */
    debounce: function (fn, delay = 200) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }
  };
})();

window.Utils = Utils;
