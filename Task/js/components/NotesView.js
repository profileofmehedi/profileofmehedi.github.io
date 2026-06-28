// Notes View Component (UI Module)
// Implements sticky notes grids with markdown renders, color pickers, pinning, and archives.
// Globally Scoped.

window.NotesView = class NotesView {
  constructor(app) {
    this.app = app;
    this.searchQuery = '';
    this.viewMode = 'active';
    this.deletedBackup = null;
  }

  getNotes() {
    const list = window.storageService.get('notes') || [];
    let filtered = list.filter(n => this.viewMode === 'archived' ? n.archived : !n.archived);

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    return filtered;
  }

  render(container) {
    const allNotes = this.getNotes();
    const pinned = allNotes.filter(n => n.pinned);
    const unpinned = allNotes.filter(n => !n.pinned);

    const allStorageNotes = window.storageService.get('notes') || [];
    const activeCount = allStorageNotes.filter(n => !n.archived).length;
    const archivedCount = allStorageNotes.filter(n => n.archived).length;
    const pinnedCount = allStorageNotes.filter(n => n.pinned && !n.archived).length;
    
    let totalCheckItems = 0;
    let completedCheckItems = 0;
    allStorageNotes.forEach(note => {
      if (note.content) {
        const totalMatches = note.content.match(/- \[[ xX]\]/g);
        const completedMatches = note.content.match(/- \[[xX]\]/g);
        if (totalMatches) totalCheckItems += totalMatches.length;
        if (completedMatches) completedCheckItems += completedMatches.length;
      }
    });
    
    const checklistProgress = totalCheckItems > 0 ? Math.round((completedCheckItems / totalCheckItems) * 100) : 100;

    container.innerHTML = `
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 class="font-bold mb-1">Sticky Scratch Notes</h2>
            <p class="text-muted text-sm mb-0">Markdown-enabled sticky notepad. Double-click any note to edit.</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm text-xs font-semibold" id="notes-mode-toggle-btn">
              <i class="bi bi-archive-fill"></i> View ${this.viewMode === 'active' ? 'Archive' : 'Active'}
            </button>
            <button class="btn btn-primary btn-sm font-semibold" id="note-add-btn">
              <i class="bi bi-plus-lg"></i> Add Note
            </button>
          </div>
        </div>

        <!-- Stats Summary Bar -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; flex-shrink: 0;">
                <i class="bi bi-sticky"></i>
              </div>
              <div>
                <div class="text-2xs text-muted font-bold text-uppercase">Active Notes</div>
                <div class="h4 font-bold mb-0 text-main">${activeCount}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; flex-shrink: 0;">
                <i class="bi bi-pin-angle"></i>
              </div>
              <div>
                <div class="text-2xs text-muted font-bold text-uppercase">Pinned Notes</div>
                <div class="h4 font-bold mb-0 text-warning">${pinnedCount}</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(16, 185, 129, 0.1); color: #10b981; flex-shrink: 0;">
                <i class="bi bi-check2-all"></i>
              </div>
              <div>
                <div class="text-2xs text-muted font-bold text-uppercase">Checklist Tasks</div>
                <div class="h4 font-bold mb-0 text-main">${completedCheckItems}/${totalCheckItems} <span class="text-muted text-xs font-semibold">(${checklistProgress}%)</span></div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="premium-card p-3 d-flex align-items-center gap-3 h-100">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.25rem; background-color: rgba(108, 117, 125, 0.1); color: #6c757d; flex-shrink: 0;">
                <i class="bi bi-archive"></i>
              </div>
              <div>
                <div class="text-2xs text-muted font-bold text-uppercase">Archived Notes</div>
                <div class="h4 font-bold mb-0 text-main">${archivedCount}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Note Creation Card -->
        <div class="premium-card p-3 mb-4">
          <h6 class="font-bold text-xs text-uppercase text-muted mb-2"><i class="bi bi-lightning-charge"></i> Quick Note Creator</h6>
          <form id="quick-note-form" class="row g-2 align-items-center">
            <div class="col-md-4">
              <input type="text" id="quick-note-title" class="form-control form-control-sm text-sm" placeholder="Note Title (e.g. Shopping List, Idea)..." required>
            </div>
            <div class="col-md-5">
              <input type="text" id="quick-note-content" class="form-control form-control-sm text-sm" placeholder="Write content note (markdown supported)..." required>
            </div>
            <div class="col-md-2">
              <select id="quick-note-color" class="form-select form-select-sm text-xs">
                <option value="#fef3c7" selected>🟡 Yellow</option>
                <option value="#dbeafe">🔵 Blue</option>
                <option value="#d1fae5">🟢 Green</option>
                <option value="#f3e8ff">🟣 Purple</option>
                <option value="#fee2e2">🔴 Red</option>
              </select>
            </div>
            <div class="col-md-1">
              <button type="submit" class="btn btn-primary btn-sm font-semibold w-100 py-1"><i class="bi bi-plus-lg"></i> Add</button>
            </div>
          </form>
        </div>

        <!-- Search Bar -->
        <div class="premium-card p-3 mb-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input type="text" id="note-search-input" class="form-control border-start-0" placeholder="Search sticky notes title or content..." value="${this.searchQuery}">
          </div>
        </div>

        <!-- Pinned Notes Section -->
        ${pinned.length > 0 ? `
          <h6 class="font-bold text-xs text-uppercase text-muted mb-3"><i class="bi bi-pin-angle-fill text-primary"></i> Pinned Notes</h6>
          <div class="row g-3 mb-4">
            ${this.buildNotesGridHtml(pinned)}
          </div>
        ` : ''}

        <!-- Regular Notes Section -->
        ${pinned.length > 0 && unpinned.length > 0 ? `<h6 class="font-bold text-xs text-uppercase text-muted mb-3">Other Notes</h6>` : ''}
        <div class="row g-3">
          ${this.buildNotesGridHtml(unpinned)}
        </div>
      </div>
    `;
  }

  init(container) {
    // Quick Note Submission
    const quickForm = container.querySelector('#quick-note-form');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#quick-note-title').value.trim();
        const content = container.querySelector('#quick-note-content').value.trim();
        const color = container.querySelector('#quick-note-color').value;

        const list = window.storageService.get('notes') || [];
        list.push({
          id: 'note_' + Date.now(),
          title,
          content,
          color,
          pinned: false,
          archived: false,
          updatedAt: new Date().toISOString()
        });

        window.storageService.set('notes', list);
        window.notificationService.showToast('Quick note card added!', 'success');

        this.render(container);
        this.init(container);
      });
    }

    container.querySelectorAll('.note-sticky-card').forEach(card => {
      card.addEventListener('dblclick', () => {
        this.openNoteEditDrawer(card.getAttribute('data-id'));
      });
    });

    container.querySelector('#note-add-btn').addEventListener('click', () => {
      this.openNoteEditDrawer(null);
    });

    const search = container.querySelector('#note-search-input');
    search.addEventListener('input', () => {
      this.searchQuery = search.value;
      const filtered = this.getNotes();
      this.refreshNotesGrid(container, filtered);
    });

    container.querySelector('#notes-mode-toggle-btn').addEventListener('click', () => {
      this.viewMode = this.viewMode === 'active' ? 'archived' : 'active';
      this.render(container);
      this.init(container);
    });

    container.querySelectorAll('.pin-note-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleField(btn.getAttribute('data-id'), 'pinned');
      });
    });

    container.querySelectorAll('.archive-note-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleField(btn.getAttribute('data-id'), 'archived');
      });
    });

    container.querySelectorAll('.delete-note-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteNote(btn.getAttribute('data-id'));
      });
    });
  }

  refreshNotesGrid(container, list) {
    this.render(container);
    this.init(container);
  }

  buildNotesGridHtml(list) {
    if (list.length === 0) {
      return `
        <div class="col-12 text-center py-4">
          <p class="text-muted text-xs my-0">No notes found here.</p>
        </div>
      `;
    }

    return list.map(note => {
      let renderedMarkdown = 'No text content.';
      if (note.content) {
        try {
          renderedMarkdown = marked.parse(note.content);
        } catch (e) {
          renderedMarkdown = note.content;
        }
      }

      const isDarkBackground = ['#64748b', '#475569'].includes(note.color);
      const textColor = isDarkBackground ? 'text-white' : 'text-dark';

      return `
        <div class="col-md-6 col-lg-4">
          <div class="note-card note-sticky-card cursor-pointer h-100 d-flex flex-column" data-id="${note.id}" style="background-color:${note.color || '#fff3cd'}; min-height: 200px;">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="font-bold ${textColor} mb-0" style="max-width:80%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${note.title}</h6>
              <i class="bi bi-pin-angle-fill pin-note-quick ${note.pinned ? 'text-primary' : 'text-muted'}" data-id="${note.id}" style="font-size: 1.1rem; cursor:pointer;" title="Pin Note"></i>
            </div>
            
            <div class="text-xs flex-grow-1 note-markdown-content overflow-y-auto mb-3 ${textColor}" style="max-height:140px; line-height:1.4;">
              ${renderedMarkdown}
            </div>
 
            <div class="d-flex justify-content-between align-items-center note-actions mt-auto border-top pt-2">
              <span class="text-2xs text-muted font-semibold">${new Date(note.updatedAt).toLocaleDateString()}</span>
              <div class="d-flex gap-2">
                <button class="btn btn-xs btn-link p-0 text-muted archive-note-quick" data-id="${note.id}" title="${note.archived ? 'Activate' : 'Archive'}">
                  <i class="bi ${note.archived ? 'bi-arrow-up-right-circle' : 'bi-archive-fill'}"></i>
                </button>
                <button class="btn btn-xs btn-link p-0 text-danger delete-note-quick" data-id="${note.id}" title="Delete Note">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleField(id, fieldName) {
    const list = window.storageService.get('notes') || [];
    const index = list.findIndex(n => n.id === id);
    if (index === -1) return;

    list[index][fieldName] = !list[index][fieldName];
    list[index].updatedAt = new Date().toISOString();
    
    window.storageService.set('notes', list);
    window.notificationService.showToast(`Note updated`, 'success');
    
    this.render(document.getElementById('app-view-container'));
    this.init(document.getElementById('app-view-container'));
  }

  deleteNote(id) {
    const list = window.storageService.get('notes') || [];
    const target = list.find(n => n.id === id);
    if (!target) return;

    this.deletedBackup = target;

    const filtered = list.filter(n => n.id !== id);
    window.storageService.set('notes', filtered);
    
    window.notificationService.showToast('Note deleted. Press Undo to restore.', 'warning');

    const undoBtn = document.createElement('button');
    undoBtn.className = 'btn btn-xs btn-light text-dark font-semibold px-2 py-0 ms-2 text-2xs';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      if (this.deletedBackup) {
        const currentList = window.storageService.get('notes') || [];
        currentList.push(this.deletedBackup);
        window.storageService.set('notes', currentList);
        this.deletedBackup = null;
        window.notificationService.showToast('Note restored successfully', 'success');
        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      }
    });

    const body = document.querySelector('#lifeos-toast .toast-body');
    if (body) body.appendChild(undoBtn);

    this.render(document.getElementById('app-view-container'));
    this.init(document.getElementById('app-view-container'));
  }

  openNoteEditDrawer(noteId) {
    const isNew = !noteId;
    const note = isNew ? {
      title: '', content: '', color: '#fef3c7', pinned: false, archived: false, updatedAt: new Date().toISOString()
    } : (window.storageService.get('notes') || []).find(n => n.id === noteId);

    if (!note) return;

    const titleText = isNew ? "Create New Sticky Note" : "Edit Note Content";
    const colors = [
      { name: 'Yellow', code: '#fef3c7' },
      { name: 'Blue', code: '#dbeafe' },
      { name: 'Green', code: '#d1fae5' },
      { name: 'Purple', code: '#f3e8ff' },
      { name: 'Red', code: '#fee2e2' },
      { name: 'Slate Dark', code: '#64748b' }
    ];

    const html = `
      <form id="note-edit-drawer-form" class="text-sm">
        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Note Title</label>
          <input type="text" id="edit-note-title" class="form-control font-bold" value="${note.title}" required placeholder="Name this note card...">
        </div>

        <div class="mb-3">
          <label class="form-label font-semibold text-xs text-uppercase">Sticky Notes Background</label>
          <div class="d-flex gap-2 flex-wrap">
            ${colors.map(c => `
              <div class="note-color-picker cursor-pointer border" data-color="${c.code}" style="width:28px; height:28px; border-radius:5px; background-color:${c.code}; border: ${note.color === c.code ? '3px solid #000 !important' : '1px solid #ddd !important'};" title="${c.name}"></div>
            `).join('')}
          </div>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label font-semibold text-xs text-uppercase mb-0">Markdown Content Body</label>
            <button class="btn btn-xs btn-outline-secondary py-0 px-2 text-2xs" type="button" id="edit-note-checklist-builder-btn">+ Insert Checklist</button>
          </div>
          <textarea id="edit-note-content" class="form-control text-xs font-monospace" rows="12" placeholder="Write thoughts, checklist markdown - [ ] Item, or headings..." required>${note.content}</textarea>
        </div>

        <div class="d-flex gap-3 mb-4">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="edit-note-pinned" ${note.pinned ? 'checked' : ''}>
            <label class="form-check-label text-sm" for="edit-note-pinned"><i class="bi bi-pin-angle"></i> Pinned</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="edit-note-archived" ${note.archived ? 'checked' : ''}>
            <label class="form-check-label text-sm" for="edit-note-archived"><i class="bi bi-archive"></i> Archived</label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 font-semibold mb-3">Save Changes</button>
      </form>
    `;

    this.app.openDrawer(titleText, html, (content) => {
      let selectedColor = note.color;

      content.querySelectorAll('.note-color-picker').forEach(dot => {
        dot.addEventListener('click', () => {
          content.querySelectorAll('.note-color-picker').forEach(d => d.style.border = '1px solid #ddd');
          dot.style.border = '3px solid #000';
          selectedColor = dot.getAttribute('data-color');
        });
      });

      const txt = content.querySelector('#edit-note-content');
      content.querySelector('#edit-note-checklist-builder-btn').addEventListener('click', () => {
        const start = txt.selectionStart;
        const end = txt.selectionEnd;
        const insertText = "\n- [ ] Checklist item 1\n- [ ] Checklist item 2\n";
        txt.value = txt.value.substring(0, start) + insertText + txt.value.substring(end);
        txt.focus();
      });

      content.querySelector('#note-edit-drawer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const list = window.storageService.get('notes') || [];

        const updatedFields = {
          title: content.querySelector('#edit-note-title').value,
          content: txt.value,
          color: selectedColor,
          pinned: content.querySelector('#edit-note-pinned').checked,
          archived: content.querySelector('#edit-note-archived').checked,
          updatedAt: new Date().toISOString()
        };

        if (isNew) {
          updatedFields.id = 'note_' + Date.now();
          list.push(updatedFields);
          window.notificationService.showToast('Note card created', 'success');
        } else {
          const index = list.findIndex(n => n.id === noteId);
          if (index > -1) {
            list[index] = { ...list[index], ...updatedFields };
          }
          window.notificationService.showToast('Note card updated', 'success');
        }

        window.storageService.set('notes', list);
        this.app.closeDrawer();

        this.render(document.getElementById('app-view-container'));
        this.init(document.getElementById('app-view-container'));
      });
    });
  }

  destroy() {}
}
