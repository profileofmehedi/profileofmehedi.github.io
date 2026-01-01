# MediShop Application Architecture - Mermaid Diagrams

## 1. System Architecture Overview

```mermaid
graph TB
    User["👤 User"]
    Browser["🌐 Browser"]

    subgraph Frontend ["Frontend Layer - Single Page Application"]
        Login["🔐 Login/Auth<br/>index.html"]
        Dashboard["📊 Dashboard<br/>dashboard.html"]
        Inventory["📦 Inventory Module<br/>medicines.html<br/>categories.html<br/>suppliers.html"]
        Stock["📈 Stock Management<br/>inventory.html"]
        POS["🛒 Point of Sale<br/>sales.html"]
        Reports["📋 Reports<br/>reports.html"]
        Admin["⚙️ Admin Panel<br/>users.html<br/>menus.html<br/>settings.html"]
        Profile["👤 User Profile<br/>profile.html"]
    end

    subgraph Storage ["Data Persistence"]
        LocalStorage["💾 localStorage<br/>Users, Products<br/>Transactions, Settings"]
    end

    subgraph Libraries ["External Libraries"]
        Bootstrap["Bootstrap 5.3.0"]
        jQuery["jQuery 3.6.0"]
        SweetAlert["SweetAlert2"]
        DataTables["DataTables 1.13.6"]
        FontAwesome["Font Awesome 6.4.0"]
    end

    User -->|Opens Browser| Browser
    Browser -->|Loads| Login
    Login -->|Authenticates| Dashboard
    Dashboard -->|Routes to| Inventory
    Dashboard -->|Routes to| Stock
    Dashboard -->|Routes to| POS
    Dashboard -->|Routes to| Reports
    Dashboard -->|Routes to| Admin
    Dashboard -->|Routes to| Profile

    Inventory --> LocalStorage
    Stock --> LocalStorage
    POS --> LocalStorage
    Reports --> LocalStorage
    Admin --> LocalStorage
    Profile --> LocalStorage

    Frontend --> Bootstrap
    Frontend --> jQuery
    Frontend --> SweetAlert
    Frontend --> DataTables
    Frontend --> FontAwesome
```

## 2. Role-Based Access Control (RBAC)

```mermaid
graph TB
    Auth["🔐 Authentication System"]

    Admin["👨‍💼 Admin Role"]
    Manager["👨‍💻 Manager Role"]
    Seller["👨‍🏪 Seller Role"]

    Auth --> |Username: admin<br/>Password: admin123| Admin
    Auth --> |Username: manager<br/>Password: manager123| Manager
    Auth --> |Username: seller<br/>Password: seller123| Seller

    Admin --> Dashboard["✅ Dashboard"]
    Admin --> Medicines["✅ Medicines CRUD"]
    Admin --> Categories["✅ Categories CRUD"]
    Admin --> Suppliers["✅ Suppliers CRUD"]
    Admin --> Inventory["✅ Inventory"]
    Admin --> Sales["✅ Sales/POS"]
    Admin --> Reports["✅ Reports"]
    Admin --> Users["✅ User Management"]
    Admin --> Menus["✅ Menu Assignment"]
    Admin --> Settings["✅ Settings"]
    Admin --> Profile["✅ Profile"]

    Manager --> Dashboard
    Manager --> Medicines
    Manager --> Categories
    Manager --> Suppliers
    Manager --> Inventory
    Manager --> Sales
    Manager --> Reports
    Manager --> Profile

    Seller --> Dashboard
    Seller --> Sales
    Seller --> Reports
    Seller --> Profile
```

## 3. Data Model & Relationships

```mermaid
erDiagram
    USERS ||--o{ MEDICINES : manages
    USERS ||--o{ SALES_TRANSACTIONS : creates
    MEDICINES ||--o{ CATEGORIES : belongs_to
    MEDICINES ||--o{ SUPPLIERS : supplied_by
    MEDICINES ||--o{ SALES_ITEMS : included_in
    SALES_TRANSACTIONS ||--o{ SALES_ITEMS : contains

    USERS {
        int userId PK
        string username
        string password
        string fullName
        string email
        enum role "Admin, Manager, Seller"
        timestamp createdDate
        boolean isActive
    }

    MEDICINES {
        int medicineId PK
        string name
        string code
        float price
        int quantity
        int categoryId FK
        int supplierId FK
        date expiryDate
        string description
        string batchNumber
    }

    CATEGORIES {
        int categoryId PK
        string categoryName
        string description
    }

    SUPPLIERS {
        int supplierId PK
        string supplierName
        string email
        string phone
        string address
        string city
    }

    SALES_TRANSACTIONS {
        int transactionId PK
        int userId FK
        date transactionDate
        float totalAmount
        enum paymentMethod "Cash, Card, Cheque, Online"
        string status
    }

    SALES_ITEMS {
        int saleItemId PK
        int transactionId FK
        int medicineId FK
        int quantity
        float unitPrice
        float totalPrice
    }
```

