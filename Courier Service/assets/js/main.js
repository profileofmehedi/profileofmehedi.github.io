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
    "executive_overview": { "en": "Executive Overview", "bn": "সার্বিক পর্যালোচনা" },
    
    "create_shipment_title": { "en": "Create New Shipment", "bn": "নতুন চালান তৈরি করুন" },
    "back": { "en": "Back", "bn": "ফিরে যান" },
    "shipment_details": { "en": "Shipment Details", "bn": "চালানের বিবরণ" },
    "sender_info": { "en": "Sender Information", "bn": "প্রেরকের তথ্য" },
    "merchant_name": { "en": "Merchant / Sender Name", "bn": "মার্চেন্ট / প্রেরকের নাম" },
    "pickup_phone": { "en": "Pickup Phone", "bn": "পিকআপ ফোন" },
    "pickup_address": { "en": "Pickup Address", "bn": "পিকআপ ঠিকানা" },
    "receiver_info": { "en": "Receiver Information", "bn": "প্রাপকের তথ্য" },
    "receiver_name": { "en": "Receiver Name", "bn": "প্রাপকের নাম" },
    "receiver_phone": { "en": "Receiver Phone", "bn": "প্রাপকের ফোন" },
    "delivery_district": { "en": "Delivery District", "bn": "ডেলিভারি জেলা" },
    "detailed_address": { "en": "Detailed Address", "bn": "বিস্তারিত ঠিকানা" },
    "weight_kg": { "en": "Weight (KG)", "bn": "ওজন (কেজি)" },
    "package_type": { "en": "Package Type", "bn": "প্যাকেজ টাইপ" },
    "cod_amount": { "en": "Cash on Delivery (Amount)", "bn": "ক্যাশ অন ডেলিভারি (টাকা)" },
    "cancel": { "en": "Cancel", "bn": "বাতিল" },
    "create_order": { "en": "Create Order", "bn": "অর্ডার তৈরি করুন" },
    "est_cost": { "en": "Estimated Cost", "bn": "আনুমানিক খরচ" },
    "delivery_charge": { "en": "Delivery Charge:", "bn": "ডেলিভারি চার্জ:" },
    "cod_charge_1": { "en": "COD Charge (1%):", "bn": "সিওডি চার্জ (১%):" },
    "weight_charge": { "en": "Weight Charge:", "bn": "ওজন চার্জ:" },
    "total": { "en": "Total:", "bn": "মোট:" },
    
    "parcel_management": { "en": "Parcel Management", "bn": "পার্সেল ম্যানেজমেন্ট" },
    "new_parcel": { "en": "New Parcel", "bn": "নতুন পার্সেল" },
    "search_placeholder": { "en": "Search Tracking ID...", "bn": "ট্র্যাকিং আইডি খুঁজুন..." },
    "all_statuses": { "en": "All Statuses", "bn": "সকল অবস্থা" },
    "all_merchants": { "en": "All Merchants", "bn": "সকল মার্চেন্ট" },
    "apply_filters": { "en": "Apply Filters", "bn": "ফিল্টার প্রয়োগ করুন" },
    "sender_merchant": { "en": "Merchant/Sender", "bn": "মার্চেন্ট/প্রেরক" },
    "actions": { "en": "Actions", "bn": "অ্যাকশন" },
    
    "track_shipment_title": { "en": "Track Your Shipment", "bn": "আপনার চালান ট্র্যাক করুন" },
    "track_placeholder": { "en": "Enter Tracking ID (e.g. CN-1001)", "bn": "ট্র্যাকিং আইডি লিখুন (উদা: CN-1001)" },
    "track_result_btn": { "en": "Track Result", "bn": "ট্র্যাক করুন" },
    "track_help_text": { "en": "Enter the Consignment Number found on your receipt.", "bn": "রশিদে থাকা কনসাইনমেন্ট নম্বরটি লিখুন।" },
    "from": { "en": "From", "bn": "হতে" },
    "to": { "en": "To", "bn": "প্রতি" },
    "tracking_history": { "en": "Tracking History", "bn": "ট্র্যাকিং ইতিহাস" },
    
    "riders_title": { "en": "Riders & Field Force", "bn": "রাইডার এবং ফিল্ড ফোর্স" },
    "add_rider": { "en": "Add New Rider", "bn": "নতুন রাইডার যোগ করুন" },
    "active_riders": { "en": "Active Riders", "bn": "সক্রিয় রাইডার" },
    "rider_profile": { "en": "Rider Profile", "bn": "রাইডার প্রোফাইল" },
    "zone": { "en": "Zone", "bn": "এলাকা" },
    "todays_load": { "en": "Today's Load", "bn": "আজকের লোড" },
    "performance": { "en": "Performance", "bn": "পারফরমেন্স" },
    "assign_task": { "en": "Assign", "bn": "এসাইন করুন" },
    "quick_assignment": { "en": "Quick Assignment", "bn": "দ্রুত এসাইনমেন্ট" },
    "select_rider": { "en": "Select Rider", "bn": "রাইডার নির্বাচন করুন" },
    "scan_ids": { "en": "Scan / Enter Parcel IDs", "bn": "পার্সেল আইডি স্ক্যান করুন" },
    
    "hub_title": { "en": "Hub Operations", "bn": "হাব অপারেশনস" },
    "scan_arrival": { "en": "Scan Arrival", "bn": "আগমন স্ক্যান" },
    "create_dispatch": { "en": "Create Dispatch", "bn": "ডেসপাচ তৈরি করুন" },
    "pending_dispatch": { "en": "Pending Dispatch", "bn": "পেন্ডিং ডেসপাচ" },
    "incoming_vehicles": { "en": "Incoming Vehicles", "bn": "আগত গাড়ি" },
    "held_hub": { "en": "Held at Hub", "bn": "হাবে আছে" },
    "damaged_returns": { "en": "Damaged/Returns", "bn": "ক্ষতিগ্রস্থ/ফেরত" },
    "incoming_hubs": { "en": "Incoming from other Hubs", "bn": "অন্যান্য হাব থেকে আগমন" },
    "outgoing_dispatches": { "en": "Outgoing Dispatches", "bn": "বহির্গামী ডেসপাচ" },
    "manifest_id": { "en": "Manifest ID", "bn": "ম্যানিফেস্ট আইডি" },
    "origin": { "en": "Origin", "bn": "উৎস" },
    "destination": { "en": "Destination", "bn": "গন্তব্য" },
    "vehicle": { "en": "Vehicle", "bn": "গাড়ি" },
    "eta": { "en": "ETA", "bn": "সম্ভাব্য সময়" },
    
    "fleet_title": { "en": "Fleet & Vehicle Management", "bn": "ফ্লিট এবং যানবাহন ব্যবস্থাপনা" },
    "add_vehicle": { "en": "Add Vehicle", "bn": "গাড়ি যোগ করুন" },
    "active_bikes": { "en": "Active Bikes", "bn": "সক্রিয় বাইক" },
    "covered_vans": { "en": "Covered Vans", "bn": "কাভার্ড ভ্যান" },
    "in_maintenance": { "en": "In Maintenance", "bn": "মেরামত চলছে" },
    "fuel_cost": { "en": "Fuel Cost", "bn": "জ্বালানী খরচ" },
    "vehicle_type": { "en": "Vehicle Type", "bn": "গাড়ির ধরন" },
    "license_plate": { "en": "License Plate", "bn": "লাইসেন্স প্লেট" },
    "driver": { "en": "Assigned Driver", "bn": "নির্ধারিত চালক" },
    "fuel_status": { "en": "Fuel Status", "bn": "জ্বালানী অবস্থা" },
    "last_service": { "en": "Last Service", "bn": "শেষ সার্ভিসিং" },
    
    "sms_title": { "en": "SMS & Notification Logs", "bn": "এসএমএস এবং নোটিফিকেশন লগ" },
    "recent_sms": { "en": "Recent Outgoing SMS", "bn": "সাম্প্রতিক পাঠানো এসএমএস" },
    "recipient": { "en": "Recipient", "bn": "প্রাপক" },
    "message_content": { "en": "Message Content", "bn": "মেসেজের বিষয়বস্তু" },
    "msg_type": { "en": "Type", "bn": "ধরন" },
    
    "merchant_dashboard": { "en": "Merchant Dashboard", "bn": "মার্চেন্ট ড্যাশবোর্ড" },
    "bulk_upload": { "en": "Bulk Upload", "bn": "বাল্ক আপলোড" },
    "new_order": { "en": "New Order", "bn": "নতুন অর্ডার" },
    "available_balance": { "en": "Available Balance", "bn": "লোভ্যাংশ ব্যালেন্স" },
    "total_orders": { "en": "Total Orders", "bn": "মোট অর্ডার" },
    "returned_orders": { "en": "Returned Orders", "bn": "ফেরত অর্ডার" },
    "my_orders": { "en": "My Orders", "bn": "আমার অর্ডার" },
    "order_id": { "en": "Order ID", "bn": "অর্ডার আইডি" },
    "customer": { "en": "Customer", "bn": "গ্রাহক" },
    "net_payable": { "en": "Net Payable", "bn": "নীট পাব্য" },
    
    "accounts_title": { "en": "Accounts & Billing", "bn": "একাউন্টস এবং বিলিং" },
    "daily_cod": { "en": "Daily COD Collection", "bn": "দৈনিক সিওডি সংগ্রহ" },
    "total_collected": { "en": "Total Collected", "bn": "মোট সংগ্রহ" },
    "reconcile": { "en": "Reconcile Collections", "bn": "হিসাব মিলান" },
    "merchant_payments": { "en": "Merchant Payments", "bn": "মার্চেন্ট পেমেন্ট" },
    "total_payable": { "en": "Total Payable", "bn": "মোট প্রদেয়" },
    "pay_now": { "en": "Pay Now", "bn": "পরিশোধ করুন" },
    "transaction_history": { "en": "Recent Transactions", "bn": "সাম্প্রতিক লেনদেন" },
    "transaction_id": { "en": "Transaction ID", "bn": "লেনদেন আইডি" },
    "description": { "en": "Description", "bn": "বিবরণ" },
    
    "returns_title": { "en": "Return Management (RTO)", "bn": "রিটার্ন ম্যানেজমেন্ট (RTO)" },
    "total_returns": { "en": "Total Returns", "bn": "মোট ফেরত" },
    "pending_merchant_return": { "en": "Pending Merchant Return", "bn": "মার্চেন্ট ফেরত বাকি" },
    "returned_list": { "en": "Returned Parcels List", "bn": "ফেরত পার্সেলের তালিকা" },
    "process_bulk": { "en": "Process Bulk Return", "bn": "বাল্ক রিটার্ন প্রসেস" },
    "parcel_id": { "en": "Parcel ID", "bn": "পার্সেল আইডি" },
    "reason": { "en": "Reason", "bn": "কারণ" },
    "hub_status": { "en": "Hub Status", "bn": "হাব স্ট্যাটাস" },
    
    "reports_title": { "en": "Analytics & Reports", "bn": "এনালিটিক্স এবং রিপোর্ট" },
    "generate_report": { "en": "Generate Report", "bn": "রিপোর্ট তৈরি করুন" },
    "report_type": { "en": "Report Type", "bn": "রিপোর্টের ধরন" },
    "date_range": { "en": "Date Range", "bn": "সময়ের পরিসীমা" },
    "export_pdf": { "en": "Export PDF", "bn": "পিডিএফ ডাউনলোড" },
    "revenue_expense": { "en": "Monthly Revenue vs Expense", "bn": "মাসিক আয় বনাম ব্যয়" },
    "delivery_success_rate": { "en": "Delivery Success Rate", "bn": "ডেলিভারি সাফল্যের হার" },
    
    "fraud_title": { "en": "Customer Intelligence & Fraud Check", "bn": "কাস্টমার ইন্টেলিজেন্স ও ফ্রড চেক" },
    "check_customer": { "en": "Check Customer History", "bn": "কাস্টমার ইতিহাস দেখুন" },
    "check_btn": { "en": "Search Database", "bn": "ডাটাবেস খুঁজুন" },
    "search_result": { "en": "Search Result", "bn": "অনুসন্ধান ফলাফল" },
    "success_rate": { "en": "Success Rate", "bn": "সাফল্যের হার" },
    "incident_reports": { "en": "Recent Incident Reports", "bn": "সাম্প্রতিক ঘটনার রিপোর্ট" },
    
    "tickets_title": { "en": "Support Desk", "bn": "সাপোর্ট ডেস্ক" },
    "create_ticket": { "en": "Create Ticket", "bn": "টিকেট তৈরি করুন" },
    "open_tickets": { "en": "Open Tickets", "bn": "ওপেন টিকেট" },
    "ticket_id": { "en": "Ticket ID", "bn": "টিকেট আইডি" },
    "subject": { "en": "Subject", "bn": "বিষয়" },
    "requester": { "en": "Requester", "bn": "অনুরোধকারী" },
    "priority": { "en": "Priority", "bn": "অগ্রাধিকার" },
    "last_updated": { "en": "Last Updated", "bn": "সর্বশেষ আপডেট" },
    
    "settings_title": { "en": "System Configuration", "bn": "সিস্টেম কনফিগারেশন" },
    "del_charges": { "en": "Delivery Charges", "bn": "ডেলিভারি চার্জ" },
    "zone_mgmt": { "en": "Zone Management", "bn": "জোন ম্যানেজমেন্ট" },
    "company_info": { "en": "Company Info", "bn": "কোম্পানির তথ্য" },
    "inside_dhaka": { "en": "Inside Dhaka", "bn": "ঢাকার ভিতরে" },
    "sub_dhaka": { "en": "Sub Dhaka", "bn": "সাব ঢাকা" },
    "outside_dhaka": { "en": "Outside Dhaka", "bn": "ঢাকার বাইরে" },
    "save_changes": { "en": "Save Changes", "bn": "পরিবর্তন সংরক্ষণ করুন" },
    
    "pickups_title": { "en": "Pickup Management", "bn": "পিকআপ ম্যানেজমেন্ট" },
    "manual_request": { "en": "Manual Request", "bn": "ম্যানুয়াল রিকোয়েস্ট" },
    "pending_pickups": { "en": "Pending Pickup Requests", "bn": "পেন্ডিং পিকআপ রিকোয়েস্ট" },
    "est_parcels": { "en": "Est. Parcels", "bn": "আনুমানিক পার্সেল" },
    "assign_rider": { "en": "Assign Rider", "bn": "রাইডার দিন" },
    
    "payroll_title": { "en": "Rider Payroll & Commission", "bn": "রাইডার বেতন ও কমিশন" },
    "generate_sheet": { "en": "Generate Sheet", "bn": "শিট তৈরি করুন" },
    "comm_rate": { "en": "Comm. Rate", "bn": "কমিশন হার" },
    "fuel_allow": { "en": "Fuel Allow.", "bn": "জ্বালানী ভাতা" },
    
    "marketing_title": { "en": "Marketing & Promotions", "bn": "মার্কেটিং এবং প্রমোশন" },
    "create_promo": { "en": "Create Promo Code", "bn": "প্রোমো কোড তৈরি করুন" },
    "active_campaigns": { "en": "Active Campaigns", "bn": "সক্রিয় ক্যাম্পেইন" },
    "promo_code": { "en": "Promo Code", "bn": "প্রোমো কোড" },
    "discount": { "en": "Discount", "bn": "ছাড়" },
    "valid_until": { "en": "Valid Until", "bn": "মেয়াদ" },
    "usage": { "en": "Usage", "bn": "ব্যবহার" },
    "bulk_sms": { "en": "Bulk SMS Marketing", "bn": "বাল্ক এসএমএস মার্কেটিং" },
    "send_blast": { "en": "Send Blast", "bn": "পাঠান" }
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
        // Toggle body class for font switching
        if(lang === 'bn') {
            document.body.classList.add('lang-bn');
        } else {
            document.body.classList.remove('lang-bn');
        }

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

