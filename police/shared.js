// শেয়ার্ড ইউটিলিটি এবং ডেটাবেস ফাংশন

// Kalpurush ফন্ট লোড করা
(function () {
  const link = document.createElement("link");
  link.href = "https://fonts.maateen.me/kalpurush/font.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    * {
      font-family: 'Kalpurush', Arial, sans-serif !important;
    }
  `;
  document.head.appendChild(style);
})();

// চেক অথেন্টিকেশন
function checkAuth() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

// লগআউট ফাংশন
function logout() {
  if (confirm("আপনি কি লগআউট করতে চান?")) {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("rememberMe");
    window.location.href = "login.html";
  }
}

// ডেটাবেস ম্যানেজমেন্ট
const DB = {
  initData() {
    if (!localStorage.getItem("vehicles")) {
      const demoVehicles = [
        {
          id: 1,
          regNo: "ঢাকা-মেট্রো-গ-১২৩৪৫",
          type: "পুলিশ মোটরসাইকেল",
          engineNo: "ENG-BMW-2024-001",
          chassisNo: "CHS-BMW-F750GS-001",
          unit: "ঢাকা মেট্রোপলিটন পুলিশ",
          photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 2,
          regNo: "ঢাকা-মেট্রো-ক-৬৭৮৯০",
          type: "পিকআপ ভ্যান",
          engineNo: "ENG-TOYOTA-2023-045",
          chassisNo: "CHS-HILUX-4X4-045",
          unit: "ট্র্যাফিক পুলিশ বিভাগ",
          photos: ["photo1.jpg"],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 3,
          regNo: "ঢাকা-মেট্রো-খ-১১১১১",
          type: "মাইক্রোবাস",
          engineNo: "ENG-HIACE-2023-078",
          chassisNo: "CHS-HIACE-GL-078",
          unit: "র‍্যাব (দ্রুত পদক্ষেপ বাহিনী)",
          photos: [
            "photo1.jpg",
            "photo2.jpg",
            "photo3.jpg",
            "photo4.jpg",
            "photo5.jpg",
          ],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 4,
          regNo: "ঢাকা-মেট্রো-ঘ-৫৫৫৫৫",
          type: "অ্যাম্বুলেন্স",
          engineNo: "ENG-AMBULANCE-2024-012",
          chassisNo: "CHS-TOYOTA-AMB-012",
          unit: "পুলিশ হেডকোয়ার্টার",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 5,
          regNo: "ঢাকা-মেট্রো-চ-৯৯৯৯৯",
          type: "ডাবল ক্যাবিন",
          engineNo: "ENG-FORD-2023-089",
          chassisNo: "CHS-RANGER-XLT-089",
          unit: "ঢাকা জেলা পুলিশ",
          photos: ["photo1.jpg", "photo2.jpg"],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 6,
          regNo: "ঢাকা-মেট্রো-ছ-২২২২২",
          type: "প্রাইম মুভার",
          engineNo: "ENG-PAJERO-2024-033",
          chassisNo: "CHS-PAJERO-SPORT-033",
          unit: "বিশেষ নিরাপত্তা বাহিনী",
          photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 7,
          regNo: "ঢাকা-মেট্রো-জ-৭৭৭৭৭",
          type: "জিপ গাড়ি",
          engineNo: "ENG-LANDCRUISER-2023-056",
          chassisNo: "CHS-LC-V8-056",
          unit: "পুলিশ কমিশনার অফিস",
          photos: [],
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 8,
          regNo: "ঢাকা-মেট্রো-ঝ-৮৮৮৮৮",
          type: "পুলিশ ভ্যান",
          engineNo: "ENG-COASTER-2024-021",
          chassisNo: "CHS-COASTER-29SEAT-021",
          unit: "ডিএমপি সদর দপ্তর",
          photos: ["photo1.jpg", "photo2.jpg"],
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
