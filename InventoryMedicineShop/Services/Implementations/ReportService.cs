using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Services.Interfaces;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for generating reports
    /// </summary>
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedicineService _medicineService;
        private readonly IMedicineBatchService _batchService;
        private readonly ISaleService _saleService;

        public ReportService(
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

        // Sales Reports
        public async Task<object> GetSalesReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            var completedSales = sales.Where(s => s.Status == "completed").ToList();

            var report = new
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalSales = completedSales.Count,
                TotalRevenue = completedSales.Sum(s => s.TotalAmount),
                TotalProfit = completedSales.Sum(s => s.SaleItems.Sum(si => si.Profit)),
                AverageOrderValue = completedSales.Any() ? completedSales.Average(s => s.TotalAmount) : 0,
                TotalItemsSold = completedSales.Sum(s => s.SaleItems.Sum(si => si.Quantity)),
                Sales = completedSales.Select(s => new
                {
                    s.SaleNumber,
                    s.SaleDate,
                    s.TotalAmount,
                    s.PaymentMethod,
                    CashierName = s.User?.Name,
                    ItemCount = s.SaleItems.Count
                })
            };

            return report;
        }

        public async Task<object> GetDailySalesReportAsync(DateTime date)
        {
            var nextDay = date.AddDays(1);
            return await GetSalesReportAsync(date, nextDay);
        }

        public async Task<object> GetMonthlySalesReportAsync(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);
            return await GetSalesReportAsync(startDate, endDate);
        }

        public async Task<object> GetYearlySalesReportAsync(int year)
        {
            var startDate = new DateTime(year, 1, 1);
            var endDate = startDate.AddYears(1);
            return await GetSalesReportAsync(startDate, endDate);
        }

        public async Task<IEnumerable<object>> GetSalesByPaymentMethodReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            
            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.PaymentMethod)
                .Select(g => new
                {
                    PaymentMethod = g.Key,
                    TotalSales = g.Count(),
                    TotalRevenue = g.Sum(s => s.TotalAmount),
                    Percentage = sales.Any() ? (g.Count() * 100.0 / sales.Count()) : 0
                });
        }

        public async Task<IEnumerable<object>> GetSalesByCashierReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            
            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    UserName = g.First().User?.Name,
                    TotalSales = g.Count(),
                    TotalRevenue = g.Sum(s => s.TotalAmount),
                    AverageOrderValue = g.Average(s => s.TotalAmount)
                })
                .OrderByDescending(x => x.TotalRevenue);
        }

        // Inventory Reports
        public async Task<IEnumerable<object>> GetInventoryReportAsync()
        {
            var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
            
            return medicines.Select(m => new
            {
                m.Id,
                m.Name,
                m.Code,
                CategoryName = m.Category?.Name,
                m.TotalStock,
                m.StockStatus,
                m.NearestExpiryDate,
                m.ReorderPoint,
                NeedsReorder = m.TotalStock <= m.ReorderPoint
            });
        }

        public async Task<IEnumerable<object>> GetBatchReportAsync()
        {
            var batches = await _batchService.GetAllBatchesAsync();
            
            return batches.Select(b => new
            {
                b.Id,
                MedicineName = b.Medicine?.Name,
                b.BatchNumber,
                SupplierName = b.Supplier?.Name,
                b.PurchaseDate,
                b.ExpiryDate,
                b.Quantity,
                b.RemainingQuantity,
                b.PurchasePrice,
                b.SellingPrice,
                b.Status,
                DaysUntilExpiry = b.DaysUntilExpiry,
                CurrentValue = b.RemainingQuantity * b.PurchasePrice
            })
            .OrderBy(x => x.ExpiryDate);
        }

        public async Task<IEnumerable<object>> GetLowStockReportAsync()
        {
            var medicines = await _medicineService.GetLowStockMedicinesAsync();
            
            return medicines.Select(m => new
            {
                m.Id,
                m.Name,
                m.Code,
                CategoryName = m.Category?.Name,
                m.TotalStock,
                m.LowStockThreshold,
                m.ReorderPoint,
                DeficitQuantity = m.ReorderPoint - m.TotalStock
            });
        }

        public async Task<IEnumerable<object>> GetOutOfStockReportAsync()
        {
            var medicines = await _medicineService.GetOutOfStockMedicinesAsync();
            
            return medicines.Select(m => new
            {
                m.Id,
                m.Name,
                m.Code,
                CategoryName = m.Category?.Name,
                m.ReorderPoint,
                RequiredQuantity = m.ReorderPoint
            });
        }

        public async Task<IEnumerable<object>> GetInventoryValueReportAsync()
        {
            var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
            var medicinesList = medicines.ToList();

            var inventoryValues = new List<object>();

            foreach (var medicine in medicinesList)
            {
                var value = await _batchService.GetInventoryValueByMedicineAsync(medicine.Id);
                inventoryValues.Add(new
                {
                    medicine.Id,
                    medicine.Name,
                    medicine.Code,
                    CategoryName = medicine.Category?.Name,
                    medicine.TotalStock,
                    InventoryValue = value
                });
            }

            return inventoryValues.OrderByDescending(x => ((dynamic)x).InventoryValue);
        }

        // Expiry Reports
        public async Task<IEnumerable<object>> GetExpiryReportAsync(int days = 90)
        {
            var batches = await _batchService.GetExpiringBatchesAsync(days);
            
            return batches.Select(b => new
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

        public async Task<IEnumerable<object>> GetExpiredBatchesReportAsync()
        {
            var batches = await _batchService.GetExpiredBatchesAsync();
            
            return batches.Select(b => new
            {
                b.Id,
                MedicineName = b.Medicine?.Name,
                b.BatchNumber,
                b.ExpiryDate,
                DaysExpired = (DateTime.Now - b.ExpiryDate).Days,
                b.RemainingQuantity,
                ValueLost = b.RemainingQuantity * b.PurchasePrice
            })
            .OrderByDescending(x => x.DaysExpired);
        }

        public async Task<IEnumerable<object>> GetExpiringThisMonthReportAsync()
        {
            var startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            
            var batches = await _batchService.GetBatchesExpiringWithinDaysAsync(startOfMonth, endOfMonth);
            
            return batches.Select(b => new
            {
                b.Id,
                MedicineName = b.Medicine?.Name,
                b.BatchNumber,
                b.ExpiryDate,
                DaysUntilExpiry = b.DaysUntilExpiry,
                b.RemainingQuantity,
                Value = b.RemainingQuantity * b.PurchasePrice
            });
        }

        // Medicine Reports
        public async Task<IEnumerable<object>> GetTopSellingMedicinesReportAsync(int count = 10, DateTime? startDate = null, DateTime? endDate = null)
        {
            IEnumerable<Models.Sale> sales;
            
            if (startDate.HasValue && endDate.HasValue)
            {
                sales = await _saleService.GetSalesByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                sales = await _saleService.GetAllSalesAsync();
            }

            var completedSales = sales.Where(s => s.Status == "completed");
            var allSaleItems = completedSales.SelectMany(s => s.SaleItems);

            return allSaleItems
                .GroupBy(si => si.MedicineId)
                .Select(g => new
                {
                    MedicineId = g.Key,
                    MedicineName = g.First().MedicineName,
                    TotalQuantitySold = g.Sum(si => si.Quantity),
                    TotalRevenue = g.Sum(si => si.TotalAmount),
                    TotalProfit = g.Sum(si => si.Profit),
                    AveragePrice = g.Average(si => si.UnitPrice),
                    SalesCount = g.Count()
                })
                .OrderByDescending(x => x.TotalQuantitySold)
                .Take(count);
        }

        public async Task<IEnumerable<object>> GetSlowMovingMedicinesReportAsync(int days = 90)
        {
            var startDate = DateTime.Now.AddDays(-days);
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, DateTime.Now);
            
            var soldMedicineIds = sales
                .Where(s => s.Status == "completed")
                .SelectMany(s => s.SaleItems)
                .Select(si => si.MedicineId)
                .Distinct()
                .ToList();

            var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
            
            return medicines
                .Where(m => !soldMedicineIds.Contains(m.Id) && m.TotalStock > 0)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Code,
                    CategoryName = m.Category?.Name,
                    m.TotalStock,
                    DaysWithoutSale = days
                });
        }

        public async Task<IEnumerable<object>> GetMedicineSalesHistoryReportAsync(int medicineId, DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            
            var medicineData = sales
                .Where(s => s.Status == "completed")
                .SelectMany(s => s.SaleItems.Where(si => si.MedicineId == medicineId)
                    .Select(si => new
                    {
                        s.SaleDate,
                        s.SaleNumber,
                        si.Quantity,
                        si.UnitPrice,
                        si.TotalAmount,
                        si.Profit
                    }))
                .OrderByDescending(x => x.SaleDate);

            return medicineData;
        }

        // Financial Reports
        public async Task<object> GetProfitReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            var completedSales = sales.Where(s => s.Status == "completed").ToList();

            var totalRevenue = completedSales.Sum(s => s.TotalAmount);
            var totalCost = completedSales.Sum(s => s.SaleItems.Sum(si => si.PurchasePrice * si.Quantity));
            var totalProfit = totalRevenue - totalCost;

            return new
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalRevenue = totalRevenue,
                TotalCost = totalCost,
                TotalProfit = totalProfit,
                ProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
                TotalSales = completedSales.Count
            };
        }

        public async Task<object> GetProfitByMedicineReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            var completedSales = sales.Where(s => s.Status == "completed");
            var allSaleItems = completedSales.SelectMany(s => s.SaleItems);

            return allSaleItems
                .GroupBy(si => si.MedicineId)
                .Select(g => new
                {
                    MedicineId = g.Key,
                    MedicineName = g.First().MedicineName,
                    TotalRevenue = g.Sum(si => si.TotalAmount),
                    TotalCost = g.Sum(si => si.PurchasePrice * si.Quantity),
                    TotalProfit = g.Sum(si => si.Profit),
                    QuantitySold = g.Sum(si => si.Quantity),
                    ProfitMargin = g.Sum(si => si.TotalAmount) > 0 ? 
                        (g.Sum(si => si.Profit) / g.Sum(si => si.TotalAmount)) * 100 : 0
                })
                .OrderByDescending(x => x.TotalProfit);
        }

        public async Task<object> GetProfitByCategoryReportAsync(DateTime startDate, DateTime endDate)
        {
            var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
            var medicines = await _medicineService.GetAllMedicinesAsync();
            var categories = await _unitOfWork.Categories.GetAllAsync();

            var completedSales = sales.Where(s => s.Status == "completed");
            var allSaleItems = completedSales.SelectMany(s => s.SaleItems);

            var profitByCategory = allSaleItems
                .Join(medicines,
                    si => si.MedicineId,
                    m => m.Id,
                    (si, m) => new { SaleItem = si, Medicine = m })
                .GroupBy(x => x.Medicine.CategoryId)
                .Select(g => new
                {
                    CategoryId = g.Key,
                    CategoryName = categories.FirstOrDefault(c => c.Id == g.Key)?.Name,
                    TotalRevenue = g.Sum(x => x.SaleItem.TotalAmount),
                    TotalCost = g.Sum(x => x.SaleItem.PurchasePrice * x.SaleItem.Quantity),
                    TotalProfit = g.Sum(x => x.SaleItem.Profit),
                    QuantitySold = g.Sum(x => x.SaleItem.Quantity),
                    ProfitMargin = g.Sum(x => x.SaleItem.TotalAmount) > 0 ?
                        (g.Sum(x => x.SaleItem.Profit) / g.Sum(x => x.SaleItem.TotalAmount)) * 100 : 0
                })
                .OrderByDescending(x => x.TotalProfit);

            return profitByCategory;
        }

        // Supplier Reports
        public async Task<IEnumerable<object>> GetSupplierReportAsync()
        {
            var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
            var supplierReport = new List<object>();

            foreach (var supplier in suppliers)
            {
                var batches = await _batchService.GetBatchesBySupplierAsync(supplier.Id);
                var totalPurchases = batches.Sum(b => b.Quantity * b.PurchasePrice);
                var totalBatches = batches.Count();

                supplierReport.Add(new
                {
                    supplier.Id,
                    supplier.Name,
                    supplier.ContactPerson,
                    supplier.Email,
                    supplier.Phone,
                    TotalBatches = totalBatches,
                    TotalPurchases = totalPurchases,
                    supplier.IsActive
                });
            }

            return supplierReport.OrderByDescending(x => ((dynamic)x).TotalPurchases);
        }

        public async Task<object> GetPurchasesBySupplierReportAsync(int supplierId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var batches = await _batchService.GetBatchesBySupplierAsync(supplierId);

            if (startDate.HasValue && endDate.HasValue)
            {
                batches = batches.Where(b => b.PurchaseDate >= startDate.Value && b.PurchaseDate <= endDate.Value);
            }

            var batchesList = batches.ToList();
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(supplierId);

            return new
            {
                Supplier = new
                {
                    supplier?.Id,
                    supplier?.Name,
                    supplier?.ContactPerson,
                    supplier?.Email,
                    supplier?.Phone
                },
                TotalBatches = batchesList.Count,
                TotalPurchases = batchesList.Sum(b => b.Quantity * b.PurchasePrice),
                TotalQuantity = batchesList.Sum(b => b.Quantity),
                Batches = batchesList.Select(b => new
                {
                    b.Id,
                    MedicineName = b.Medicine?.Name,
                    b.BatchNumber,
                    b.PurchaseDate,
                    b.Quantity,
                    b.PurchasePrice,
                    TotalCost = b.Quantity * b.PurchasePrice
                })
                .OrderByDescending(x => x.PurchaseDate)
            };
        }
    }
}