## 4. Module Interaction Flow

```mermaid
graph LR
    Dashboard["📊 Dashboard<br/>Overview"]

    Dashboard --> Inventory["📦 Inventory<br/>Management"]
    Inventory --> Medicines["💊 Medicines"]
    Inventory --> Categories["📂 Categories"]
    Inventory --> Suppliers["🚚 Suppliers"]
    Inventory --> Stock["📊 Stock Alert"]

    Dashboard --> Sales["🛒 POS System"]
    Sales --> Cart["🛒 Shopping Cart"]
    Cart --> Payment["💳 Payment"]
    Payment --> Receipt["🧾 Receipt"]
    Receipt --> LocalDB["💾 Store Data"]

    Dashboard --> Reports["📋 Reports"]
    Reports --> SalesReport["📈 Sales Analytics"]
    Reports --> TransactionHistory["📋 Transactions"]

    Dashboard --> Admin["⚙️ Admin Panel"]
    Admin --> UserMgmt["👥 User Management"]
    Admin --> MenuMgmt["📋 Menu Assignment"]
    Admin --> Settings["⚙️ Settings"]

    Dashboard --> Profile["👤 User Profile"]
    Profile --> ChangePassword["🔐 Change Password"]
```

## 5. Page Flow & Navigation

```mermaid
stateDiagram-v2
    [*] --> Login

    Login --> Authenticate: Enter Credentials
    Authenticate --> Dashboard: Success
    Authenticate --> Login: Failed

    Dashboard --> Medicines: Click Menu
    Dashboard --> Categories: Click Menu
    Dashboard --> Suppliers: Click Menu
    Dashboard --> Inventory: Click Menu
    Dashboard --> Sales: Click Menu
    Dashboard --> Reports: Click Menu
    Dashboard --> Users: Click Menu (Admin Only)
    Dashboard --> Menus: Click Menu (Admin Only)
    Dashboard --> Settings: Click Menu (Admin Only)
    Dashboard --> Profile: Click Menu

    Medicines --> Dashboard: Back to Dashboard
    Categories --> Dashboard: Back to Dashboard
    Suppliers --> Dashboard: Back to Dashboard
    Inventory --> Dashboard: Back to Dashboard
    Sales --> Dashboard: Back to Dashboard
    Reports --> Dashboard: Back to Dashboard
    Users --> Dashboard: Back to Dashboard
    Menus --> Dashboard: Back to Dashboard
    Settings --> Dashboard: Back to Dashboard
    Profile --> Dashboard: Back to Dashboard

    Dashboard --> Logout: Click Logout
    Logout --> Login: Session End
```

## 6. Feature Dependency Tree

```mermaid
graph TD
    MediShop["🏥 MediShop<br/>Inventory System"]

    MediShop --> Auth["🔐 Authentication"]
    Auth --> Login["Login"]
    Auth --> Logout["Logout"]
    Auth --> RBAC["Role-Based Access"]

    MediShop --> Dashboard["📊 Dashboard"]
    Dashboard --> Stats["Statistics"]
    Dashboard --> Calculator["Calculator<br/>Ctrl+Shift+C"]
    Dashboard --> RecentTx["Recent Transactions"]

    MediShop --> Inventory["📦 Inventory"]
    Inventory --> Medicines["Medicines<br/>CRUD"]
    Inventory --> Categories["Categories<br/>CRUD"]
    Inventory --> Suppliers["Suppliers<br/>CRUD"]
    Inventory --> Stock["Stock<br/>Management"]

    MediShop --> Sales["🛒 Sales/POS"]
    Sales --> Cart["Shopping Cart"]
    Sales --> Payment["Payment Methods<br/>Cash, Card, Cheque, Online"]
    Sales --> Receipt["Receipt Generation"]

    MediShop --> Reports["📋 Reporting"]
    Reports --> SalesAnalytics["Sales Analytics"]
    Reports --> TransactionLog["Transaction Log"]
    Reports --> DateFilter["Date Filtering"]

    MediShop --> Admin["⚙️ Administration"]
    Admin --> UserMgmt["User Management"]
    Admin --> MenuMgmt["Menu Role Assignment"]
    Admin --> Settings["Settings &<br/>Configuration"]
    Admin --> Theme["Theme<br/>Customization"]

    MediShop --> Profile["👤 User Profile"]
    Profile --> ViewInfo["View Information"]
    Profile --> ChangePassword["Change Password"]
```

## 7. Technology Stack

