// শেয়ার্ড ইউটিলিটি এবং ডেটাবেস ফাংশন

// চেক অথেন্টিকেশন
function checkAuth() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

// লগআউট ফাংশন
function logout() {
  if (confirm("আপনি কি লগআউট করতে চান?")) {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("rememberMe");
    window.location.href = "index.html";
  }
}

// ডেটাবেস ম্যানেজমেন্ট
const DB = {
  initData() {
    if (!localStorage.getItem("vehicles")) {
      const demoVehicles = [
        {
          id: 1,
          regNo: "ঢা-০१-আ-०१०१",
          type: "মোটরসাইকেল",
          engineNo: "EN-0001",
          chassisNo: "CH-0001",
          unit: "ঢাকা মেট্রোপলিটন পুলিশ",
          photos: ["photo1.jpg", "photo2.jpg"],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 2,
          regNo: "ঢা-०२-ই-०२०२",
          type: "জিপ",
          engineNo: "EN-0002",
          chassisNo: "CH-0002",
          unit: "ট্র্যাফিক পুলিশ",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 3,
          regNo: "ঢা-०३-উ-०३०३",
          type: "মাইক্রোবাস",
          engineNo: "EN-0003",
          chassisNo: "CH-0003",
          unit: "ক্রাইম ব্রাঞ্চ",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 4,
          regNo: "ঢা-०४-ঊ-०४०४",
          type: "অ্যাম্বুলেন্স",
          engineNo: "EN-0004",
          chassisNo: "CH-0004",
          unit: "ট্রেনিং সেন্টার",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 5,
          regNo: "ঢা-०५-ঙ-०५०५",
          type: "গাড়ি",
          engineNo: "EN-0005",
          chassisNo: "CH-0005",
          unit: "বিশেষ বাহিনী",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
      ];
      localStorage.setItem("vehicles", JSON.stringify(demoVehicles));
    }

    if (!localStorage.getItem("maintenance")) {
      const demoMaintenance = [
        {
          id: 1,
          vehicleId: 1,
          startDate: "2024-01-10",
          endDate: "2024-01-15",
          description: "ইঞ্জিন মেরামত এবং তেল পরিবর্তন",
          status: "সম্পন্ন",
        },
        {
          id: 2,
          vehicleId: 2,
          startDate: "2024-01-20",
          endDate: null,
          description: "টায়ার প্রতিস্থাপন",
          status: "চলমান",
        },
        {
          id: 3,
          vehicleId: 3,
          startDate: "2024-02-01",
          endDate: "2024-02-05",
          description: "ব্রেক সিস্টেম পরীক্ষা এবং সমন্বয়",
          status: "সম্পন্ন",
        },
      ];
      localStorage.setItem("maintenance", JSON.stringify(demoMaintenance));
    }
  },

  getVehicles() {
    return JSON.parse(localStorage.getItem("vehicles")) || [];
  },

  saveVehicles(vehicles) {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  },

  getMaintenance() {
    return JSON.parse(localStorage.getItem("maintenance")) || [];
  },

  saveMaintenance(maintenance) {
    localStorage.setItem("maintenance", JSON.stringify(maintenance));
  },
};

// গ্লোবাল শেয়ার্ড স্টাইলস
function addSharedStyles() {
  const style = document.createElement("style");
  style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #1a3a52;
            --secondary: #d4385f;
            --accent: #667eea;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
        }

        body {
            font-family: 'Segoe UI', 'Noto Sans Bengali', sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
        }

        /* নেভিগেশন স্টাইলস */
        .navbar {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .navbar-brand {
            font-size: 1.3rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .navbar-menu {
            display: flex;
            gap: 30px;
            align-items: center;
            flex-wrap: wrap;
        }

        .navbar-menu a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }

        .navbar-menu a:hover {
            opacity: 0.8;
        }

        .navbar-menu a.active {
            border-bottom: 3px solid white;
        }

        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid white;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
        }

        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* কন্টেইনার */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 20px;
        }

        /* পেজ হেডার */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .page-header h1 {
            font-size: 2rem;
            color: var(--primary);
        }

        /* বাটন স্টাইলস */
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(26, 58, 82, 0.3);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-danger {
            background: var(--error);
            color: white;
        }

        .btn-warning {
            background: var(--warning);
            color: white;
        }

        /* কার্ড স্টাইলস */
        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 25px;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 1.3rem;
            color: var(--primary);
            margin-bottom: 15px;
            font-weight: 700;
        }

        /* টেবিল স্টাইলস */
        .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }

        .table thead {
            background: #f1f5f9;
        }

        .table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: var(--primary);
            border-bottom: 2px solid #e2e8f0;
        }

        .table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .table tbody tr:hover {
            background: #f8fafc;
        }

        /* ফর্ম স্টাইলস */
        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--primary);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-family: inherit;
            font-size: 0.95rem;
            transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(26, 58, 82, 0.1);
        }

        /* স্ট্যাটাস ব্যাজ */
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.8rem;
        }

        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-warning {
            background: #fef3c7;
            color: #78350f;
        }

        .badge-error {
            background: #fee2e2;
            color: #7f1d1d;
        }

        /* অ্যালার্ট */
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid var(--success);
        }

        .alert-error {
            background: #fee2e2;
            color: #7f1d1d;
            border-left: 4px solid var(--error);
        }

        /* রেসপন্সিভ */
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 15px;
                padding: 15px;
            }

            .navbar-menu {
                width: 100%;
                flex-direction: column;
                gap: 10px;
            }

            .page-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .page-header h1 {
                font-size: 1.5rem;
            }

            .table {
                font-size: 0.85rem;
            }

            .table th,
            .table td {
                padding: 10px;
            }
        }
    `;
  document.head.appendChild(style);
}

// ডকুমেন্ট লোড হলে শেয়ার্ড স্টাইলস যোগ করুন
document.addEventListener("DOMContentLoaded", () => {
  addSharedStyles();
  DB.initData();
});
