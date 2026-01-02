using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for generating reports
    /// </summary>
    public interface IReportService
    {
        // Sales Reports
        Task<object> GetSalesReportAsync(DateTime startDate, DateTime endDate);
        Task<object> GetDailySalesReportAsync(DateTime date);
        Task<object> GetMonthlySalesReportAsync(int year, int month);
        Task<object> GetYearlySalesReportAsync(int year);
        Task<IEnumerable<object>> GetSalesByPaymentMethodReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<object>> GetSalesByCashierReportAsync(DateTime startDate, DateTime endDate);
        
        // Inventory Reports
        Task<IEnumerable<object>> GetInventoryReportAsync();
        Task<IEnumerable<object>> GetBatchReportAsync();
        Task<IEnumerable<object>> GetLowStockReportAsync();
        Task<IEnumerable<object>> GetOutOfStockReportAsync();
        Task<IEnumerable<object>> GetInventoryValueReportAsync();
        
        // Expiry Reports
        Task<IEnumerable<object>> GetExpiryReportAsync(int days = 90);
        Task<IEnumerable<object>> GetExpiredBatchesReportAsync();
        Task<IEnumerable<object>> GetExpiringThisMonthReportAsync();
        
        // Medicine Reports
        Task<IEnumerable<object>> GetTopSellingMedicinesReportAsync(int count = 10, DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<object>> GetSlowMovingMedicinesReportAsync(int days = 90);
        Task<IEnumerable<object>> GetMedicineSalesHistoryReportAsync(int medicineId, DateTime startDate, DateTime endDate);
        
        // Financial Reports
        Task<object> GetProfitReportAsync(DateTime startDate, DateTime endDate);
        Task<object> GetProfitByMedicineReportAsync(DateTime startDate, DateTime endDate);
        Task<object> GetProfitByCategoryReportAsync(DateTime startDate, DateTime endDate);
        
        // Supplier Reports
        Task<IEnumerable<object>> GetSupplierReportAsync();
        Task<object> GetPurchasesBySupplierReportAsync(int supplierId, DateTime? startDate = null, DateTime? endDate = null);
    }
}
