# Inventory Medicine Shop - Services Layer

## Overview

This document describes the complete service layer architecture for the Inventory Medicine Shop application built with ASP.NET Core C# 8 and Entity Framework Core.

## Architecture

### Service Layer Structure

```
Services/
├── Interfaces/                    # Service interfaces (contracts)
│   ├── IGenericRepository.cs      # Generic CRUD operations
│   ├── IUnitOfWork.cs             # Transaction management
│   ├── ICategoryService.cs        # Category business logic
│   ├── ISupplierService.cs        # Supplier business logic
│   ├── IMedicineService.cs        # Medicine business logic
│   ├── IMedicineBatchService.cs   # Batch & FEFO logic
│   ├── IUserService.cs            # User management
│   ├── ISaleService.cs            # Sales transactions
│   ├── ISaleItemService.cs        # Sale items
│   ├── IAppSettingsService.cs     # Application settings
│   ├── IAuthenticationService.cs  # Authentication & security
│   ├── IDashboardService.cs       # Dashboard statistics
│   └── IReportService.cs          # Report generation
│
├── Implementations/               # Service implementations
│   ├── GenericRepository.cs       # Base repository
│   ├── UnitOfWork.cs              # Transaction coordinator
│   ├── CategoryService.cs
│   ├── SupplierService.cs
│   ├── MedicineService.cs
│   ├── MedicineBatchService.cs    # Contains FEFO algorithm
│   ├── UserService.cs
│   ├── SaleService.cs
│   ├── SaleItemService.cs
│   ├── AppSettingsService.cs
│   ├── AuthenticationService.cs   # Password hashing, tokens
│   ├── DashboardService.cs
│   └── ReportService.cs
│
└── ServiceCollectionExtensions.cs # DI registration helper
```

## Design Patterns Used

### 1. Repository Pattern

- **IGenericRepository<T>**: Provides common CRUD operations for all entities
- Abstracts data access layer from business logic
- Supports querying, paging, filtering, and includes

### 2. Unit of Work Pattern

- **IUnitOfWork**: Manages transactions across multiple repositories
- Ensures data consistency
- Single SaveChanges() for all operations

### 3. Dependency Injection

- All services are registered via `ServiceCollectionExtensions`
- Promotes loose coupling and testability
- Supports constructor injection

### 4. Service Layer Pattern

- Business logic separated from controllers
- Each entity has its own service interface and implementation
- Promotes single responsibility principle

## Service Descriptions

### Core Services

#### **IGenericRepository<T>**

Generic repository for all entities with common operations:

- Query: `GetByIdAsync()`, `GetAllAsync()`, `FindAsync()`, `GetQueryable()`
- Paging: `GetPagedAsync()` with filtering and ordering
- Includes: `GetWithIncludesAsync()` for eager loading
- Commands: `AddAsync()`, `Update()`, `Remove()`
- Soft Delete: `SoftDelete()` instead of hard deletes

#### **IUnitOfWork**

Manages database transactions and provides access to all repositories:

```csharp
await _unitOfWork.BeginTransactionAsync();
try
{
    await _unitOfWork.Medicines.AddAsync(medicine);
    await _unitOfWork.SaveChangesAsync();
    await _unitOfWork.CommitTransactionAsync();
}
catch
{
    await _unitOfWork.RollbackTransactionAsync();
}
```

### Entity Services

#### **ICategoryService**

Category management operations:

- CRUD operations
- Active categories filtering
- Category code uniqueness checking
- Medicine count per category
- Validation before deletion

#### **ISupplierService**

Supplier management with contact information:

- CRUD operations
- Email uniqueness validation
- Supplier batches retrieval
- Total purchases calculation
- Deletion validation (check for batches)

#### **IMedicineService**

Medicine inventory management:

- Full CRUD operations
- Search by name, code, barcode, generic name
- Stock level queries (low stock, out of stock)
- Stock info calculation with batches
- Category-based filtering
- Reorder requirement detection

#### **IMedicineBatchService**

Advanced batch management with **FEFO (First Expired, First Out)** algorithm:

**Key Features:**

- Batch lifecycle management (active, expired, depleted)
- FEFO automatic batch selection for sales
- Expiry tracking and alerts
- Stock deduction across multiple batches
- Inventory value calculations

