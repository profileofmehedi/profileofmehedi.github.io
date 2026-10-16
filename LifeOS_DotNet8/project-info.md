# LifeOS — প্রজেক্ট ও সিস্টেম আর্কিটেকচার বিবরণী (Detailed Project Documentation)

> **প্রজেক্টের নাম:** LifeOS — পার্সোনাল লাইফ অপারেটিং সিস্টেম  
> **ভার্সন:** ২.০ (ASP.NET Core 8 MVC & SQL Server Dynamic Edition)  
> **প্ল্যাটফর্ম:** .NET 8.0, C# 12, Entity Framework Core 8, Microsoft SQL Server  
> **তারিখ:** ১৬ অক্টোবর ২০২৬  

---

## ১. ভূমিকা ও লক্ষ্য (Project Overview)

LifeOS হলো একটি সম্পূর্ণ বাংলা ভাষায় ডিজাইনকৃত আধুনিক, রেসপন্সিভ এবং ডাটাবেজ-চালিত ব্যক্তিগত অপারেটিং সিস্টেম। এর মূল উদ্দেশ্য হলো ব্যবহারকারীর আর্থিক হিসাব-নিকাশ, ব্যাংক ও ওয়ালেট অ্যাকাউন্ট, ক্রেডিট কার্ড ব্যবস্থাপনা, অফিস যাতায়াত কনভেয়েন্স ভাউচার, দৈনন্দিন অভ্যাস, রুটিন, কাজ (টাস্ক), দীর্ঘমেয়াদী লক্ষ্য এবং জার্নালকে একটিমাত্র সমন্বিত প্ল্যাটফর্মে নিয়ে আসা।

পূর্ববর্তী স্ট্যাটিক ক্লায়েন্ট-সাইড সংস্করণকে সম্পূর্ণরূপে রূপান্তরিত করে **ASP.NET Core 8 MVC** ও **Microsoft SQL Server** ব্যাকএন্ডের সাথে যুক্ত করা হয়েছে।

---

## ২. কোর আর্কিটেকচার ও ডিজাইন প্যাটার্ন (Core Architecture)

### ২.১ রিপোজিটরি প্যাটার্ন (Domain-Specific Repository Pattern)
ব্যবহারকারীর সুস্পষ্ট নির্দেশ অনুযায়ী, অনাবশ্যক ও জটিল কোনো `Generic Repository` বা `UnitOfWork` প্যাটার্ন পরিহার করা হয়েছে। এর পরিবর্তে প্রতিটি সুনির্দিষ্ট ডোমেইনের জন্য ডেডিকেটেড ইন্টারফেস ও ক্লাস তৈরি করা হয়েছে:
- `IAccountRepository` / `AccountRepository`: ব্যাংক, ওয়ালেট ও কার্ড ব্যবস্থাপনা।
- `ITransactionRepository` / `TransactionRepository`: স্বয়ংক্রিয় ব্যালেন্স সমন্বয়সহ ডাবল-এন্ট্রি লেনদেন।
- `IBudgetRepository` / `BudgetRepository`: ক্যাটাগরিভিত্তিক বাজেট সীমা ও ব্যয় ট্র্যাকিং।
- `ISavingsGoalRepository` / `SavingsGoalRepository`: লক্ষ্যভিত্তিক সঞ্চয় ও কিস্তি জমা।
- `ITaskRepository` / `TaskRepository`: প্রায়োরিটি, ডিউ ডেট ও স্ট্যাটাস টগলসহ টাস্ক।
- `IHabitRepository` / `HabitRepository`: দৈনিক অভ্যাস ট্র্যাকিং ও কমপ্লিশন তারিখ লগিং।
- `IRoutineRepository` / `RoutineRepository`: সকাল, কাজ ও রাতের রুটিন এবং স্টেপ ম্যানেজমেন্ট।
- `ICalendarEventRepository` / `CalendarEventRepository`: ক্যালেন্ডার ইভেন্ট, মিটিং ও শিডিউল।
- `ILifeGoalRepository` / `LifeGoalRepository`: মাইলফলকসহ পঞ্চবার্ষিকী জীবন লক্ষ্য।
- `IJournalRepository` / `JournalRepository`: মুড ও রিফ্লেকশনসহ ব্যক্তিগত ডায়েরি।
- `IConveyanceRepository` / `ConveyanceRepository`: অফিস যাতায়াত ট্রিপ ও সমন্বিত ভাউচার ক্লেইম।
- `IUserProfileRepository` / `UserProfileRepository`: ব্যবহারকারীর প্রোফাইল ও প্রেফারেন্স।
- `INotificationRepository` / `NotificationRepository`: ইন-অ্যাপ রিয়েল-টাইম নোটিফিকেশন।

