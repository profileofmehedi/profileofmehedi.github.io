// Authentication Service (Service Layer)
// Manages authentication states, credentials, remember me tokens, and logouts.
// Fallback in-memory session is used if sessionStorage/localStorage is blocked (e.g. on file:// protocol).
// Globally Scoped.

class AuthService {
  constructor() {
    this.sessionKey = 'current_session';
    this.rememberKey = 'remembered_user';
    this.isSupported = this.checkSupport();
    this.memorySession = null;
  }

  // Check if sessionStorage is supported and accessible in current context
  checkSupport() {
    try {
      const testKey = '__session_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn("AuthService: SessionStorage/LocalStorage blocked. Defaulting to in-memory session.");
      return false;
    }
  }

  // Check if user is authenticated (checks active session or auto-login)
  isAuthenticated() {
    if (!this.isSupported) {
      return this.memorySession !== null;
    }
    try {
      // Check active session first
      const activeSession = sessionStorage.getItem(this.sessionKey);
      if (activeSession) return true;

      // Check remember me token for auto-login
      const rememberedUser = localStorage.getItem(this.rememberKey);
      if (rememberedUser) {
        // Auto login: copy to session storage
        sessionStorage.setItem(this.sessionKey, rememberedUser);
        return true;
      }
    } catch (e) {}

    return false;
  }

  // Handle user authentication login
  login(username, password, rememberMe = false) {
    // Lowercase checks
    const user = username.trim().toLowerCase();
    const pass = password.trim();

    // Verify against demo credentials
    if (user === 'mehedi' && pass === '1') {
      const sessionData = JSON.stringify({
        username: 'mehedi',
        role: 'Premium Member',
        loginTime: new Date().toISOString()
      });

      if (!this.isSupported) {
        this.memorySession = sessionData;
      } else {
        try {
          // Save to sessionStorage
          sessionStorage.setItem(this.sessionKey, sessionData);

          // Save to localStorage if Remember Me is checked
          if (rememberMe) {
            localStorage.setItem(this.rememberKey, sessionData);
          } else {
            localStorage.removeItem(this.rememberKey);
          }
        } catch (e) {}
      }

      // Add audit log activity
      this.logActivity('Logged in');

      return { success: true };
    }

    return { success: false, message: 'Invalid username or password' };
  }

  // Log out user
  logout() {
    this.logActivity('Logged out');
    if (!this.isSupported) {
      this.memorySession = null;
    } else {
      try {
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.rememberKey);
      } catch (e) {}
    }
    return true;
  }

  // Get currently logged-in user profile details
  getCurrentUser() {
    let session = null;
    if (!this.isSupported) {
      session = this.memorySession;
    } else {
      try {
        session = sessionStorage.getItem(this.sessionKey);
      } catch (e) {}
    }

    if (!session) return null;
    try {
      const parsedSession = JSON.parse(session);
      // Fetch dynamic profile details from storage
      const profile = window.storageService.get('profile') || {};
      return {
        ...parsedSession,
        displayName: profile.name || 'Mehedi',
        email: profile.email || 'mehedi@lifeos.io',
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop',
        bio: profile.bio || ''
      };
    } catch (e) {
      console.error("AuthService: Error parsing current user session", e);
      return null;
    }
  }

  // Private logger helper to add audit events
  logActivity(text) {
    const activities = window.storageService.get('activities') || [];
    activities.unshift({
      timestamp: new Date().toISOString(),
      text
    });
    // Keep last 50 activities
    if (activities.length > 50) activities.pop();
    window.storageService.set('activities', activities);
  }
}

// Global Singleton instantiation
window.authService = new AuthService();