**FEFO Implementation:**

```csharp
// Automatically selects batches by expiry date (oldest first)
var batches = await GetAvailableBatchesForSaleAsync(medicineId, quantity);

// Deducts from multiple batches following FEFO
await DeductQuantityFromBatchesAsync(medicineId, quantity);
```

**Expiry Management:**

- `GetExpiredBatchesAsync()` - Already expired
- `GetExpiringBatchesAsync(days)` - Expiring within X days
- `GetExpiredBatchValueAsync()` - Financial loss calculation

#### **IUserService**

User account management:

- User CRUD operations
- Password hashing with ASP.NET Identity
- Role-based filtering (admin, manager, cashier, pharmacist)
- Account activation/deactivation
- Last login tracking
- User sales statistics

#### **ISaleService**

Complete sales transaction management:

- Sale creation with automatic numbering
- Payment method tracking
- Refund operations with stock restoration
- Date range queries
- Sales statistics (total, profit, averages)
- Payment method analytics
- Top sales retrieval

**Sale Creation with Items:**

```csharp
await CreateSaleWithItemsAsync(sale, saleItems); // Atomic transaction
```

#### **ISaleItemService**

Individual line items in sales:

- Sale items by medicine or sale
- Quantity sold calculations
- Top selling items
- Sales count by medicine

#### **IAppSettingsService**

Dynamic application configuration:

- Key-value storage in database
- Typed value retrieval
- Category-based organization
- Common settings helpers:
  - `GetShopNameAsync()`
  - `GetCurrencyAsync()`
  - `GetTaxRateAsync()`
  - `GetExpiryAlertDaysAsync()`

### Business Logic Services

#### **IAuthenticationService**

Complete authentication & security:

**Authentication:**

- Login with username or email
- Password verification with BCrypt
- Account lockout after failed attempts
- Last login tracking

**Password Management:**

- Secure password hashing
- Change password validation
- Reset token generation
- Token expiry validation

**Security Features:**

- Failed login attempt tracking
- Automatic account lockout (5 attempts, 30 min)
- Password reset tokens with expiry
- Account unlock operations

#### **IDashboardService**

Real-time dashboard statistics:

**Overview Metrics:**

- Total counts (medicines, categories, suppliers, users)
- Sales totals (today, week, month, year)
- Alert counts (low stock, out of stock, expiring, expired)

**Charts Data:**

- Sales trend charts
- Top selling medicines
- Payment method distribution
- Inventory by category
- Monthly sales comparison

**Recent Activities:**

- Recent sales with details
- Stock movements tracking

#### **IReportService**

Comprehensive reporting system:

**Sales Reports:**

- Daily, monthly, yearly sales reports
- Sales by payment method
- Sales by cashier/user
- Total revenue and profit

**Inventory Reports:**

- Complete inventory overview
- Batch-wise inventory
- Low stock and out of stock
- Inventory value by medicine

**Expiry Reports:**

- Medicines expiring within X days
- Already expired batches
- Monthly expiry forecast
- Value loss calculations

**Medicine Analytics:**

- Top selling medicines
- Slow-moving items (no sales in X days)
- Sales history per medicine

**Financial Reports:**

- Overall profit analysis
- Profit by medicine
- Profit by category
- Profit margins

**Supplier Reports:**

- Supplier performance
- Purchases by supplier
- Supplier rankings by volume

## Setup & Configuration

### 1. Register Services in Startup.cs / Program.cs

**Option A: Register All Services**

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Register all services at once
    services.AddApplicationServices(Configuration);

    // Or use connection string directly
    services.AddDatabaseContext(Configuration.GetConnectionString("DefaultConnection"));
    services.AddRepositoryServices();
    services.AddBusinessServices();
}
```

**Option B: Modular Registration**

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Database
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

    // Repositories
    services.AddRepositoryServices();

    // Business Services
    services.AddBusinessServices();
}
```

### 2. Connection String (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=MediShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### 3. Run Migrations

```bash
# Add migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

## Usage Examples

### Controller Injection

```csharp
public class MedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;
    private readonly IMedicineBatchService _batchService;

    public MedicinesController(
        IMedicineService medicineService,
        IMedicineBatchService batchService)
    {
        _medicineService = medicineService;
        _batchService = batchService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
        return Ok(medicines);
    }
}
```

### FEFO Sales Example

```csharp
public class SalesController : ControllerBase
{
    private readonly ISaleService _saleService;
    private readonly IMedicineBatchService _batchService;

