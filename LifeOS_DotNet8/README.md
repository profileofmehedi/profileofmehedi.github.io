# LifeOS — পার্সোনাল লাইফ অপারেটিং সিস্টেম (ASP.NET Core 8 MVC & SQL Server)

> **সম্পূর্ণ ডাইনামিক, আধুনিক, বাংলা ভাষায় নির্মিত পার্সোনাল লাইফ ম্যানেজমেন্ট ও ফিনটেক প্ল্যাটফর্ম**

LifeOS হলো একটি পূর্ণাঙ্গ এন্টারপ্রাইজ-গ্রেড ব্যক্তিগত জীবন ও অর্থ ব্যবস্থাপনা সিস্টেম (Personal Operating System)। এটি **ASP.NET Core 8 MVC**, **C#**, **Entity Framework Core 8** এবং **Microsoft SQL Server** ডাটাবেজের সমন্বয়ে তৈরি করা হয়েছে। প্রজেক্টটিতে **Repository Pattern** অনুসরণ করা হয়েছে (কোনো জটিল UnitOfWork বা Generic Repository ব্যবহার ব্যতীত সহজ ও স্পষ্ট আর্কিটেকচারে) এবং প্রতিটি এনটিটির জন্য একটি ডেডিকেটেড `BaseEntity` ক্লাস ব্যবহার করা হয়েছে।

---

## 🛠️ প্রযুক্তি স্ট্যাক (Technology Stack)

- **ফ্রেমওয়ার্ক:** ASP.NET Core 8.0 (MVC)
- **প্রোগ্রামিং ভাষা:** C# 12
- **ডাটাবেজ ও ওআরএম:** Microsoft SQL Server & Entity Framework Core 8.0.11 (Code-First Migrations)
- **আর্কিটেকচার প্যাটার্ন:** Repository Pattern (Non-Generic, Domain-Specific Repositories)
- **ডিজাইন ও স্টাইলিং:** Bootstrap 5.3.3, Custom Design System (`styles.css`), Bootstrap Icons 1.11.3
- **টাইপোগ্রাফি:** **কালপুরুষ (Kalpurush)** প্রিমিয়াম বাংলা ওয়েব ফন্ট ও Hind Siliguri / Inter
- **ভিজ্যুয়ালাইজেশন ও থ্রিডি:** Three.js r128 (অ্যাম্বিয়েন্ট পার্টিকেল ক্যানভাস), Chart.js 4.4.2 (ক্যাশফ্লো, ব্যয়ের ক্যাটাগরি, অ্যাকাউন্টের ব্যালেন্স ও অভ্যাসের গ্রাফ)
- **অ্যালার্ট ও নোটিফিকেশন:** SweetAlert2 11.10.7

---

## 🗄️ ডাটাবেজ সংযোগ স্ট্রিং (Connection String)

