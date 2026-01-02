using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Sales operations
    /// </summary>
    public interface ISaleService
    {
        Task<IEnumerable<Sale>> GetAllSalesAsync();
        Task<Sale?> GetSaleByIdAsync(int id);
        Task<Sale?> GetSaleByNumberAsync(string saleNumber);
        Task<IEnumerable<Sale>> GetSalesByUserAsync(int userId);
        Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Sale>> GetSalesByStatusAsync(string status);
        Task<Sale> CreateSaleAsync(Sale sale);
        Task<Sale> UpdateSaleAsync(Sale sale);
        Task<bool> DeleteSaleAsync(int id);
        Task<string> GenerateSaleNumberAsync();
        
        // Sale with items
        Task<Sale> CreateSaleWithItemsAsync(Sale sale, List<SaleItem> saleItems);
        Task<Sale?> GetSaleWithItemsAsync(int id);
        
        // Refund operations
        Task<Sale> RefundSaleAsync(int saleId, string reason, int refundedBy);
        Task<bool> CanRefundSaleAsync(int saleId);
        
        // Statistics
        Task<decimal> GetTotalSalesAmountAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<int> GetTotalSalesCountAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<decimal> GetTotalProfitAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<IEnumerable<Sale>> GetTopSalesAsync(int count = 10);
        Task<Dictionary<string, decimal>> GetSalesByPaymentMethodAsync(DateTime? startDate = null, DateTime? endDate = null);
    }
}