    [HttpPost]
    public async Task<IActionResult> CreateSale(SaleDto saleDto)
    {
        // Check stock availability using FEFO
        var availableBatches = await _batchService
            .GetAvailableBatchesForSaleAsync(medicineId, quantity);

        if (availableBatches.Sum(b => b.RemainingQuantity) < quantity)
        {
            return BadRequest("Insufficient stock");
        }

        // Create sale
        var sale = await _saleService.CreateSaleWithItemsAsync(sale, saleItems);

        // Deduct from batches using FEFO
        await _batchService.DeductQuantityFromBatchesAsync(medicineId, quantity);

        return Ok(sale);
    }
}
```

### Dashboard Data

```csharp
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var overview = await _dashboardService.GetDashboardOverviewAsync();
        return Ok(overview);
    }

    [HttpGet("charts/top-selling")]
    public async Task<IActionResult> GetTopSelling()
    {
        var data = await _dashboardService.GetTopSellingMedicinesChartAsync(10);
        return Ok(data);
    }
}
```

### Report Generation

```csharp
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    [HttpGet("sales")]
    public async Task<IActionResult> GetSalesReport(DateTime start, DateTime end)
    {
        var report = await _reportService.GetSalesReportAsync(start, end);
        return Ok(report);
    }

    [HttpGet("expiry")]
    public async Task<IActionResult> GetExpiryReport()
    {
        var report = await _reportService.GetExpiryReportAsync(90);
        return Ok(report);
    }
}
```

## Key Features

✅ **Complete CRUD Operations** - All entities covered  
✅ **FEFO Algorithm** - First Expired, First Out for batch management  
✅ **Transaction Management** - Unit of Work with rollback support  
✅ **Soft Delete** - Data preservation with IsDeleted flag  
✅ **Authentication & Security** - Password hashing, lockout, reset tokens  
✅ **Comprehensive Reports** - Sales, inventory, financial, supplier  
✅ **Real-time Dashboard** - Statistics, charts, alerts  
✅ **Expiry Management** - Tracking, alerts, value loss calculation  
✅ **Stock Management** - Low stock, out of stock, reorder point  
✅ **Audit Trail** - CreatedAt, UpdatedAt, CreatedBy tracking  
✅ **Dependency Injection** - Ready for ASP.NET Core DI  
✅ **Async/Await** - Modern async patterns throughout  
✅ **Include Support** - Eager loading with EF Core  
✅ **Pagination** - Built-in paging support  
✅ **Validation** - Business rule validation before operations

## Best Practices

1. **Always use transactions** for multi-table operations
2. **Use soft delete** instead of hard delete
3. **Check validation** before creating/updating entities
4. **Use FEFO** for batch sales to minimize expiry loss
5. **Monitor expiry alerts** regularly
6. **Generate reports** for business insights
7. **Track user activities** via Last Login
8. **Use password hashing** never store plain text passwords
9. **Implement account lockout** for security
10. **Calculate stock dynamically** from active batches

## Testing

Create unit tests for each service:

```csharp
public class MedicineServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly IMedicineService _medicineService;

    [Fact]
    public async Task GetMedicineByCode_ReturnsCorrectMedicine()
    {
        // Arrange
        var expectedCode = "MED-001";

        // Act
        var medicine = await _medicineService.GetMedicineByCodeAsync(expectedCode);

        // Assert
        Assert.NotNull(medicine);
        Assert.Equal(expectedCode, medicine.Code);
    }
}
```

## Troubleshooting

**Issue:** "Could not load type IPasswordHasher"
**Solution:** Add NuGet package `Microsoft.AspNetCore.Identity`

**Issue:** "DbContext not registered"
**Solution:** Ensure `AddDbContext` is called in Startup.cs

**Issue:** "Navigation property is null"
**Solution:** Use `GetWithIncludesAsync()` to eager load related entities

## License

This service layer is part of the Inventory Medicine Shop project.

---

**Version:** 1.0  
**Last Updated:** January 2026  
**ASP.NET Core:** 8.0  
**Entity Framework Core:** 8.0
