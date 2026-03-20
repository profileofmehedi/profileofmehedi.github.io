/* 
   ==========================================================================
   Corporate Smart Assistant - Advanced Main JS (Theme + Data + Analytics)
   ==========================================================================
*/

const STORAGE_KEY = 'tasknotifier_advanced_state';

const defaultState = {
    theme: 'light',
    profile: {
        name: 'জন ডয়',
        role: 'প্রোডাক্ট ম্যানেজার @ টেক-কর্প',
        email: 'john.doe@techcorp.com',
        bio: 'রিয়েল-ওয়ার্ল্ড সমস্যা সমাধান করে এমন প্রোডাক্ট তৈরিতে আমি আগ্রহী।',
        timezone: 'ঢাকা (UTC+6)',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff'
    },
    tasks: [
        { id: 1, title: 'ত্রৈমাসিক রিপোর্ট আপডেট করুন', dueDate: '২০২৪-১০-২৪', priority: 'উচ্চ', completed: false, category: 'অফিস' },
        { id: 2, title: 'ক্লায়েন্ট ফিডব্যাক মিটিং', dueDate: '২০২৪-১০-২৫', priority: 'মাঝারি', completed: true, category: 'মিটিং' },
        { id: 3, title: 'সিস্টেম ডকুমেন্টেশন আপডেট', dueDate: '২০২৪-১০-২৬', priority: 'নিম্ন', completed: false, category: 'প্রযুক্তি' }
    ],
    notifications: [
        { id: 1, type: 'info', title: 'নতুন টাস্ক বরাদ্দ করা হয়েছে', message: 'সারা আপনাকে "ডিজাইন রিভিউ" টাস্কটি দিয়েছে।', time: '২ মিনিট আগে', read: false },
        { id: 2, type: 'warning', title: 'ডেডলাইন আসন্ন', message: '"স্কাইলাইন" প্রজেক্টটি ৩ ঘণ্টার মধ্যে শেষ করতে হবে।', time: '১ ঘণ্টা আগে', read: false }
    ],
    chatHistory: [
        { sender: 'bot', message: 'হ্যালো! আমি আপনার স্মার্ট অ্যাসিস্ট্যান্ট। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' }
    ]
};

// --- Core Logic ---
function getState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toggleTheme() {
    const state = getState();
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    saveState(state);
    applyTheme();
}

function applyTheme() {
    const state = getState();
    document.documentElement.setAttribute('data-theme', state.theme);
    $('.theme-icon').attr('class', state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun');
}

// --- Analytics ---
function calculateProgress() {
    const state = getState();
    if (state.tasks.length === 0) return 0;
    const completed = state.tasks.filter(t => t.completed).length;
    return Math.round((completed / state.tasks.length) * 100);
}

function updateAnalyticsUI() {
    const progress = calculateProgress();
    const circle = $('.donut-chart .progress');
    if (circle.length) {
        const offset = 339.292 * (1 - progress / 100); // 2 * PI * r (r=54)
        circle.css('stroke-dashoffset', offset);
        $('.progress-text').text(progress + '%');
    }
    $('.pending-tasks-count').text(getState().tasks.filter(t => !t.completed).length);
}

// --- Dynamic Rendering ---
function renderAdvancedTasks(filter = 'all') {
    const state = getState();
    const container = $('#task-list');
    if (!container.length) return;

    container.empty();
    let filteredTasks = state.tasks;
    if (filter === 'completed') filteredTasks = state.tasks.filter(t => t.completed);
    if (filter === 'pending') filteredTasks = state.tasks.filter(t => !t.completed);

    filteredTasks.forEach((task, index) => {
        const priorityColor = task.priority === 'উচ্চ' ? 'danger' : (task.priority === 'মাঝারি' ? 'warning' : 'info');
        const html = `
            <div class="task-item px-4 slide-up" style="animation-delay: ${index * 0.1}s" data-id="${task.id}">
                <div class="form-check me-3">
                    <input type="checkbox" class="form-check-input task-checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="flex-grow-1">
                    <span class="d-block fw-bold ${task.completed ? 'text-decoration-line-through text-secondary' : ''}">${task.title}</span>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <span class="badge bg-light text-secondary border small" style="font-size: 0.65rem;">${task.category || 'সাধারণ'}</span>
                        <small class="text-secondary small"><i class="far fa-clock me-1"></i>${task.dueDate}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-${priorityColor}-subtle text-${priorityColor} rounded-pill px-3">${task.priority}</span>
                    <div class="dropdown">
                        <button class="btn btn-sm text-secondary" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                            <li><a class="dropdown-item delete-task text-danger" href="#"><i class="fas fa-trash me-2"></i>মুছে ফেলুন</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        container.append(html);
    });
    updateAnalyticsUI();
}

function updateGlobalUI() {
    const state = getState();
    $('.profile-name').text(state.profile.name);
    $('.profile-role').text(state.profile.role);
    $('.profile-avatar').attr('src', state.profile.avatar);
    $('.notif-count').text(state.notifications.filter(n => !n.read).length);
    applyTheme();
    updateAnalyticsUI();
}

// --- Event Handlers ---
$(document).ready(function() {
    updateGlobalUI();

    // Theme Toggle
    $(document).on('click', '#themeToggle', toggleTheme);

    // Sidebar
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('active');
        if ($('.sidebar-overlay').length === 0) $('body').append('<div class="sidebar-overlay"></div>');
        $('.sidebar-overlay').toggleClass('active');
    });

    $(document).on('click', '.sidebar-overlay', function() {
        $('.sidebar').removeClass('active');
        $(this).removeClass('active');
    });

    // Task Interactions
    $(document).on('change', '.task-checkbox', function() {
        const id = $(this).closest('.task-item').data('id');
        const state = getState();
        const task = state.tasks.find(t => t.id == id);
        if (task) {
            task.completed = $(this).is(':checked');
            saveState(state);
            renderAdvancedTasks();
        }
    });

    $(document).on('click', '.delete-task', function(e) {
        e.preventDefault();
        const id = $(this).closest('.task-item').data('id');
        const state = getState();
        state.tasks = state.tasks.filter(t => t.id != id);
        saveState(state);
        $(this).closest('.task-item').fadeOut(300, renderAdvancedTasks);
    });

    // Filter Tasks
    $('.task-filter').on('click', function() {
        $('.task-filter').removeClass('btn-primary').addClass('btn-outline-secondary');
        $(this).removeClass('btn-outline-secondary').addClass('btn-primary');
        renderAdvancedTasks($(this).data('filter'));
    });

    // Search Tasks
    $('#taskSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        $(".task-item").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // Initial Renders
    if ($('#task-list').length) renderAdvancedTasks();
});