### ২.২ বেস এনটিটি (BaseEntity Class)
সমস্ত ডাটাবেজ মডেল একটি সাধারণ বেস ক্লাস `BaseEntity` থেকে ইনহেরিট করে:
```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}
```
এর মাধ্যমে প্রতিটি টেবিলে স্বয়ংক্রিয়ভাবে অডিট ট্র্যাকিং (`CreatedAt`, `UpdatedAt`) এবং সফট-ডিলিট (`IsDeleted`) ফিল্টারিং সক্রিয় থাকে।

---

## ৩. ডাটাবেজ আর্কিটেকচার ও ১৬টি টেবিল (Database Schema)

ডাটাবেজ সংযোগ স্ট্রিং:
```text
Data Source=localhost\SQLEXPRESS;Initial Catalog=nextxenit_lifeos;Trusted_Connection=True;TrustServerCertificate=True;
```

Entity Framework Core 8 Code-First মাইগ্রেশন (`InitialCreate`) দ্বারা নিচের ১৬টি টেবিল তৈরি করা হয়েছে:

| টেবিলের নাম | বিবরণ | মূল ফিল্ডসমূহ |
| :--- | :--- | :--- |
| **`UserProfiles`** | ব্যবহারকারীর তথ্য ও ভূমিকা | `Name`, `Email`, `Role`, `Avatar`, `Location`, `Bio` |
| **`UserSettings`** | সিস্টেম ও ভিউ সেটিংস | `Currency`, `Theme`, `DateFormat`, `PrivacyMode`, `BudgetAlertThreshold` |
| **`Accounts`** | ব্যাংক ও এমএফএস অ্যাকাউন্ট | `Code`, `Name`, `Institution`, `Type`, `Balance`, `Color`, `Icon` |
| **`Cards`** | ক্রেডিট ও ডেবিট কার্ড | `CardType`, `Last4`, `CreditLimit`, `CurrentBalance`, `BillingCycleDay` |
| **`Transactions`** | আয়, ব্যয় ও ট্রান্সফার লেনদেন | `Code`, `Date`, `Type`, `Amount`, `Category`, `AccountId`, `CardId` |
| **`Budgets`** | মাসিক ব্যয়ের বাজেট | `Category`, `MonthlyLimit`, `Spent`, `Period`, `Color` |
| **`SavingsGoals`** | ভবিষ্যৎ আর্থিক সঞ্চয় লক্ষ্য | `Name`, `TargetAmount`, `CurrentAmount`, `TargetDate`, `Priority` |
| **`Tasks`** | দৈনিক করণীয় কাজ | `Title`, `DueDate`, `DueTime`, `Priority`, `Status`, `Category` |
| **`Habits`** | পুনরাবৃত্তিমূলক স্বাস্থ্যকর অভ্যাস | `Name`, `Category`, `Frequency`, `CompletedDatesJson`, `Color` |
| **`Routines`** | নির্দিষ্ট সময়ের রুটিন সিরিজ | `Name`, `Period`, `EstimatedTime`, `StepsJson`, `Color` |
| **`CalendarEvents`** | শিডিউলকৃত ইভেন্ট ও মিটিং | `Title`, `Date`, `Time`, `Category`, `BadgeColor`, `Location` |
| **`LifeGoals`** | দীর্ঘমেয়াদী ব্যক্তিগত মাইলফলক | `Title`, `Category`, `TargetYear`, `Progress`, `MilestonesJson` |
| **`JournalEntries`** | প্রতিদিনের ডায়েরি ও উপলব্ধি | `Date`, `Mood`, `MoodEmoji`, `Wins`, `Gratitude`, `Reflection` |
| **`ConveyanceTrips`** | একক অফিস যাতায়াত রাইড | `Date`, `FromLocation`, `ToLocation`, `TransportMode`, `ActualCost`, `ClaimedCost` |
| **`ConveyanceClaims`**| অফিস সমন্বয় ভাউচার | `VoucherNumber`, `TotalActualCost`, `ApprovedDisbursedAmount`, `Status` |
| **`Notifications`** | সিস্টেম অ্যালার্ট ও বিজ্ঞপ্তি | `Title`, `Message`, `Type`, `IsRead`, `Date` |

---


## ৪. ডেমো ডেটা সিডিং পলিসি (Demo Seeding Disabled)

ব্যবহারকারীর রিয়েল ডাটার সুরক্ষা ও বিশুদ্ধতা বজায় রাখার জন্য **কোনো প্রকার অটোমেটিক ডেমো ডেটা সিডিং সক্রিয় রাখা হয়নি**। 
- অ্যাপ্লিকেশন চালুর সময় `DbInitializer.cs` শুধুমাত্র ডাটাবেজের পেন্ডিং EF Core মাইগ্রেশনগুলো এক্সিকিউট করে।
- কোনো ডেমো অ্যাকাউন্ট, ডিপিএস, লোন, কার্ড, লেনদেন বা টাস্ক স্বয়ংক্রিয়ভাবে প্রবেশ করানো হয় না।
- ব্যবহারকারী সম্পূর্ণ স্বাধীনভাবে নিজের আসল ব্যাংক অ্যাকাউন্ট, ডিপিএস, লোন, ক্রেডিট কার্ড ও দৈনন্দিন লেনদেন এন্ট্রি করবেন।

