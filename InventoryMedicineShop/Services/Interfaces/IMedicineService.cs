using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Medicine operations
    /// </summary>
    public interface IMedicineService
    {
        Task<IEnumerable<Medicine>> GetAllMedicinesAsync();
        Task<IEnumerable<Medicine>> GetActiveMedicinesAsync();
        Task<Medicine?> GetMedicineByIdAsync(int id);
        Task<Medicine?> GetMedicineByCodeAsync(string code);
        Task<Medicine?> GetMedicineByBarcodeAsync(string barcode);
        Task<IEnumerable<Medicine>> GetMedicinesByCategoryAsync(int categoryId);
        Task<IEnumerable<Medicine>> SearchMedicinesAsync(string searchTerm);
        Task<Medicine> CreateMedicineAsync(Medicine medicine);
        Task<Medicine> UpdateMedicineAsync(Medicine medicine);
        Task<bool> DeleteMedicineAsync(int id);
        Task<bool> MedicineExistsAsync(string code);
        
        // Stock management
        Task<int> GetTotalStockAsync(int medicineId);
        Task<IEnumerable<Medicine>> GetLowStockMedicinesAsync();
        Task<IEnumerable<Medicine>> GetOutOfStockMedicinesAsync();
        Task<IEnumerable<Medicine>> GetMedicinesRequiringReorderAsync();
        
        // With computed properties
        Task<IEnumerable<Medicine>> GetMedicinesWithStockInfoAsync();
        Task<Medicine?> GetMedicineWithStockInfoAsync(int id);
    }
}
