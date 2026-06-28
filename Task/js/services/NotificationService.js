// Notification Service (Service Layer)
// Manages alert toasts, HTML5 desktop notifications, and synthesizes audio alerts via Web Audio API.
// Globally Scoped.

class NotificationService {
  constructor() {
    this.toastEl = document.getElementById('lifeos-toast');
    this.toastIcon = document.getElementById('toast-icon');
    this.toastMsg = document.getElementById('toast-message');
    
    // Initialize notification permission request
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
    }
  }

  // Display a custom floating Toast
  showToast(message, type = 'success') {
    if (!this.toastEl) {
      this.toastEl = document.getElementById('lifeos-toast');
      this.toastIcon = document.getElementById('toast-icon');
      this.toastMsg = document.getElementById('toast-message');
    }

    if (!this.toastEl) return;

    // Reset styles
    this.toastEl.className = 'toast align-items-center text-white border-0';
    
    // Set theme style class and matching icon
    let iconClass = 'bi-check-circle-fill';
    if (type === 'success') {
      this.toastEl.classList.add('bg-success');
      iconClass = 'bi-check-circle-fill';
    } else if (type === 'danger' || type === 'error') {
      this.toastEl.classList.add('bg-danger');
      iconClass = 'bi-exclamation-triangle-fill';
    } else if (type === 'warning') {
      this.toastEl.classList.add('bg-warning', 'text-dark');
      this.toastIcon.classList.add('text-dark');
      iconClass = 'bi-exclamation-circle-fill';
    } else {
      this.toastEl.classList.add('bg-primary');
      iconClass = 'bi-info-circle-fill';
    }

    this.toastIcon.className = `bi ${iconClass}`;
    this.toastMsg.textContent = message;

    // Show toast using Bootstrap 5 Instance
    try {
      const toastInstance = bootstrap.Toast.getOrCreateInstance(this.toastEl);
      toastInstance.show();
    } catch (e) {
      console.warn("NotificationService: Failed to display Bootstrap Toast", e);
    }
  }

  // Synthesize notification sound purely using Web Audio API
  playNotificationSound() {
    const settings = window.storageService.get('settings') || {};
    if (settings.soundEnabled === false) return;

    const volume = settings.soundVolume !== undefined ? settings.soundVolume : 0.5;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      
      // Dual tone notification chime (C5 to G5 chime)
      const playTone = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        // Envelope
        gainNode.gain.setValueAtTime(0.001, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.35);         // C5 chime
      playTone(783.99, now + 0.12, 0.45);    // G5 chime
      
    } catch (e) {
      console.warn("NotificationService: Web Audio sound generation failed", e);
    }
  }

  // Trigger browser push notifications and alarms
  triggerNotification(title, body = '') {
    // 1. Play synthesized chime sound
    this.playNotificationSound();
    
    // 2. Show dynamic application toast
    this.showToast(`${title}: ${body}`, 'info');

    // 3. System Push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
        });
      } catch (err) {
        console.warn("NotificationService: Failed to trigger native System Notification", err);
      }
    }
  }
}

// Global Singleton instantiation
window.notificationService = new NotificationService();