---

## ৫. এপিআই এন্ডপয়েন্ট তালিকা (RESTful Web API Reference)

| মেথড | এন্ডপয়েন্ট | কার্যকারিতা |
| :--- | :--- | :--- |
| **`GET`** | `/api/dashboard/summary` | নেট ওয়ার্থ, চলতি মাসের আয়-ব্যয়, টাস্ক ও অভ্যাসের প্রগ্রেস |
| **`GET`** | `/api/accounts` | সমস্ত ব্যাংক, ডিপিএস, লোন অ্যাকাউন্ট ও কার্ড তালিকা |
| **`POST`** | `/api/accounts` | নতুন ব্যাংক, ডিপিএস বা লোন অ্যাকাউন্ট তৈরি |
| **`PUT`** | `/api/accounts/{id}` | অ্যাকাউন্ট তথ্য আপডেট (ডিপিএস ও লোন ফিল্ডসহ) |
| **`DELETE`**| `/api/accounts/{id}` | অ্যাকাউন্ট ডিলিট (সফট-ডিলিট) |
| **`POST`** | `/api/accounts/{id}/pay-dps` | নির্বাচিত ব্যাংক/ওয়ালেট হতে ডিপিএস কিস্তি পরিশোধ ও লেজার এন্ট্রি |
| **`POST`** | `/api/accounts/{id}/pay-loan` | নির্বাচিত ব্যাংক/ওয়ালেট হতে লোন ইএমআই পরিশোধ ও বকেয়া হ্রাস |
| **`POST`** | `/api/accounts/cards` | নতুন ক্রেডিট বা ডেবিট কার্ড তৈরি |
| **`PUT`** | `/api/accounts/cards/{id}` | কার্ডের লিমিট ও ব্যালেন্স আপডেট |
| **`POST`** | `/api/accounts/cards/{id}/pay-bill` | নির্বাচিত ব্যাংক হতে ক্রেডিট কার্ড বিল পরিশোধ |
| **`DELETE`**| `/api/accounts/cards/{id}` | কার্ড অপসারণ |
| **`GET`** | `/api/transactions` | সমস্ত লেনদেনের হিস্টোরি |
| **`POST`** | `/api/transactions` | নতুন লেনদেন তৈরি ও ব্যালেন্স অটো-অ্যাডজাস্ট |
| **`GET`** | `/api/tasks` | সমস্ত টাস্ক তালিকা |
| **`POST`** | `/api/tasks` | নতুন টাস্ক তৈরি |
| **`POST`** | `/api/tasks/{id}/toggle` | টাস্ক সম্পন্ন / অসম্পূর্ণ টগল |
| **`GET`** | `/api/habits` | অভ্যাসের তালিকা ও স্ট্রিক্স |
| **`POST`** | `/api/habits/{id}/toggle`| নির্দিষ্ট তারিখে অভ্যাস সম্পন্ন করার লগ |
| **`GET`** | `/api/conveyance/trips` | অফিস যাতায়াত ট্রিপ তালিকা |
| **`POST`** | `/api/conveyance/claims` | একাধিক ট্রিপ নিয়ে অফিস সমন্বয় ভাউচার তৈরি |
| **`POST`** | `/api/conveyance/claims/{id}/settle` | ভাউচার পরিশোধ ও অ্যাকাউন্টে টাকা জমা |
| **`GET`** | `/api/journal` | ডায়েরি ও আত্মমূল্যায়ন লগ |
| **`POST`** | `/api/savings/{id}/deposit` | সঞ্চয় লক্ষ্যে অতিরিক্ত কিস্তি বা ফান্ড জমা |

---

## ৫.১ ঋণ, ডিপিএস ও ক্রেডিট কার্ড ব্যবস্থাপনা (Financial Instruments Management)

১. **ডিপিএস স্কিম (Deposit Pension Scheme):**
   - মাসিক কিস্তির পরিমাণ, মোট মেয়াদ (মাস), মেয়াদপূর্তিতে আনুমানিক প্রদেয় টাকা, জমার অগ্রগতি বার।
   - **"কিস্তি জমা দিন" অ্যাকশন:** যেকোনো ব্যাংক বা এমএফএস ওয়ালেট হতে ১-ক্লিকে কিস্তি জমা দিলে সরাসরি ডিপিএস ব্যালেন্স বৃদ্ধি পায় এবং স্বয়ংক্রিয়ভাবে ডাবল-এন্ট্রি লেনদেন রেকর্ড হয়।

