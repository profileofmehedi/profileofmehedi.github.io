/**
 * WonderLab - Social Sharing & Facebook Integration
 * Handles Web Share API, Facebook Sharer dialog, and Copy Link.
 */

const SocialShare = (function () {
  /**
   * Get valid public URL for sharing.
   */
  const getShareableURL = () => {
    const href = window.location.href;
    // If running on localhost or file protocol, warn or use standard production link
    if (href.startsWith('file:') || href.includes('localhost') || href.includes('127.0.0.1')) {
      return 'https://profileofmehedi.github.io/wonderlab/';
    }
    return href;
  };

  return {
    /**
     * Share using Web Share API or fallback to share modal / Facebook
     */
    share: async function (options = {}) {
      const shareData = {
        title: options.title || 'WonderLab — Interactive Experience Studio',
        text: options.text || 'WonderLab-এ আমার নিজের ইউনিক ডিজাইন তৈরি করলাম! আপনিও চেষ্টা করুন:',
        url: options.url || getShareableURL()
      };

      // If Web Share API with files is supported and file is provided
      if (options.file && navigator.canShare && navigator.canShare({ files: [options.file] })) {
        try {
          await navigator.share({
            files: [options.file],
            title: shareData.title,
            text: shareData.text
          });
          Utils.showToast('শেয়ার সম্পন্ন হয়েছে!', 'success');
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.warn('Native file share failed:', err);
          }
        }
      }

      // If standard Web Share API is supported
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          Utils.showToast('শেয়ার সম্পন্ন হয়েছে!', 'success');
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.warn('Native share failed:', err);
          }
        }
      }

      // Fallback: Open Facebook Sharer Dialog or prompt
      this.shareToFacebook(shareData.url);
    },

    /**
     * Official Facebook Sharer popup dialog
     */
    shareToFacebook: function (customUrl) {
      const targetUrl = encodeURIComponent(customUrl || getShareableURL());
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${targetUrl}`;

      const width = 640;
      const height = 480;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      window.open(
        fbUrl,
        'fbShareWindow',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      Utils.showToast('ফেসবুক শেয়ার উইন্ডো খোলা হয়েছে। ডাউনলোড করা ছবি যুক্ত করতে পারেন!', 'info', 5000);
    },

    /**
     * Copy current share URL with feedback
     */
    copyShareLink: function () {
      const url = getShareableURL();
      Utils.copyToClipboard(url, 'শেয়ার লিংক কপি করা হয়েছে!');
    }
  };
})();

window.SocialShare = SocialShare;
