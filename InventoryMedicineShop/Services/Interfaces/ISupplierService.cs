using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Supplier operations
    /// </summary>
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetAllSuppliersAsync();
        Task<IEnumerable<Supplier>> GetActiveSuppliersAsync();
        Task<Supplier?> GetSupplierByIdAsync(int id);
        Task<Supplier?> GetSupplierByEmailAsync(string email);
        Task<Supplier> CreateSupplierAsync(Supplier supplier);
        Task<Supplier> UpdateSupplierAsync(Supplier supplier);
        Task<bool> DeleteSupplierAsync(int id);
        Task<bool> SupplierExistsAsync(string email);
        Task<IEnumerable<MedicineBatch>> GetSupplierBatchesAsync(int supplierId);
        Task<decimal> GetTotalPurchasesBySupplierAsync(int supplierId);
        Task<bool> CanDeleteSupplierAsync(int supplierId);
    }
}
