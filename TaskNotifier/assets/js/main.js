/* 
   ==========================================================================
   Corporate Smart Assistant - Main JS (jQuery + LocalStorage)
   ==========================================================================
*/

const STORAGE_KEY = 'tasknotifier_state';

const defaultState = {
    profile: {
        name: 'জন ডয়',
        role: 'প্রোডাক্ট ম্যানেজার @ টেক-কর্প',
        email: 'john.doe@techcorp.com',
        bio: 'রিয়েল-ওয়ার্ল্ড সমস্যা সমাধান করে এমন প্রোডাক্ট তৈরিতে আমি আগ্রহী।',
        timezone: 'ঢাকা (UTC+6)',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff'
    },
    tasks: [
        { id: 1, title: 'ত্রৈমাসিক রিপোর্ট আপডেট করুন', dueDate: '২০২৪-১০-২৪', priority: 'উচ্চ', completed: false },
        { id: 2, title: 'ক্লায়েন্ট ফিডব্যাক মিটিং', dueDate: '২০২৪-১০-২৫', priority: 'মাঝারি', completed: true },
        { id: 3, title: 'সিস্টেম ডকুমেন্টেশন আপডেট', dueDate: '২০২৪-১০-২৬', priority: 'নিম্ন', completed: false }
    ],
    notifications: [
        { id: 1, type: 'info', title: 'নতুন টাস্ক বরাদ্দ করা হয়েছে', message: 'সারা আপনাকে "ডিজাইন রিভিউ" টাস্কটি দিয়েছে।', time: '২ মিনিট আগে', read: false },
        { id: 2, type: 'warning', title: 'ডেডলাইন আসন্ন', message: '"স্কাইলাইন" প্রজেক্টটি ৩ ঘণ্টার মধ্যে শেষ করতে হবে।', time: '১ ঘণ্টা আগে', read: false }
    ],
    chatHistory: [
        { sender: 'bot', message: 'হ্যালো! আমি আপনার স্মার্ট অ্যাসিস্ট্যান্ট। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' }
    ]
};

// --- Data Management ---
function getState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- UI Rendering ---
function updateGlobalUI() {
    const state = getState();
    // Update Sidebar & Topbar Profile
    $('.profile-name').text(state.profile.name);
    $('.profile-role').text(state.profile.role);
    $('.profile-avatar').attr('src', state.profile.avatar);
    $('.notif-count').text(state.notifications.filter(n => !n.read).length);
}

function renderTasks(page = 'dashboard') {
    const state = getState();
    const container = $('#task-list');
    if (!container.length) return;

    container.empty();
    const tasksToRender = page === 'dashboard' ? state.tasks.slice(0, 3) : state.tasks;

    tasksToRender.forEach(task => {
        const priorityClass = task.priority === 'উচ্চ' ? 'bg-danger-subtle text-danger' : 
                            (task.priority === 'মাঝারি' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info');
        
        const html = `
            <div class="task-item px-4 ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="form-check-input me-3 task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="flex-grow-1">
                    <span class="d-block fw-bold">${task.title}</span>
                    <small class="text-secondary"><i class="far fa-calendar-alt me-1"></i> শেষ সময়: ${task.dueDate}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="badge ${priorityClass} rounded-pill px-3">${task.priority}</span>
                    <button class="btn btn-sm text-danger delete-task"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        container.append(html);
    });

    // Update Dashboard Counter
    if (page === 'dashboard') {
        $('.pending-tasks-count').text(state.tasks.filter(t => !t.completed).length);
    }
}

function renderNotifications() {
    const container = $('#notif-list');
    if (!container.length) return;

    const state = getState();
    container.empty();

    state.notifications.forEach(notif => {
        const iconClass = notif.type === 'info' ? 'bg-primary' : (notif.type === 'warning' ? 'bg-warning' : 'bg-success');
        const icon = notif.type === 'info' ? 'fa-info-circle' : (notif.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check');

        const html = `
            <div class="p-4 border-bottom ${notif.read ? '' : 'bg-light'}">
                <div class="d-flex align-items-start">
                    <div class="${iconClass} text-white rounded-circle p-2 me-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="mb-0 fw-bold">${notif.title}</h6>
                            <small class="text-secondary">${notif.time}</small>
                        </div>
                        <p class="text-secondary small mb-0">${notif.message}</p>
                    </div>
                </div>
            </div>
        `;
        container.append(html);
    });
}

function renderChat() {
    const container = $('#chatWindow');
    if (!container.length) return;

    const state = getState();
    container.empty();
    state.chatHistory.forEach(chat => {
        container.append(`
            <div class="chat-bubble ${chat.sender === 'bot' ? 'bot' : 'user'}">
                ${chat.message}
            </div>
        `);
    });
    container.scrollTop(container[0].scrollHeight);
}

// --- Event Handlers ---
$(document).ready(function() {
    updateGlobalUI();

    // Sidebar Toggle
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });

    // Task Completion Toggle
    $(document).on('change', '.task-checkbox', function() {
        const id = $(this).closest('.task-item').data('id');
        const state = getState();
        const task = state.tasks.find(t => t.id == id);
        if (task) {
            task.completed = $(this).is(':checked');
            saveState(state);
            $(this).closest('.task-item').toggleClass('completed');
            updateGlobalUI();
        }
    });

    // Delete Task
    $(document).on('click', '.delete-task', function() {
        const id = $(this).closest('.task-item').data('id');
        const state = getState();
        state.tasks = state.tasks.filter(t => t.id != id);
        saveState(state);
        $(this).closest('.task-item').fadeOut(300, function() { $(this).remove(); });
        updateGlobalUI();
    });

    // Add Task
    $('#addTaskForm').on('submit', function(e) {
        e.preventDefault();
        const state = getState();
        const newTask = {
            id: Date.now(),
            title: $('#taskTitle').val(),
            dueDate: $('#taskDate').val(),
            priority: $('#taskPriority').val(),
            completed: false
        };
        state.tasks.push(newTask);
        saveState(state);
        renderTasks($('main').hasClass('tasks-page') ? 'tasks' : 'dashboard');
        bootstrap.Modal.getInstance($('#addTaskModal')).hide();
        this.reset();
        updateGlobalUI();
    });

    // Profile Update
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        const state = getState();
        state.profile.name = $('#pName').val();
        state.profile.bio = $('#pBio').val();
        state.profile.timezone = $('#pTimezone').val();
        saveState(state);
        updateGlobalUI();
        const toast = bootstrap.Toast.getOrCreateInstance($('#saveToast')[0]);
        toast.show();
    });

    // AI Chat
    $('#chat-form').on('submit', function(e) {
        e.preventDefault();
        const input = $('#chat-input').val();
        if (!input.trim()) return;

        const state = getState();
        state.chatHistory.push({ sender: 'user', message: input });
        saveState(state);
        renderChat();
        $('#chat-input').val('');

        setTimeout(() => {
            const botMsg = `আমি আপনার "${input}" নিয়ে কাজ করছি। আর কোনো সাহায্য লাগবে?`;
            state.chatHistory.push({ sender: 'bot', message: botMsg });
            saveState(state);
            renderChat();
        }, 1000);
    });

    // Page Specific Initial Renders
    if ($('#task-list').length) renderTasks($('main').hasClass('tasks-page') ? 'tasks' : 'dashboard');
    if ($('#notif-list').length) renderNotifications();
    if ($('#chatWindow').length) renderChat();
});
