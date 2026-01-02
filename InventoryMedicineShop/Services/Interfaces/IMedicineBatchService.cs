using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Medicine Batch operations with FEFO logic
    /// </summary>
    public interface IMedicineBatchService
    {
        Task<IEnumerable<MedicineBatch>> GetAllBatchesAsync();
        Task<IEnumerable<MedicineBatch>> GetActiveBatchesAsync();
        Task<MedicineBatch?> GetBatchByIdAsync(int id);
        Task<MedicineBatch?> GetBatchByNumberAsync(string batchNumber);
        Task<IEnumerable<MedicineBatch>> GetBatchesByMedicineAsync(int medicineId);
        Task<IEnumerable<MedicineBatch>> GetBatchesBySupplierAsync(int supplierId);
        Task<MedicineBatch> CreateBatchAsync(MedicineBatch batch);
        Task<MedicineBatch> UpdateBatchAsync(MedicineBatch batch);
        Task<bool> DeleteBatchAsync(int id);
        Task<bool> BatchExistsAsync(int medicineId, string batchNumber);
        
        // FEFO (First Expired, First Out) operations
        Task<IEnumerable<MedicineBatch>> GetAvailableBatchesForSaleAsync(int medicineId, int requiredQuantity);
        Task<bool> DeductQuantityFromBatchesAsync(int medicineId, int quantity);
        Task UpdateBatchStatusAsync(int batchId, string status);
        
        // Expiry management
        Task<IEnumerable<MedicineBatch>> GetExpiredBatchesAsync();
        Task<IEnumerable<MedicineBatch>> GetExpiringBatchesAsync(int days);
        Task<IEnumerable<MedicineBatch>> GetBatchesExpiringWithinDaysAsync(DateTime startDate, DateTime endDate);
        Task<int> GetExpiredBatchCountAsync();
        Task<decimal> GetExpiredBatchValueAsync();
        
        // Stock queries
        Task<IEnumerable<MedicineBatch>> GetDepletedBatchesAsync();
        Task<int> GetTotalStockByMedicineAsync(int medicineId);
        Task<decimal> GetTotalInventoryValueAsync();
        Task<decimal> GetInventoryValueByMedicineAsync(int medicineId);
    }
}
