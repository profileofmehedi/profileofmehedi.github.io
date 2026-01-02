using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Dashboard statistics and data
    /// </summary>
    public interface IDashboardService
    {
        // Overview statistics
        Task<object> GetDashboardOverviewAsync();
        Task<int> GetTotalMedicinesCountAsync();
        Task<int> GetTotalCategoriesCountAsync();
        Task<int> GetTotalSuppliersCountAsync();
        Task<int> GetTotalUsersCountAsync();
        
        // Sales statistics
        Task<decimal> GetTodaysSalesAsync();
        Task<decimal> GetThisWeekSalesAsync();
        Task<decimal> GetThisMonthSalesAsync();
        Task<decimal> GetThisYearSalesAsync();
        Task<int> GetTodaysSalesCountAsync();
        Task<IEnumerable<object>> GetRecentSalesAsync(int count = 10);
        
        // Inventory alerts
        Task<int> GetLowStockCountAsync();
        Task<int> GetOutOfStockCountAsync();
        Task<int> GetExpiringMedicinesCountAsync(int days = 30);
        Task<int> GetExpiredMedicinesCountAsync();
        Task<IEnumerable<object>> GetExpiryAlertsAsync(int days = 90);
        
        // Charts data
        Task<IEnumerable<object>> GetSalesChartDataAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<object>> GetTopSellingMedicinesChartAsync(int count = 10);
        Task<IEnumerable<object>> GetSalesByPaymentMethodChartAsync();
        Task<IEnumerable<object>> GetInventoryByCategoryChartAsync();
        Task<IEnumerable<object>> GetMonthlySalesChartAsync(int year);
        
        // Activity tracking
        Task<IEnumerable<object>> GetRecentActivitiesAsync(int count = 10);
        Task<IEnumerable<object>> GetStockMovementsAsync(int count = 10);
    }
}