প্রজেক্টের [appsettings.json](file:///C:/MyDrive/Projects/profileofmehedi.github.io/LifeOS_DotNet8/LifeOS.Web/appsettings.json)-এ ব্যবহৃত সংযোগ স্ট্রিং:
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=localhost\\SQLEXPRESS;Initial Catalog=nextxenit_lifeos;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

## 🏛️ প্রজেক্ট ও আর্কিটেকচার স্ট্রাকচার (Solution Structure)

```text
LifeOS_DotNet8/
├── LifeOS.sln                          # .NET 8 Solution File
├── README.md                           # এই ডকুমেন্টেশন ফাইল
├── project-info.md                     # ইন-ডিটেইল প্রজেক্ট আর্কিটেকচার ও ডেটা মডেল বিবরণী
└── LifeOS.Web/                         # ASP.NET Core 8 MVC ওয়েব প্রজেক্ট
    ├── Controllers/
    │   ├── HomeController.cs           # প্রধান MVC ভিউ কন্ট্রোলার
    │   └── Api/                        # লাইভ RESTful API কন্ট্রোলারসমূহ
    │       ├── DashboardApiController.cs       # রিয়েল-টাইম সারাংশ ও মেট্রিক্স API
    │       ├── AccountsApiController.cs        # ব্যাংক অ্যাকাউন্ট ও কার্ড CRUD API
    │       ├── TransactionsApiController.cs    # ডাবল-এন্ট্রি ফাইন্যান্সিয়াল ট্রানজ্যাকশন API
    │       ├── ProductivityApiController.cs    # টাস্ক, অভ্যাস, রুটিন ও ক্যালেন্ডার API
    │       └── LifeManagementApiController.cs  # বাজেট, সঞ্চয়, যাতায়াত, জার্নাল ও লক্ষ্য API
    ├── Data/
    │   ├── LifeOsDbContext.cs          # EF Core 8 DbContext (১৬টি টেবিল ও রিলেশন)
    │   └── DbInitializer.cs            # অটোমেটিক মাইগ্রেশন রানার ও বাংলা ডেমো সিডার
    ├── Migrations/                     # EF Core Code-First ডাটাবেজ মাইগ্রেশন ফাইলসমূহ
    ├── Models/
    │   └── Entities/                   # ডোমেইন মডেল (BaseEntity ইনহেরিটেন্স)
    │       ├── BaseEntity.cs           # Id, CreatedAt, UpdatedAt, IsDeleted
    │       ├── UserProfile.cs          # প্রোফাইল ও সেটিংস
    │       ├── Account.cs              # ব্যাংক অ্যাকাউন্ট ও ডেবিট/ক্রেডিট কার্ড
    │       ├── Transaction.cs          # আর্থিক লেনদেন, বাজেট ও সঞ্চয়
    │       ├── TaskItem.cs             # টাস্ক, অগ্রাধিকার ও স্ট্যাটাস
    │       ├── Habit.cs                # অভ্যাস ট্র্যাকিং ও দৈনিক লগ
    │       ├── Routine.cs              # সকাল, কাজ ও রাতের রুটিন এবং স্টেপস
    │       ├── CalendarEvent.cs        # মিটিং, ইভেন্ট ও শিডিউল
    │       ├── LifeGoal.cs             # দীর্ঘমেয়াদী জীবন লক্ষ্য ও মাইলফলক
    │       ├── JournalEntry.cs         # ব্যক্তিগত ডায়েরি, মুড ও আত্মমূল্যায়ন
    │       └── ConveyanceTrip.cs       # অফিস যাতায়াত ট্রিপ ও ভাউচার ক্লেইম
    ├── Repositories/                   # ডেডিকেটেড রিপোজিটরি ক্লাস ও ইন্টারফেসসমূহ
    │   ├── IAccountRepository.cs / AccountRepository.cs
    │   ├── ITransactionRepository.cs / TransactionRepository.cs
    │   ├── IBudgetRepository.cs / BudgetRepository.cs
    │   ├── ISavingsGoalRepository.cs / SavingsGoalRepository.cs
    │   ├── ITaskRepository.cs / TaskRepository.cs
    │   ├── IHabitRepository.cs / HabitRepository.cs
    │   ├── IRoutineRepository.cs / RoutineRepository.cs
    │   ├── ICalendarEventRepository.cs / CalendarEventRepository.cs
    │   ├── ILifeGoalRepository.cs / LifeGoalRepository.cs
    │   ├── IJournalRepository.cs / JournalRepository.cs
    │   ├── IConveyanceRepository.cs / ConveyanceRepository.cs
    │   ├── IUserProfileRepository.cs / UserProfileRepository.cs
    │   └── INotificationRepository.cs / NotificationRepository.cs
    ├── Views/
    │   ├── Home/Index.cshtml           # সম্পূর্ণ লাইফওএস সিঙ্গেল পেজ MVC ভিউ
    │   └── Shared/_Layout.cshtml       # কালপুরুষ ফন্ট ও স্ক্রিপ্টসহ মাস্টার লেআউট
    └── wwwroot/                        # স্ট্যাটিক অ্যাসেটস
        └── assets/
            ├── css/styles.css          # হাই-কনট্রাস্ট ও কালপুরুষ ডিজাইন সিস্টেম
            ├── fonts/                  # কালপুরুষ লোকাল ফন্ট ফাইলসমূহ
            └── js/                     # ক্লায়েন্ট সাইড স্ক্রিপ্ট ও API ক্লায়েন্ট
```

---

## 🚀 কীভাবে রান করবেন (How to Run)

### ১. ডিপেন্ডেন্সি রিস্টোর ও বিল্ড
```bash
cd LifeOS_DotNet8
dotnet build
```

### ২. ডাটাবেজ মাইগ্রেশন ও আপডেট
ডাটাবেজ মাইগ্রেশন ইতোমধ্যে তৈরি ও প্রয়োগ করা আছে। যেকোনো সময় ম্যানুয়ালি আপডেট করতে:
```bash
dotnet ef database update --project LifeOS.Web --startup-project LifeOS.Web
```

### ৩. অ্যাপ্লিকেশন রান করা
```bash
dotnet run --project LifeOS.Web --launch-profile http
```
অ্যাপ্লিকেশনটি স্বয়ংক্রিয়ভাবে `https://localhost:7131` (এবং `http://localhost:5266`) পোর্টে চালু হবে এবং কোনো ডেমো ডেটা ইনজেক্ট করবে না; আপনি আপনার আসল তথ্য সরাসরি এন্ট্রি করতে পারবেন।

---

## ✨ প্রধান প্রধান বৈশিষ্ট্য (Key Highlights)

1. **শূন্য জটিলতা (Zero Over-engineering):**
   কোনো অবাস্তব বা অনাবশ্যক Generic Repository বা UnitOfWork ব্যবহার করা হয়নি। প্রতিটি ডোমেইনের নিজস্ব রিপোজিটরি ক্লাসে সুনির্দিষ্ট, পরিষ্কার ও বোধগম্য C# কোড লেখা হয়েছে।

2. **একই চমৎকার ডিজাইন (Pixel-Perfect UI Continuity):**
   মূল অ্যাপ্লিকেশনের ডিজাইন, কালার প্যালেট, ৩ডি ক্যানভাস ব্যাকড্রপ, চার্ট ও ইন্টারঅ্যাকশনে কোনো পরিবর্তন আনা হয়নি।

3. **কালপুরুষ ফন্ট ও হাই-কনট্রাস্ট নিরাপত্তা (High Contrast Protection):**
   বাংলা টেক্সট রেন্ডারিংয়ের জন্য কালপুরুষ ফন্ট ব্যবহৃত হয়েছে এবং সাদা ব্যাকগ্রাউন্ডে যাতে কখনোই সাদা বা হালকা টেক্সট না দেখা যায়, তার জন্য কঠোর CSS কন্ট্রাস্ট গার্ড নিশ্চিত করা হয়েছে।

4. **দ্বিমুখী ডাবল-এন্ট্রি ফিন্যান্সিয়াল ইঞ্জিন (Double-Entry Financial Integrity):**
   যেকোনো ব্যয় বা স্থানান্তরের সাথে সাথে সোর্স অ্যাকাউন্ট ও কার্ডের ব্যালেন্স SQL Server-এ স্বয়ংক্রিয়ভাবে সমন্বিত হয়।
