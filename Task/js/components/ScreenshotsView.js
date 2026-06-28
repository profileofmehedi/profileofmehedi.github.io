// Screenshot Vault View Component (UI Module)
// Implements files drag-drop uploads, canvas compressions, tags mapping,
// Zoom previews, and storage capacity calculators.
// Globally Scoped.

window.ScreenshotsView = class ScreenshotsView {
  constructor(app) {
    this.app = app;
    this.activeCategory = 'All';
  }

  getFilteredScreenshots() {
    const list = window.screenshotService.getScreenshots();
    if (this.activeCategory === 'All') return list;
    return list.filter(s => s.category === this.activeCategory);
  }

  getCategoriesList() {
    const list = window.screenshotService.getScreenshots();
    const cats = new Set(['All']);
    list.forEach(s => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }

  // Calculate roughly what percentage of 5MB LocalStorage quota is used
  getLocalStorageUsagePercentage() {
    let totalLength = 0;
    if (window.storageService.isSupported) {
      try {
        Object.keys(localStorage).forEach(key => {
          const val = localStorage.getItem(key);
          if (val) totalLength += key.length + val.length;
        });
      } catch (e) {}
    } else {
      // Calculate based on in-memory storage dictionary size
      try {
        Object.entries(window.storageService.memoryStorage).forEach(([key, val]) => {
          const str = typeof val === 'string' ? val : JSON.stringify(val);
          totalLength += key.length + str.length;
        });
      } catch (e) {}
    }

    // 5MB = 5 * 1024 * 1024 characters approx
    const limit = 5 * 1024 * 1024;
    return Math.round((totalLength / limit) * 100);
  }

  render(container) {
    const list = this.getFilteredScreenshots();
    const categories = this.getCategoriesList();
    const usage = this.getLocalStorageUsagePercentage();

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="font-bold mb-1">Screenshot Vault</h2>
            <p class="text-muted text-sm mb-0">Securely upload screenshot image logs. Canvas context scales and compresses uploads to low-quality JPEG to preserve storage space.</p>
          </div>
          <button class="btn btn-primary btn-sm font-semibold" id="ss-upload-btn">
            <i class="bi bi-upload"></i> Upload Image
          </button>
        </div>

        <div class="row g-4">
          <!-- Sidebar Folders list -->
          <div class="col-lg-3">
            <!-- Storage warnings card -->
            <div class="premium-card p-3 mb-3 border-top border-4 border-info">
              <span class="text-xs text-muted font-semibold d-block mb-1">Local Storage Capacity</span>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="h6 font-bold text-main mb-0">${usage}% used</span>
                <span class="text-2xs text-muted">Out of 5.0 MB quota</span>
              </div>
              <div class="progress" style="height: 5px; border-radius: 2px;">
                <div class="progress-bar ${usage > 80 ? 'bg-danger' : 'bg-info'}" style="width: ${usage}%"></div>
              </div>
            </div>

            <div class="premium-card p-0 overflow-hidden">
              <div class="py-2 px-3 border-bottom font-bold text-xs text-uppercase text-muted" style="background-color: var(--bg-hover);">Vault Folders</div>
              <div class="list-group list-group-flush pt-1">
                ${categories.map(cat => `
                  <button class="list-group-item list-group-item-action border-0 px-3 py-2 text-xs font-semibold ss-category-btn d-flex justify-content-between ${this.activeCategory === cat ? 'active bg-primary-subtle text-primary' : 'text-main bg-transparent'}" data-category="${cat}">
                    <span><i class="bi bi-folder-fill me-2 text-warning"></i> ${cat}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Cards Grid Vault -->
          <div class="col-lg-9">
            <div class="row g-3" id="ss-grid-container">
              ${this.buildScreenshotsGridHtml(list)}
            </div>
          </div>
        </div>

        <!-- Zoom preview overlay Modal -->
        <div id="ss-lightbox-modal" class="modal fade" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 bg-transparent text-center">
              <div class="modal-body p-0 position-relative">
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                <img id="ss-lightbox-img" src="" class="img-fluid rounded shadow-lg" style="max-height: 80vh; object-fit: contain;">
                <div class="mt-2 text-white font-bold text-sm" id="ss-lightbox-title">Image Preview</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  init(container) {
    container.querySelector('#ss-upload-btn').addEventListener('click', () => {
      this.openUploadDrawer();
    });

    container.querySelectorAll('.ss-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.getAttribute('data-category');
        this.render(container);
        this.init(container);
      });
    });

    container.querySelectorAll('.ss-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-src');
        const title = btn.getAttribute('data-title');
        
        const lightbox = container.querySelector('#ss-lightbox-modal');
        const img = container.querySelector('#ss-lightbox-img');
        const titleEl = container.querySelector('#ss-lightbox-title');

        img.src = src;
        titleEl.textContent = title;

        const modalInstance = new bootstrap.Modal(lightbox);
        modalInstance.show();
      });
    });

    container.querySelectorAll('.ss-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Delete this screenshot from the vault?")) {
          window.screenshotService.deleteScreenshot(btn.getAttribute('data-id'));
          window.notificationService.showToast('Screenshot deleted', 'success');
          this.render(container);
          this.init(container);
        }
      });
    });
  }

  buildScreenshotsGridHtml(list) {
    if (list.length === 0) {
      return `
        <div class="col-12 text-center py-5">
          <i class="bi bi-images text-muted" style="font-size: 3rem;"></i>
          <h5 class="font-bold text-muted mt-3">Vault folder is empty.</h5>
        </div>
      `;
    }

    return list.map(ss => `
      <div class="col-md-6 col-lg-4">
        <div class="premium-card p-0 overflow-hidden h-100 d-flex flex-column">
          <div class="position-relative" style="height: 160px; background-color: var(--bg-hover); overflow: hidden;">
            <img src="${ss.src}" class="w-100 h-100" style="object-fit: cover;">
            <div class="position-absolute top-0 left-0 m-2">
              <span class="badge bg-dark text-white text-uppercase text-xs" style="opacity: 0.85;">${ss.category}</span>
            </div>
            <div class="position-absolute top-0 end-0 m-2">
              <button class="btn btn-xs btn-light p-1 rounded-circle ss-zoom-btn" data-src="${ss.src}" data-title="${ss.title}">
                <i class="bi bi-zoom-in"></i>
              </button>
            </div>
          </div>

          <div class="p-3 flex-grow-1 d-flex flex-column">
            <h6 class="font-bold text-main text-truncate mb-1">${ss.title}</h6>
            <div class="text-2xs text-muted mb-3"><i class="bi bi-calendar"></i> ${ss.date}</div>

            <div class="d-flex flex-wrap gap-1 mb-3">
              ${ss.tags.map(t => `<span class="badge bg-light text-muted border text-2xs">#${t}</span>`).join('')}
            </div>

            <button class="btn btn-sm btn-link text-danger p-0 mt-auto text-start ss-delete-btn" data-id="${ss.id}"><i class="bi bi-trash-fill"></i> Remove screenshot</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openUploadDrawer() {
    const html = `
      <form id="ss-upload-drawer-form">
        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Image File Upload</label>
          <input type="file" id="ss-file-input" class="form-control" accept="image/*" required>
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Custom Title</label>
          <input type="text" id="ss-title-input" class="form-control" placeholder="Provide description title (Optional)">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Vault Folder Category</label>
          <input type="text" id="ss-cat-input" class="form-control" placeholder="UI Design, Bugs, Sandbox" value="UI Design">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-sm">Tags (Comma separated)</label>
          <input type="text" id="ss-tags-input" class="form-control" placeholder="wireframe, mock, dashboard">
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mt-3" id="ss-submit-btn">Upload Screenshot</button>
      </form>
    `;

    this.app.openDrawer('Upload Screenshot Vault', html, (content) => {
      content.querySelector('#ss-upload-drawer-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = content.querySelector('#ss-file-input').files[0];
        const title = content.querySelector('#ss-title-input').value;
        const category = content.querySelector('#ss-cat-input').value || 'UI Design';
        const tags = content.querySelector('#ss-tags-input').value.split(',').filter(Boolean);

        if (!file) return;

        const btn = content.querySelector('#ss-submit-btn');
        btn.disabled = true;
        btn.textContent = "Processing image...";

        try {
          await window.screenshotService.addScreenshot(title, file, category, tags);
          window.notificationService.showToast('Screenshot compressed and saved', 'success');
          this.app.closeDrawer();
          
          this.render(document.getElementById('app-view-container'));
          this.init(document.getElementById('app-view-container'));
        } catch (err) {
          window.notificationService.showToast(err.message, 'danger');
          btn.disabled = false;
          btn.textContent = "Upload Screenshot";
        }
      });
    });
  }

  destroy() {}
}
// Global declaration
window.ScreenshotsView = window.ScreenshotsView;
