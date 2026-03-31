/**
 * UI & Interactions
 */
const UI = {
    init() {
        this.bindEvents();
        this.checkAuth();
        this.renderUser();
        this.applyTheme();
    },

    bindEvents() {
        // Sidebar Toggle
        $(document).on('click', '#sidebarCollapse', function () {
            $('#sidebar, #content').toggleClass('active');
        });
    },

    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    },

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        this.applyTheme();
    },

    applyTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        $('#themeToggle i').removeClass('fa-moon fa-sun').addClass(icon);
    },

    checkAuth() {
        const session = StorageManager.getSession();
        const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
        
        if (!session && !isLoginPage) {
            window.location.href = 'index.html';
        } else if (session && (isLoginPage || window.location.pathname.includes('index.html'))) {
            window.location.href = 'app.html';
        }
    },

    showToast(title, message, type = 'primary') {
        const toastHtml = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1060">
                <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <strong>${title}</strong>: ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(toastHtml);
        const toastEl = $('.toast').last();
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        toastEl.on('hidden.bs.toast', function() { $(this).parent().remove(); });
    },

    showLoader(selector) {
        $(selector).html(`
            <div class="d-flex justify-content-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
    }
};

$(document).ready(() => UI.init());
