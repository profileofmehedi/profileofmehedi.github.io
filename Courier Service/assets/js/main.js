const App = {
    formatCurrency: function(amount) {
        return '৳' + amount.toLocaleString('en-BD');
    },
    
    getStatusBadge: function(status) {
        const map = {
            'Pending': 'badge-pending',
            'Picked Up': 'badge-picked',
            'In Transit': 'badge-transit',
            'Delivered': 'badge-delivered',
            'Returned': 'badge-return'
        };
        return `<span class="badge ${map[status] || 'bg-secondary'}">${status}</span>`;
    }
};

const TranslationData = {
    "app_name": { "en": "RapidCourier", "bn": "র‍্যাপিড কুরিয়ার" },
    "dashboard": { "en": "Dashboard", "bn": "ড্যাশবোর্ড" },
    "book_parcel": { "en": "Book Parcel", "bn": "পার্সেল বুকিং" },
    "pickup_requests": { "en": "Pickup Requests", "bn": "পিকআপ রিকোয়েস্ট" },
    "all_shipments": { "en": "All Shipments", "bn": "সকল চালান" },
    "track_parcel": { "en": "Track Parcel", "bn": "পার্সেল ট্র্যাকিং" },
    "riders_force": { "en": "Riders & Force", "bn": "রাইডার ও কর্মী" },
    "rider_payroll": { "en": "Rider Payroll", "bn": "রাইডার বেতন" },
    "hub_management": { "en": "Hub Management", "bn": "হাব ম্যানেজমেন্ট" },
    "fleet_manager": { "en": "Fleet Manager", "bn": "ফ্লিট ম্যানেজার" },
    "sms_logs": { "en": "SMS Logs", "bn": "এসএমএস লগ" },
    "merchants": { "en": "Merchants", "bn": "মার্চেন্ট তালিকা" },
    "marketing": { "en": "Marketing", "bn": "মার্কেটিং" },
    "accounts_cod": { "en": "Accounts & COD", "bn": "একাউন্টস ও সিওডি" },
    "return_management": { "en": "Return Management", "bn": "রিটার্ন ম্যানেজমেন্ট" },
    "reports": { "en": "Reports", "bn": "রিপোর্ট" },
    "fraud_check": { "en": "Fraud Check", "bn": "ফ্রড চেক" },
    "support_tickets": { "en": "Support Tickets", "bn": "সাপোর্ট টিকেট" },
    "developer_api": { "en": "Developer API", "bn": "ডেভেলপার এপিআই" },
    "settings": { "en": "Settings", "bn": "সেটিংস" },
    "logout": { "en": "Logout", "bn": "লগআউট" },
    
    "total_parcels": { "en": "Total Parcels", "bn": "মোট পার্সেল" },
    "delivered_today": { "en": "Delivered Today", "bn": "আজ ডেলিভারি" },
    "in_transit": { "en": "In Transit", "bn": "ট্রানজিট-এ আছে" },
    "cod_earnings": { "en": "COD Earnings", "bn": "সিওডি আয়" },
    "weekly_performance": { "en": "Weekly Delivery Performance", "bn": "সাপ্তাহিক ডেলিভারি পারফরমেন্স" },
    "top_riders": { "en": "Top Performing Riders", "bn": "সেরা রাইডারগণ" },
    "recent_shipments": { "en": "Recent Shipments", "bn": "সাম্প্রতিক চালান" },
    "view_all": { "en": "View All", "bn": "সব দেখুন" },
    
    "trk_id": { "en": "Tracking ID", "bn": "ট্র্যাকিং আইডি" },
    "sender": { "en": "Sender", "bn": "প্রেরক" },
    "receiver": { "en": "Receiver", "bn": "প্রাপক" },
    "route": { "en": "Route", "bn": "রুট" },
    "status": { "en": "Status", "bn": "অবস্থা" },
    "amount": { "en": "Amount", "bn": "টাকা" },
    "date": { "en": "Date", "bn": "তারিখ" },
    "executive_overview": { "en": "Executive Overview", "bn": "সার্বিক পর্যালোচনা" }
};

const Localization = {
    data: TranslationData, // Use embedded data directly
    currentLang: localStorage.getItem('app_lang') || 'en',

    init: function() {
        // No async fetch needed anymore
        this.apply(this.currentLang);
        return Promise.resolve(); // Keep promise interface for compatibility
    },

    toggle: function() {
        this.currentLang = this.currentLang === 'en' ? 'bn' : 'en';
        localStorage.setItem('app_lang', this.currentLang);
        this.apply(this.currentLang);
        
        // Update Sidebar text dynamically
        if(typeof Layout !== 'undefined') {
            Layout.renderSidebar(Layout.activePage);
        }
        
        // Force update button text in case renderSidebar didn't catch it
        const btn = document.getElementById('langToggleBtn');
        if(btn) btn.innerText = this.currentLang === 'en' ? 'বাংলা' : 'English';
    },

    apply: function(lang) {
        // Update static elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.data[key] && this.data[key][lang]) {
                if(el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.placeholder = this.data[key][lang];
                } else {
                    el.innerText = this.data[key][lang];
                }
            }
        });
        
        // Update Toggle Button Text
        const btn = document.getElementById('langToggleBtn');
        if(btn) btn.innerText = lang === 'en' ? 'বাংলা' : 'English';
    },

    getText: function(key) {
        return (this.data[key] && this.data[key][this.currentLang]) ? this.data[key][this.currentLang] : key;
    }
};