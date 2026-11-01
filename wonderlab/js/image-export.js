/**
 * WonderLab - High Quality Client-Side Image Export Engine
 * Powered by html2canvas with high-DPI scaling and Bengali font rendering assurance.
 */

const ImageExporter = (function () {
  /**
   * Wait until web fonts are completely loaded.
   */
  const ensureFontsLoaded = async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  };

  return {
    /**
     * Export an HTML element as high-resolution PNG image.
     * @param {HTMLElement|string} elementOrSelector - target element to export
     * @param {Object} options - filename, scale, width, height, title
     */
    exportElementToPNG: async function (elementOrSelector, options = {}) {
      const el = typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

      if (!el) {
        Utils.showToast('এক্সপোর্ট করার উপাদান খুঁজে পাওয়া যায়নি!', 'error');
        return null;
      }

      const filename = options.filename || `wonderlab-${Date.now()}.png`;
      Utils.showToast('ইমেজ রেন্ডার হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...', 'info', 2000);

      try {
        await ensureFontsLoaded();

        // Check if html2canvas is available
        if (typeof html2canvas !== 'function') {
          throw new Error('html2canvas library is not loaded');
        }

        // Configure high quality render
        const canvas = await html2canvas(el, {
          scale: options.scale || 2, // 2x scale for sharp HD export
          useCORS: true,
          allowTaint: true,
          backgroundColor: options.backgroundColor || null,
          logging: false,
          ignoreElements: (element) => {
            // Ignore export controls, action buttons, modals
            return element.classList && (
              element.classList.contains('no-export') ||
              element.classList.contains('btn-export-hide')
            );
          }
        });

        // Convert canvas to blob
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              Utils.showToast('ইমেজ জেনারেট করতে সমস্যা হয়েছে।', 'error');
              resolve(null);
              return;
            }

            if (options.download !== false) {
              Utils.downloadFile(blob, filename);
              Utils.showToast('ইমেজ সফলভাবে ডাউনলোড হয়েছে! 🎉', 'success');
              AnimationEngine.triggerConfetti();
            }

            resolve({
              blob: blob,
              dataUrl: canvas.toDataURL('image/png'),
              filename: filename
            });
          }, 'image/png');
        });
      } catch (err) {
        console.error('Image export failed:', err);
        Utils.showToast('ইমেজ এক্সপোর্ট ব্যর্থ হয়েছে: ' + (err.message || 'অজানা ত্রুটি'), 'error');
        return null;
      }
    },

    /**
     * Open the Global Shared Result Modal for any experience
     */
    openResultModal: function (config = {}) {
      const modal = document.getElementById('result-modal');
      const container = document.getElementById('result-modal-artwork-container');
      const titleEl = document.getElementById('result-modal-title');
      const shareBtn = document.getElementById('modal-share-btn');
      const downloadBtn = document.getElementById('modal-download-btn');

      if (!modal || !container) return;

      if (titleEl) titleEl.textContent = config.title || 'আপনার ফলাফল';

      // Clone or inject target node
      container.innerHTML = '';
      if (config.element) {
        const clone = config.element.cloneNode(true);
        clone.id = 'active-modal-preview-card';
        // Remove interactive control indicators if present
        clone.querySelectorAll('.no-export').forEach(e => e.remove());
        container.appendChild(clone);
      }

      // Configure buttons
      if (downloadBtn) {
        downloadBtn.onclick = async () => {
          const target = container.firstElementChild;
          if (target) {
            await this.exportElementToPNG(target, {
              filename: config.filename || `wonderlab-${Date.now()}.png`
            });
          }
        };
      }

      if (shareBtn) {
        shareBtn.onclick = () => {
          SocialShare.share({
            title: config.title || 'WonderLab - আমার ক্রিয়েশন',
            text: config.shareText || 'WonderLab-এ আমার তৈরি করা চমৎকার কার্ডটি দেখুন!',
            url: window.location.href
          });
        };
      }

      // Show modal
      modal.classList.add('active');
      AnimationEngine.triggerConfetti({ particleCount: 60 });
    },

    closeResultModal: function () {
      const modal = document.getElementById('result-modal');
      if (modal) modal.classList.remove('active');
    }
  };
})();

window.ImageExporter = ImageExporter;