২. **ঋণ / লোন ব্যবস্থাপনা (Loan & Debt Repayment):**
   - পার্সোনাল লোন, গৃহঋণ, গাড়ি লোন ও ব্যবসায়িক ঋণের মোট অঙ্ক, বর্তমান অবশিষ্ট বকেয়া মূল ঋণ, মাসিক ইএমআই, বাৎসরিক সুদের হার এবং কিস্তি পরিশোধের দিন ট্র্যাকিং।
   - **"ইএমআই পরিশোধ করুন" অ্যাকশন:** ব্যাংক বা ওয়ালেট হতে ইএমআই পরিশোধ করলে অবশিষ্ট বকেয়া হ্রাস পায় এবং পরিশোধিত ইএমআই এর হিসাব হালনাগাদ হয়।

৩. **ক্রেডিট কার্ড ব্যবস্থাপনা (Credit Card Outstanding & Payments):**
   - মোট ক্রেডিট লিমিট, বর্তমান বকেয়া বিল, ব্যবহারের শতকরা হার (Utilization Bar), উপলব্ধ ক্রেডিট লিমিট এবং বিলিং সাইকেল ও ডিউ ডেট প্রদর্শন।
   - **"কার্ড বিল পরিশোধ করুন" অ্যাকশন:** সম্পূর্ণ বা আংশিক বকেয়া বিল ব্যাংকিং অ্যাকাউন্ট থেকে তাৎক্ষণিক পরিশোধ।

৪. **নিট সম্পদ (Net Worth) হিসাবায়ন:**
   - **মোট সম্পদ (Assets)** = লিকুইড ব্যাংক ব্যালেন্স + ক্যাশ/ওয়ালেট ব্যালেন্স + ডিপিএস এ জমাকৃত সঞ্চয়।
   - **মোট দায় (Liabilities)** = লোনের অবশিষ্ট মূল ঋণ + ক্রেডিট কার্ডের বর্তমান বকেয়া।
   - **নেট ওয়ার্থ (Net Worth)** = মোট সম্পদ - মোট দায়।

---

## ৬. ফ্রন্টএন্ড ও ডাটাবেজের দ্বিমুখী সংযোগ (Client-Server Integration)

- **`api-client.js`:** ব্যাকএন্ডের সমস্ত কন্ট্রোলারের সাথে যোগাযোগ স্থাপন করে।
- **`app.js` ইনিশিয়ালাইজেশন:** পেজ লোড হওয়ার সাথে সাথে `LifeApiClient.syncFromDatabase()` মেথডের মাধ্যমে SQL Server থেকে সর্বশেষ ডেটা লোড হয়ে স্ক্রিনে প্রদর্শিত হয়।
- **রিয়েল-টাইম মিউটেশন:** ব্যবহারকারী কোনো টাস্ক চেক করলে, খরচ এন্ট্রি দিলে বা নতুন লক্ষ্য বানালে তা সাথে সাথে SQL Server-এ সেভ হয়ে যায়।
- **অফলাইন রেজিলিয়েন্স:** ক্লায়েন্ট-সাইডে `LifeStorage` স্টেট ক্যাশ বজায় থাকায় পেজ সুইচিং এবং ফিল্টারিং পলকের মধ্যে অত্যন্ত দ্রুত ও স্মুথভাবে সম্পন্ন হয়।

---

## ৭. ভিজ্যুয়াল ডিজাইন, কালপুরুষ ফন্ট ও অ্যাক্সেসিবিলিটি

- **কালপুরুষ ফন্ট:** পুরো প্রজেক্টে বাংলা টেক্সট সুচারুভাবে দেখানোর জন্য অফিসিয়াল **কালপুরুষ (Kalpurush)** ফন্ট প্রাইমারি হিসেবে ইন্টিগ্রেট করা হয়েছে।
- **সাদা ব্যাকগ্রাউন্ড সুরক্ষা (Anti White-on-White):**
  - ড্যাশবোর্ড হিরো ব্যানারে আধুনিক ডিপ ইন্ডিগো-স্লেট গ্রেডিয়েন্ট (`.dash-welcome-card`) ব্যবহার করা হয়েছে।
  - `.bg-white`, `.bg-light`, এবং সাধারণ কার্ড সারফেসের উপর কোনো টেক্সট যাতে সাদা বা অস্পষ্ট না দেখায়, তার জন্য কঠোর CSS রুলস ডিফাইন করা হয়েছে।
- **ডার্ক/লাইট থিম:** টপবারের সিঙ্গেল ক্লিকেই ডার্ক ও লাইট থিমের মধ্যে পরিবর্তন সম্ভব, যা ডাটাবেজের `UserSettings`-এ সংরক্ষিত থাকে।
