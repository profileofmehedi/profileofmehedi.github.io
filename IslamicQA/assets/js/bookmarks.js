/**
 * DEENQUEST - Unified Bookmarks Manager
 * Stores bookmarks in LocalStorage across Questions, Ayahs, Hadiths, and Reflections.
 */

const BookmarkManager = {
  STORAGE_KEY: "deenquest_bookmarks",

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading bookmarks", e);
      return [];
    }
  },

  isBookmarked(id) {
    const list = this.getAll();
    return list.some(item => item.id === id);
  },

  toggle(item) {
    let list = this.getAll();
    const index = list.findIndex(b => b.id === item.id);
    let added = false;

    if (index >= 0) {
      list.splice(index, 1);
      added = false;
    } else {
      list.unshift({
        id: item.id,
        type: item.type || "question", // question, ayah, hadith, reflection
        title: item.title,
        subtitle: item.subtitle || "",
        link: item.link || "#",
        dateAdded: new Date().toISOString()
      });
      added = true;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.updateBadge();

    // Trigger toast notification
    if (window.DeenApp && window.DeenApp.showToast) {
      const msg = added 
        ? (window.LangManager ? window.LangManager.get("bookmarkedToast") : "Saved to bookmarks!")
        : (window.LangManager ? window.LangManager.get("bookmarkRemovedToast") : "Removed from bookmarks.");
      window.DeenApp.showToast(msg);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent("deenquest:bookmarksUpdated", { detail: { list, added, itemId: item.id } }));
    return added;
  },

  remove(id) {
    let list = this.getAll();
    list = list.filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent("deenquest:bookmarksUpdated", { detail: { list, itemId: id } }));
  },

  clearAll() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent("deenquest:bookmarksUpdated", { detail: { list: [] } }));
  },

  updateBadge() {
    const count = this.getAll().length;
    document.querySelectorAll(".bookmark-badge").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  init() {
    this.updateBadge();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  BookmarkManager.init();
});
