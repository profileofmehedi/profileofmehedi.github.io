using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Supplier operations
    /// </summary>
    public class SupplierService : ISupplierService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SupplierService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Supplier>> GetAllSuppliersAsync()
        {
            return await _unitOfWork.Suppliers.GetAllAsync();
        }

        public async Task<IEnumerable<Supplier>> GetActiveSuppliersAsync()
        {
            return await _unitOfWork.Suppliers.FindAsync(s => s.IsActive);
        }

        public async Task<Supplier?> GetSupplierByIdAsync(int id)
        {
            return await _unitOfWork.Suppliers.GetByIdAsync(id);
        }

        public async Task<Supplier?> GetSupplierByEmailAsync(string email)
        {
            return await _unitOfWork.Suppliers.FirstOrDefaultAsync(s => s.Email == email);
        }

        public async Task<Supplier> CreateSupplierAsync(Supplier supplier)
        {
            await _unitOfWork.Suppliers.AddAsync(supplier);
            await _unitOfWork.SaveChangesAsync();
            return supplier;
        }

        public async Task<Supplier> UpdateSupplierAsync(Supplier supplier)
        {
            _unitOfWork.Suppliers.Update(supplier);
            await _unitOfWork.SaveChangesAsync();
            return supplier;
        }

        public async Task<bool> DeleteSupplierAsync(int id)
        {
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
            if (supplier == null) return false;

            _unitOfWork.Suppliers.SoftDelete(supplier);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SupplierExistsAsync(string email)
        {
            return await _unitOfWork.Suppliers.AnyAsync(s => s.Email == email);
        }

        public async Task<IEnumerable<MedicineBatch>> GetSupplierBatchesAsync(int supplierId)
        {
            return await _unitOfWork.MedicineBatches.FindAsync(mb => mb.SupplierId == supplierId);
        }

        public async Task<decimal> GetTotalPurchasesBySupplierAsync(int supplierId)
        {
            var batches = await _unitOfWork.MedicineBatches
                .FindAsync(mb => mb.SupplierId == supplierId);
            
            return batches.Sum(mb => mb.Quantity * mb.PurchasePrice);
        }

        public async Task<bool> CanDeleteSupplierAsync(int supplierId)
        {
            var batchCount = await _unitOfWork.MedicineBatches
                .CountAsync(mb => mb.SupplierId == supplierId);
            return batchCount == 0;
        }
    }
}