```mermaid
graph TB
    subgraph Frontend["Frontend Technologies"]
        HTML5["📄 HTML5"]
        CSS3["🎨 CSS3<br/>- Variables<br/>- Keyframes<br/>- Animations<br/>- Responsive"]
        JS["⚡ JavaScript<br/>- ES6+<br/>- Event Handling<br/>- DOM Manipulation"]
    end

    subgraph Frameworks["Frameworks & Libraries"]
        Bootstrap["🟦 Bootstrap 5.3.0"]
        jQuery["📜 jQuery 3.6.0"]
    end

    subgraph Components["UI Components & Plugins"]
        SweetAlert["🔔 SweetAlert2<br/>- Alerts<br/>- Modals<br/>- Notifications"]
        DataTables["📊 DataTables 1.13.6<br/>- Sorting<br/>- Filtering<br/>- Pagination"]
        FontAwesome["🎯 Font Awesome 6.4.0<br/>- 1000+ Icons"]
    end

    subgraph Storage["Data Storage"]
        LocalStorage["💾 localStorage<br/>- Users<br/>- Products<br/>- Transactions<br/>- Settings"]
    end

    subgraph Deployment["Deployment"]
        GitHub["🐙 GitHub Pages"]
    end

    Frontend --> Frameworks
    Frameworks --> Components
    Components --> Storage
    Storage --> Deployment
```

## 8. Data Flow - Sales Transaction

```mermaid
sequenceDiagram
    actor Customer as Customer
    participant UI as Sales UI
    participant JS as JavaScript Engine
    participant Cart as Shopping Cart
    participant Storage as localStorage

    Customer->>UI: Select Medicine
    UI->>JS: Get Medicine Details
    JS->>Storage: Fetch Medicine Data
    Storage-->>JS: Return Medicine
    JS->>UI: Display Price & Stock

    Customer->>UI: Add to Cart
    UI->>Cart: Add Item with Qty
    Cart->>Cart: Calculate Subtotal
    Cart->>UI: Update Cart Display

    Customer->>UI: Process Payment
    UI->>JS: Validate Payment
    JS->>JS: Calculate Total<br/>Apply Discount if Any

    Customer->>UI: Confirm Payment
    UI->>Storage: Save Transaction
    Storage-->>UI: Transaction Saved
    UI->>Storage: Update Stock
    Storage-->>UI: Stock Updated

    UI->>UI: Generate Receipt
    UI->>Customer: Display Receipt<br/>Print Option
```

## 9. Admin Configuration Flow

```mermaid
graph TD
    Admin["👨‍💼 Admin User"]

    Admin -->|Access| UserMgmt["👥 User Management"]
    UserMgmt -->|Create| NewUser["Add New User"]
    UserMgmt -->|Edit| EditUser["Modify User"]
    UserMgmt -->|Assign| Role["Assign Role<br/>Admin/Manager/Seller"]
    NewUser --> Storage1["💾 Save to localStorage"]
    EditUser --> Storage1
    Role --> Storage1

    Admin -->|Access| MenuMgmt["📋 Menu Management"]
    MenuMgmt -->|Assign| MenuToRole["Assign Menus to Roles"]
    MenuToRole --> ControlAccess["Control Module Access"]
    ControlAccess --> Storage2["💾 Save to localStorage"]

    Admin -->|Access| Settings["⚙️ Settings"]
    Settings -->|Configure| Theme["🎨 Theme Color"]
    Settings -->|Configure| ShopInfo["🏪 Shop Information"]
    Settings -->|Configure| Contact["📞 Contact Details"]
    Settings -->|Configure| Shortcuts["⌨️ Keyboard Shortcuts"]
    Theme --> Storage3["💾 Save to localStorage"]
    ShopInfo --> Storage3
    Contact --> Storage3
    Shortcuts --> Storage3

    Storage1 --> Dashboard["Reflect Changes<br/>on Dashboard"]
    Storage2 --> Dashboard
    Storage3 --> Dashboard
```

## 10. Responsive Design Breakpoints

```mermaid
graph LR
    Desktop["🖥️ Desktop<br/>≥ 992px<br/>- Full Sidebar<br/>- Multi-column Layout<br/>- All Features Visible"]

    Tablet["📱 Tablet<br/>768px - 992px<br/>- Collapsible Sidebar<br/>- 2-column Layout<br/>- Optimized Touch"]

    Mobile["📲 Mobile<br/>< 768px<br/>- Hidden Sidebar<br/>- 1-column Layout<br/>- Touch-optimized<br/>- Large Buttons"]

    Browser["🌐 Browser<br/>Responsive Design"]

    Browser -->|1200px| Desktop
    Browser -->|768-992px| Tablet
    Browser -->|< 768px| Mobile
```
