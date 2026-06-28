// Settings panel view controller component (UI Module)
// Draws forms inputs, file backup upload drag-drops, and resets.
// Globally Scoped.

window.SettingsView = class SettingsView {
  constructor(app) {
    this.app = app;
  }

  render(container) {
    const settings = window.settingsService.getSettings();
    const profile = window.settingsService.getProfile();

    container.innerHTML = `
      <div class="container-fluid py-4" style="max-width: 800px;">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="font-bold mb-1">Application Settings</h2>
          <p class="text-muted text-sm mb-0">Customize your workspace accent colors, profile settings, and perform backup database exports.</p>
        </div>

        <!-- 1. Profile Manager Card -->
        <div class="premium-card mb-4">
          <h5 class="font-bold mb-3 text-main"><i class="bi bi-person-bounding-box text-primary me-2"></i> User Profile Details</h5>
          <form id="settings-profile-form">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label font-semibold text-xs text-uppercase">Profile Name</label>
                <input type="text" id="settings-profile-name" class="form-control" value="${profile.name}" required>
              </div>
              <div class="col-md-6">
                <label class="form-label font-semibold text-xs text-uppercase">Email Address</label>
                <input type="email" id="settings-profile-email" class="form-control" value="${profile.email}" required>
              </div>
              <div class="col-12">
                <label class="form-label font-semibold text-xs text-uppercase">Avatar Photo Image Link</label>
                <input type="text" id="settings-profile-avatar" class="form-control" value="${profile.avatar}" required>
              </div>
              <div class="col-12">
                <label class="form-label font-semibold text-xs text-uppercase">Bio Description</label>
                <textarea id="settings-profile-bio" class="form-control text-xs" rows="3">${profile.bio || ''}</textarea>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm font-semibold mt-3 px-4">Save Profile</button>
          </form>
        </div>

        <!-- 2. Configurations & System Card -->
        <div class="premium-card mb-4">
          <h5 class="font-bold mb-3 text-main"><i class="bi bi-sliders2-vertical text-primary me-2"></i> System Configurations</h5>
          
          <div class="row g-4 align-items-center mb-3">
            <div class="col-sm-6">
              <div class="font-semibold text-main">Theme Mode Display</div>
              <div class="text-xs text-muted">Toggle between dark and light themes.</div>
            </div>
            <div class="col-sm-6 text-sm-end">
              <div class="form-check form-switch d-inline-block">
                <input class="form-check-input cursor-pointer" type="checkbox" role="switch" id="settings-darkmode-toggle" ${settings.themeMode === 'dark' ? 'checked' : ''}>
                <label class="form-check-label text-xs font-semibold" for="settings-darkmode-toggle">Dark Mode</label>
              </div>
            </div>
          </div>

          <hr class="my-3">

          <!-- Alarm Sound configurations -->
          <div class="row g-4 align-items-center mb-3">
            <div class="col-sm-6">
              <div class="font-semibold text-main">Alarm Notifications volume</div>
              <div class="text-xs text-muted">Control ringer audio warning volume.</div>
            </div>
            <div class="col-sm-6">
              <div class="d-flex align-items-center gap-2 justify-content-sm-end">
                <i class="bi bi-volume-down-fill text-muted"></i>
                <input type="range" class="form-range" id="settings-sound-volume" min="0" max="1" step="0.1" value="${settings.soundVolume !== undefined ? settings.soundVolume : 0.5}" style="max-width:160px;">
                <i class="bi bi-volume-up-fill text-muted"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Local database backups Card -->
        <div class="premium-card mb-4 border-top border-4 border-info">
          <h5 class="font-bold mb-2 text-main"><i class="bi bi-database-fill-down text-info me-2"></i> Local Data Backup & Restore</h5>
          <p class="text-muted text-xs mb-3">Keep copies of your schedule local logs. Swapping browsers or clearing cache deletes local files.</p>
          
          <div class="d-flex gap-2 mb-3">
            <button class="btn btn-outline-primary btn-sm font-semibold" id="settings-export-btn">
              <i class="bi bi-download"></i> Export Database JSON
            </button>
            
            <label class="btn btn-outline-info btn-sm font-semibold mb-0" for="settings-import-file">
              <i class="bi bi-upload"></i> Restore from JSON
            </label>
            <input type="file" id="settings-import-file" class="d-none" accept=".json">
          </div>
        </div>

        <!-- 4. Danger Zone reset -->
        <div class="premium-card border-top border-4 border-danger">
          <h5 class="font-bold mb-2 text-danger"><i class="bi bi-exclamation-triangle-fill text-danger me-2"></i> Danger Zone Operations</h5>
          <p class="text-muted text-xs mb-3">Resetting values wipes customized records and prompts original seeded datasets.</p>
          <button class="btn btn-danger btn-sm font-semibold" id="settings-reset-btn">Reset Database Storage</button>
        </div>
      </div>
    `;
  }

  init(container) {
    // 1. Profile submit
    container.querySelector('#settings-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = container.querySelector('#settings-profile-name').value;
      const email = container.querySelector('#settings-profile-email').value;
      const avatar = container.querySelector('#settings-profile-avatar').value;
      const bio = container.querySelector('#settings-profile-bio').value;

      window.settingsService.updateProfile({ name, email, avatar, bio });
      window.notificationService.showToast('Profile credentials saved', 'success');
      
      // Refresh sidebar footer
      this.app.refreshSidebarFooter();
    });

    // 2. Dark Mode Switch
    container.querySelector('#settings-darkmode-toggle').addEventListener('change', (e) => {
      const isDark = e.target.checked;
      const newMode = isDark ? 'dark' : 'light';
      window.settingsService.updateSettings({ themeMode: newMode });
      this.app.syncThemeModeIcon(newMode);
      window.notificationService.showToast(`Theme mode set to ${isDark ? 'Dark' : 'Light'}`, 'success');
    });

    // 3. Audio Alarm Volume Sliders
    const volumeSlider = container.querySelector('#settings-sound-volume');
    volumeSlider.addEventListener('input', () => {
      window.settingsService.updateSettings({ soundVolume: parseFloat(volumeSlider.value) });
    });

    // 4. Export backup files
    container.querySelector('#settings-export-btn').addEventListener('click', () => {
      const backup = window.settingsService.exportBackup();
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeos_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      window.notificationService.showToast('Backup JSON downloaded successfully', 'success');
    });

    // 5. Restore backup file uploads
    container.querySelector('#settings-import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const res = window.settingsService.importBackup(event.target.result);
        if (res.success) {
          window.notificationService.showToast('Database restore complete', 'success');
          // Full app reload
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          window.notificationService.showToast(res.message, 'danger');
        }
      };
      reader.readAsText(file);
    });

    // 6. Hard reset database storage
    container.querySelector('#settings-reset-btn').addEventListener('click', () => {
      if (confirm("CRITICAL WARNING: This resets all custom tasks, logs, and screenshots. Proceed?")) {
        window.settingsService.resetDemoData();
        window.notificationService.showToast('System storage flushed to seeds default', 'warning');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  destroy() {}
}