const Actions = {
    init: function() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, .btn');
            if (!btn || btn.getAttribute('onclick')) return;

            // Handle common actions based on text or icon
            const text = btn.innerText.toLowerCase();
            const icon = btn.querySelector('i')?.className || '';

            if (text.includes('save') || text.includes('সংরক্ষণ')) {
                this.notify('Settings saved successfully!', 'success');
            } else if (text.includes('pay') || text.includes('পরিশোধ')) {
                this.notify('Payment processed successfully!', 'success');
            } else if (text.includes('create order') || text.includes('অর্ডার তৈরি')) {
                this.notify('New order created successfully!', 'success');
                setTimeout(() => window.location.href = 'parcel_list.html', 1500);
            } else if (text.includes('assign') || text.includes('এসাইন')) {
                this.notify('Task assigned to rider!', 'info');
            } else if (text.includes('send') || text.includes('পাঠান')) {
                this.notify('Message sent successfully!', 'success');
            } else if (text.includes('delete') || icon.includes('fa-trash')) {
                if(confirm('Are you sure you want to delete this?')) {
                    btn.closest('tr')?.remove();
                    this.notify('Item deleted.', 'danger');
                }
            } else if (text.includes('print') || icon.includes('fa-print')) {
                window.print();
            }
        });
    },

    notify: function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            padding: 15px 25px; border-radius: 5px; color: #fff;
            background: ${type === 'success' ? '#28a745' : type === 'danger' ? '#dc3545' : '#ff6d00'};
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease; transform: translateX(120%);
        `;
        toast.innerText = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Auto-init actions
document.addEventListener('DOMContentLoaded', () => Actions.init());