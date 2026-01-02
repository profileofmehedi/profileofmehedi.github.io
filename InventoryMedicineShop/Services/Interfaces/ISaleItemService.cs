using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Sale Item operations
    /// </summary>
    public interface ISaleItemService
    {
        Task<IEnumerable<SaleItem>> GetAllSaleItemsAsync();
        Task<SaleItem?> GetSaleItemByIdAsync(int id);
        Task<IEnumerable<SaleItem>> GetSaleItemsBySaleAsync(int saleId);
        Task<IEnumerable<SaleItem>> GetSaleItemsByMedicineAsync(int medicineId);
        Task<SaleItem> CreateSaleItemAsync(SaleItem saleItem);
        Task<SaleItem> UpdateSaleItemAsync(SaleItem saleItem);
        Task<bool> DeleteSaleItemAsync(int id);
        
        // Statistics
        Task<int> GetTotalQuantitySoldAsync(int medicineId);
        Task<IEnumerable<SaleItem>> GetTopSellingItemsAsync(int count = 10);
        Task<Dictionary<int, int>> GetMedicineSalesCountAsync();
    }
}
