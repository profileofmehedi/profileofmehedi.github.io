using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Services.Interfaces;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Dashboard statistics and data
    /// </summary>
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedicineService _medicineService;
        private readonly IMedicineBatchService _batchService;
        private readonly ISaleService _saleService;

        public DashboardService(
            IUnitOfWork unitOfWork,
            IMedicineService medicineService,
            IMedicineBatchService batchService,
            ISaleService saleService)
        {
            _unitOfWork = unitOfWork;
            _medicineService = medicineService;
            _batchService = batchService;
            _saleService = saleService;
        }

        public async Task<object> GetDashboardOverviewAsync()
        {
            var overview = new
            {
                TotalMedicines = await GetTotalMedicinesCountAsync(),
                TotalCategories = await GetTotalCategoriesCountAsync(),
                TotalSuppliers = await GetTotalSuppliersCountAsync(),
                TotalUsers = await GetTotalUsersCountAsync(),
                TodaysSales = await GetTodaysSalesAsync(),
                ThisWeekSales = await GetThisWeekSalesAsync(),
                ThisMonthSales = await GetThisMonthSalesAsync(),
                TodaysSalesCount = await GetTodaysSalesCountAsync(),
                LowStockCount = await GetLowStockCountAsync(),
                OutOfStockCount = await GetOutOfStockCountAsync(),
                ExpiringMedicinesCount = await GetExpiringMedicinesCountAsync(30),
                ExpiredMedicinesCount = await GetExpiredMedicinesCountAsync()
            };

            return overview;
        }

        public async Task<int> GetTotalMedicinesCountAsync()
        {
            return await _unitOfWork.Medicines.CountAsync(m => m.IsActive);
        }

        public async Task<int> GetTotalCategoriesCountAsync()
        {
            return await _unitOfWork.Categories.CountAsync(c => c.IsActive);
        }

        public async Task<int> GetTotalSuppliersCountAsync()
        {
            return await _unitOfWork.Suppliers.CountAsync(s => s.IsActive);
        }

        public async Task<int> GetTotalUsersCountAsync()
        {
            return await _unitOfWork.Users.CountAsync(u => u.IsActive);
        }

        public async Task<decimal> GetTodaysSalesAsync()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            return await _saleService.GetTotalSalesAmountAsync(today, tomorrow);
        }

        public async Task<decimal> GetThisWeekSalesAsync()
        {
            var today = DateTime.UtcNow.Date;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            return await _saleService.GetTotalSalesAmountAsync(startOfWeek, endOfWeek);
        }

        public async Task<decimal> GetThisMonthSalesAsync()
        {
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            return await _saleService.GetTotalSalesAmountAsync(startOfMonth, endOfMonth);
        }

        public async Task<decimal> GetThisYearSalesAsync()
        {
            var today = DateTime.UtcNow.Date;
            var startOfYear = new DateTime(today.Year, 1, 1);
            var endOfYear = startOfYear.AddYears(1);
            return await _saleService.GetTotalSalesAmountAsync(startOfYear, endOfYear);
        }

        public async Task<int> GetTodaysSalesCountAsync()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            return await _saleService.GetTotalSalesCountAsync(today, tomorrow);
        }

        public async Task<IEnumerable<object>> GetRecentSalesAsync(int count = 10)
        {
            var sales = await _saleService.GetAllSalesAsync();
            return sales
                .OrderByDescending(s => s.SaleDate)
                .Take(count)
                .Select(s => new
                {
                    s.Id,
                    s.SaleNumber,
                    s.SaleDate,
                    s.TotalAmount,
                    s.PaymentMethod,
                    s.Status,
                    CustomerName = s.CustomerName ?? "Walk-in Customer",
                    CashierName = s.User?.Name
                });
        }

        public async Task<int> GetLowStockCountAsync()
        {
            var medicines = await _medicineService.GetLowStockMedicinesAsync();
            return medicines.Count();
        }

        public async Task<int> GetOutOfStockCountAsync()
        {
            var medicines = await _medicineService.GetOutOfStockMedicinesAsync();
            return medicines.Count();
        }

        public async Task<int> GetExpiringMedicinesCountAsync(int days = 30)
        {
            var batches = await _batchService.GetExpiringBatchesAsync(days);
            return batches.Count();
        }

        public async Task<int> GetExpiredMedicinesCountAsync()
        {
            return await _batchService.GetExpiredBatchCountAsync();
        }

        public async Task<IEnumerable<object>> GetExpiryAlertsAsync(int days = 90)
        {
            var expiringBatches = await _batchService.GetExpiringBatchesAsync(days);
            
            return expiringBatches.Select(b => new
            {
                b.Id,
                MedicineName = b.Medicine?.Name,
                b.BatchNumber,
                b.ExpiryDate,
                DaysUntilExpiry = b.DaysUntilExpiry,
                b.RemainingQuantity,
                Value = b.RemainingQuantity * b.PurchasePrice,
                Severity = b.DaysUntilExpiry <= 7 ? "Critical" : 
                          b.DaysUntilExpiry <= 30 ? "High" : "Medium"
            })
            .OrderBy(x => x.DaysUntilExpiry);
        }

        public async Task<IEnumerable<object>> GetSalesChartDataAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            
            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.SaleDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalSales = g.Sum(s => s.TotalAmount),
                    SalesCount = g.Count()
                })
                .OrderBy(x => x.Date);
        }

        public async Task<IEnumerable<object>> GetTopSellingMedicinesChartAsync(int count = 10)
        {
            var allSaleItems = await _unitOfWork.SaleItems.GetAllAsync();
            
            return allSaleItems
                .GroupBy(si => si.MedicineId)
                .Select(g => new
                {
                    MedicineId = g.Key,
                    MedicineName = g.First().MedicineName,
                    TotalQuantity = g.Sum(si => si.Quantity),
                    TotalRevenue = g.Sum(si => si.TotalAmount),
                    TotalProfit = g.Sum(si => si.Profit)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(count);
        }

        public async Task<IEnumerable<object>> GetSalesByPaymentMethodChartAsync()
        {
            var sales = await _saleService.GetAllSalesAsync();
            
            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.PaymentMethod)
                .Select(g => new
                {
                    PaymentMethod = g.Key,
                    TotalSales = g.Sum(s => s.TotalAmount),
                    Count = g.Count()
                });
        }

        public async Task<IEnumerable<object>> GetInventoryByCategoryChartAsync()
        {
            var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
            var categories = await _unitOfWork.Categories.GetAllAsync();
            
            return categories.Select(c => new
            {
                CategoryName = c.Name,
                MedicineCount = medicines.Count(m => m.CategoryId == c.Id),
                TotalStock = medicines.Where(m => m.CategoryId == c.Id).Sum(m => m.TotalStock)
            })
            .Where(x => x.MedicineCount > 0);
        }

        public async Task<IEnumerable<object>> GetMonthlySalesChartAsync(int year)
        {
            var startDate = new DateTime(year, 1, 1);
            var endDate = new DateTime(year, 12, 31);
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            
            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.SaleDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    MonthName = new DateTime(year, g.Key, 1).ToString("MMMM"),
                    TotalSales = g.Sum(s => s.TotalAmount),
                    SalesCount = g.Count()
                })
                .OrderBy(x => x.Month);
        }

        public async Task<IEnumerable<object>> GetRecentActivitiesAsync(int count = 10)
        {
            var recentSales = await GetRecentSalesAsync(count);
            
            // You can extend this to include other activities like:
            // - New medicines added
            // - Batches received
            // - User logins
            
            return recentSales;
        }

        public async Task<IEnumerable<object>> GetStockMovementsAsync(int count = 10)
        {
            var batches = await _batchService.GetAllBatchesAsync();
            
            return batches
                .OrderByDescending(b => b.CreatedAt)
                .Take(count)
                .Select(b => new
                {
                    b.Id,
                    MedicineName = b.Medicine?.Name,
                    b.BatchNumber,
                    b.Quantity,
                    b.RemainingQuantity,
                    b.PurchaseDate,
                    SupplierName = b.Supplier?.Name,
                    b.Status
                });
        }
    }
}
