$(document).ready(function() {
    // --- Initialization & Data Management ---
    const CURRENT_VERSION = '1.2'; 
    if (localStorage.getItem('dncc_version') !== CURRENT_VERSION) {
        const demoUsers = [
            { id: 1, name: 'মোঃ ইউজার', email: 'user@example.com', password: '123456', role: 'user', phone: '01712345678', nid: '1234567890' }
        ];
        const demoLicenses = [
            { id: 101, userId: 1, licenseNo: 'DNCC-2025-00123', businessName: 'মেসার্স এক্সামপল এন্টারপ্রাইজ', type: 'সাধারণ ট্রেডিং', expiry: '৩০ জুন ২০২৬', status: 'Active', qr: 'assets/img/qr_mock.png' },
            { id: 102, userId: 1, licenseNo: 'DNCC-2022-09876', businessName: 'রহিম বস্ত্রালয়', type: 'বস্ত্র বিক্রয়', expiry: '৩০ জুন ২০২৩', status: 'Expired', qr: 'assets/img/qr_mock.png' }
        ];
        const demoApplications = [
            { id: 'APP-2026-890', userName: 'মোঃ ইউজার', businessName: 'মেসার্স এক্সামপল এন্টারপ্রাইজ', date: '১৫ মার্চ, ২০২৬', status: 'Pending' },
            { id: 'APP-2026-889', userName: 'আব্দুল করিম', businessName: 'করিম হার্ডওয়্যার', date: '১৪ মার্চ, ২০২৬', status: 'Pending' },
            { id: 'APP-2026-885', userName: 'সালেহা বেগম', businessName: 'সালেহা বুটিকস', date: '১৩ মার্চ, ২০২৬', status: 'Approved' }
        ];
        const demoNotifications = [
            { id: 1, text: 'আপনার লাইসেন্স নবায়নের আবেদন অনুমোদিত হয়েছে।', time: '২ ঘণ্টা আগে', read: false },
            { id: 2, text: 'নতুন ট্রেড লাইসেন্স পলিসি ২০২৬ আপডেট করা হয়েছে।', time: '১ দিন আগে', read: true }
        ];

        localStorage.setItem('dncc_users', JSON.stringify(demoUsers));
        localStorage.setItem('dncc_licenses', JSON.stringify(demoLicenses));
        localStorage.setItem('dncc_applications', JSON.stringify(demoApplications));
        localStorage.setItem('dncc_notifications', JSON.stringify(demoNotifications));
        localStorage.setItem('dncc_version', CURRENT_VERSION);
        localStorage.setItem('dncc_initialized', true);
    }

    // --- Global Helpers ---
    const user = JSON.parse(localStorage.getItem('dncc_logged_in'));
    if (user) {
        $('#userNameTopbar, #userNameDisplay, #profNameTitle').text(user.name);
        updateNotificationCount();
    }

    function updateNotificationCount() {
        const notes = JSON.parse(localStorage.getItem('dncc_notifications')) || [];
        const unread = notes.filter(n => !n.read).length;
        if (unread > 0) {
            $('.notification-badge').text(unread).show();
        } else {
            $('.notification-badge').hide();
        }
    }

    // --- Login Logic ---
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        handleLogin($('#email').val(), $('#password').val(), $('#role').val());
    });

    $('.quick-login-btn').on('click', function() {
        const role = $(this).data('role');
        const email = role === 'admin' ? 'admin@dncc.gov.bd' : 'user@example.com';
        handleLogin(email, '123456', role);
    });

    function handleLogin(email, password, role) {
        if (role === 'admin' && email === 'admin@dncc.gov.bd' && password === '123456') {
            localStorage.setItem('dncc_logged_in', JSON.stringify({ role: 'admin', name: 'অ্যাডমিন' }));
            window.location.href = 'admin_dashboard.html';
        } else {
            const users = JSON.parse(localStorage.getItem('dncc_users'));
            const u = users.find(u => u.email === email && u.password === password);
            if (u) {
                localStorage.setItem('dncc_logged_in', JSON.stringify(u));
                window.location.href = 'user_dashboard.html';
            } else {
                Swal.fire('ভুল তথ্য!', 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।', 'error');
            }
        }
    }

    // --- Dashboards ---
    if (window.location.pathname.includes('user_dashboard.html')) {
        renderUserLicenses();
        initUserChart();
    }

    if (window.location.pathname.includes('admin_dashboard.html')) {
        renderAdminApplications();
        initAdminChart();
    }

    function renderUserLicenses() {
        const licenses = JSON.parse(localStorage.getItem('dncc_licenses'));
        const tbody = $('#licenseTableBody');
        if (tbody.length) {
            tbody.empty();
            licenses.forEach(lic => {
                const statusBadge = lic.status === 'Active' ? 'bg-success' : 'bg-danger';
                tbody.append(`
                    <tr>
                        <td>${lic.licenseNo} <i class="fa-solid fa-qrcode ms-2 text-muted" title="QR Verified"></i></td>
                        <td>${lic.businessName}</td>
                        <td>${lic.type}</td>
                        <td>${lic.expiry}</td>
                        <td><span class="badge ${statusBadge}">${lic.status}</span></td>
                        <td>
                            <a href="renew_license.html?id=${lic.id}" class="btn btn-sm btn-warning"><i class="fa-solid fa-rotate-right"></i> নবায়ন</a>
                            <button class="btn btn-sm btn-info text-white print-btn"><i class="fa-solid fa-download"></i> প্রিন্ট</button>
                        </td>
                    </tr>
                `);
            });
            $('.table').DataTable({ "language": { "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/bn-BD.json" } });
        }
    }

    function initUserChart() {
        const ctx = document.getElementById('userExpenseChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে'],
                    datasets: [{
                        label: 'লাইসেন্স ফি প্রদান (টাকা)',
                        data: [3000, 0, 5000, 0, 3000],
                        borderColor: '#006a4e',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(0, 106, 78, 0.1)'
                    }]
                }
            });
        }
    }

    function initAdminChart() {
        const ctx = document.getElementById('adminStatsChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['নতুন লাইসেন্স', 'নবায়ন', 'বাতিল', 'অপেক্ষমাণ'],
                    datasets: [{
                        label: 'আবেদন সংখ্যা',
                        data: [450, 890, 12, 150],
                        backgroundColor: ['#0d6efd', '#198754', '#dc3545', '#ffc107']
                    }]
                }
            });
        }
    }

    // --- Multi-step License Renewal ---
    let currentStep = 1;
    $('.next-step').on('click', function() {
        if (currentStep < 3) {
            $(`#step${currentStep}`).hide();
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active').addClass('completed');
            currentStep++;
            $(`#step${currentStep}`).fadeIn();
            $(`.step-item[data-step="${currentStep}"]`).addClass('active');
        }
    });

    $('.prev-step').on('click', function() {
        if (currentStep > 1) {
            $(`#step${currentStep}`).hide();
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active');
            currentStep--;
            $(`#step${currentStep}`).fadeIn();
            $(`.step-item[data-step="${currentStep}"]`).addClass('active');
        }
    });

    // Document Preview
    $('#nidUpload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                $('#docPreview').html(`<img src="${event.target.result}" style="max-height: 100%">`);
            };
            reader.readAsDataURL(file);
        }
    });

    // Payment Selection
    $('.payment-method').on('click', function() {
        $('.payment-method').removeClass('selected border-primary');
        $(this).addClass('selected border-primary');
        $('#selectedMethod').val($(this).data('method'));
    });

    // Final Submit
    $('#renewFormMulti').on('submit', function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'পেমেন্ট সম্পন্ন করুন',
            text: 'আপনার ফি ৩,০০০ টাকা। আপনি কি নিশ্চিত?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, পেমেন্ট করুন',
            cancelButtonText: 'বাতিল'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'প্রসেসিং...',
                    timer: 2000,
                    didOpen: () => { Swal.showLoading(); }
                }).then(() => {
                    const newApp = {
                        id: 'APP-' + Date.now().toString().slice(-6),
                        userName: user.name,
                        businessName: $('#businessName').val(),
                        date: new Date().toLocaleDateString('bn-BD'),
                        status: 'Pending'
                    };
                    let apps = JSON.parse(localStorage.getItem('dncc_applications'));
                    apps.unshift(newApp);
                    localStorage.setItem('dncc_applications', JSON.stringify(apps));
                    
                    Swal.fire('সফল!', 'আপনার পেমেন্ট ও আবেদন সফল হয়েছে।', 'success').then(() => {
                        window.location.href = 'user_dashboard.html';
                    });
                });
            }
        });
    });

    // --- Notifications ---
    $('.notification-bell').on('click', function() {
        const notes = JSON.parse(localStorage.getItem('dncc_notifications')) || [];
        let html = '<ul class="list-group text-start">';
        notes.forEach(n => {
            html += `<li class="list-group-item ${n.read ? '' : 'bg-light'}">
                        <small class="text-muted">${n.time}</small><br>${n.text}
                     </li>`;
        });
        html += '</ul>';
        
        Swal.fire({
            title: 'নোটিফিকেশন',
            html: html,
            showCloseButton: true,
            showConfirmButton: false
        });

        // Mark all as read
        notes.forEach(n => n.read = true);
        localStorage.setItem('dncc_notifications', JSON.stringify(notes));
        updateNotificationCount();
    });

    // --- Admin Actions ---
    function renderAdminApplications() {
        const apps = JSON.parse(localStorage.getItem('dncc_applications'));
        const tbody = $('#adminAppTableBody');
        if (tbody.length) {
            tbody.empty();
            apps.forEach((app, index) => {
                let statusBadge = app.status === 'Pending' ? 'bg-warning text-dark' : (app.status === 'Approved' ? 'bg-success' : 'bg-danger');
                let actionHtml = app.status === 'Pending' ? `
                    <button class="btn btn-sm btn-success approve-btn" data-index="${index}"><i class="fa-solid fa-check"></i></button>
                    <button class="btn btn-sm btn-danger reject-btn" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
                ` : `<button class="btn btn-sm btn-secondary" disabled>সম্পন্ন</button>`;

                tbody.append(`
                    <tr>
                        <td>${app.id}</td>
                        <td>${app.userName}</td>
                        <td>${app.businessName}</td>
                        <td>${app.date}</td>
                        <td><span class="badge ${statusBadge}">${app.status}</span></td>
                        <td>${actionHtml}</td>
                    </tr>
                `);
            });
            if ( ! $.fn.DataTable.isDataTable( '.table' ) ) {
                $('.table').DataTable({ "language": { "url": "//cdn.datatables.net/plug-ins/1.13.6/i18n/bn-BD.json" } });
            }
        }
    }

    $(document).on('click', '.approve-btn', function() {
        const index = $(this).data('index');
        Swal.fire({ title: 'অনুমোদন নিশ্চিত করুন', icon: 'question', showCancelButton: true }).then(r => {
            if(r.isConfirmed) {
                let apps = JSON.parse(localStorage.getItem('dncc_applications'));
                apps[index].status = 'Approved';
                localStorage.setItem('dncc_applications', JSON.stringify(apps));
                location.reload();
            }
        });
    });

    // Handle logout
    $(document).on('click', '.logout-btn', function(e) {
        e.preventDefault();
        localStorage.removeItem('dncc_logged_in');
        window.location.href = 'index.html';
    });
});
