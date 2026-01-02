using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Medicine operations
    /// </summary>
    public class MedicineService : IMedicineService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MedicineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Medicine>> GetAllMedicinesAsync()
        {
            return await _unitOfWork.Medicines.GetWithIncludesAsync(
                null,
                m => m.Category!);
        }

        public async Task<IEnumerable<Medicine>> GetActiveMedicinesAsync()
        {
            return await _unitOfWork.Medicines.GetWithIncludesAsync(
                m => m.IsActive,
                m => m.Category!);
        }

        public async Task<Medicine?> GetMedicineByIdAsync(int id)
        {
            var medicines = await _unitOfWork.Medicines.GetWithIncludesAsync(
                m => m.Id == id,
                m => m.Category!);
            return medicines.FirstOrDefault();
        }

        public async Task<Medicine?> GetMedicineByCodeAsync(string code)
        {
            return await _unitOfWork.Medicines.FirstOrDefaultAsync(m => m.Code == code);
        }

        public async Task<Medicine?> GetMedicineByBarcodeAsync(string barcode)
        {
            return await _unitOfWork.Medicines.FirstOrDefaultAsync(m => m.Barcode == barcode);
        }

        public async Task<IEnumerable<Medicine>> GetMedicinesByCategoryAsync(int categoryId)
        {
            return await _unitOfWork.Medicines.FindAsync(m => m.CategoryId == categoryId);
        }

        public async Task<IEnumerable<Medicine>> SearchMedicinesAsync(string searchTerm)
        {
            var query = _unitOfWork.Medicines.GetQueryable()
                .Include(m => m.Category)
                .Where(m => 
                    m.Name.Contains(searchTerm) ||
                    m.Code.Contains(searchTerm) ||
                    (m.GenericName != null && m.GenericName.Contains(searchTerm)) ||
                    (m.Manufacturer != null && m.Manufacturer.Contains(searchTerm)));

            return await query.ToListAsync();
        }

        public async Task<Medicine> CreateMedicineAsync(Medicine medicine)
        {
            await _unitOfWork.Medicines.AddAsync(medicine);
            await _unitOfWork.SaveChangesAsync();
            return medicine;
        }

        public async Task<Medicine> UpdateMedicineAsync(Medicine medicine)
        {
            _unitOfWork.Medicines.Update(medicine);
            await _unitOfWork.SaveChangesAsync();
            return medicine;
        }

        public async Task<bool> DeleteMedicineAsync(int id)
        {
            var medicine = await _unitOfWork.Medicines.GetByIdAsync(id);
            if (medicine == null) return false;

            _unitOfWork.Medicines.SoftDelete(medicine);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MedicineExistsAsync(string code)
        {
            return await _unitOfWork.Medicines.AnyAsync(m => m.Code == code);
        }

        public async Task<int> GetTotalStockAsync(int medicineId)
        {
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.MedicineId == medicineId && 
                      mb.Status == "active" && 
                      mb.ExpiryDate > DateTime.Now);
            
            return batches.Sum(mb => mb.RemainingQuantity);
        }

        public async Task<IEnumerable<Medicine>> GetLowStockMedicinesAsync()
        {
            var medicines = await GetMedicinesWithStockInfoAsync();
            return medicines.Where(m => 
                m.TotalStock > 0 && 
                m.TotalStock <= m.LowStockThreshold);
        }

        public async Task<IEnumerable<Medicine>> GetOutOfStockMedicinesAsync()
        {
            var medicines = await GetMedicinesWithStockInfoAsync();
            return medicines.Where(m => m.TotalStock == 0);
        }

        public async Task<IEnumerable<Medicine>> GetMedicinesRequiringReorderAsync()
        {
            var medicines = await GetMedicinesWithStockInfoAsync();
            return medicines.Where(m => m.TotalStock <= m.ReorderPoint);
        }

        public async Task<IEnumerable<Medicine>> GetMedicinesWithStockInfoAsync()
        {
            var medicines = await GetAllMedicinesAsync();
            var medicinesList = medicines.ToList();

            foreach (var medicine in medicinesList)
            {
                medicine.TotalStock = await GetTotalStockAsync(medicine.Id);
                
                var batches = await _unitOfWork.MedicineBatches.FindAsync(
                    mb => mb.MedicineId == medicine.Id && 
                          mb.Status == "active" && 
                          mb.RemainingQuantity > 0);
                
                medicine.NearestExpiryDate = batches
                    .OrderBy(mb => mb.ExpiryDate)
                    .FirstOrDefault()?.ExpiryDate;

                // Determine stock status
                if (medicine.TotalStock == 0)
                {
                    medicine.StockStatus = "Out of Stock";
                }
                else if (medicine.TotalStock <= medicine.LowStockThreshold)
                {
                    medicine.StockStatus = "Low Stock";
                }
                else
                {
                    medicine.StockStatus = "In Stock";
                }
            }

            return medicinesList;
        }

        public async Task<Medicine?> GetMedicineWithStockInfoAsync(int id)
        {
            var medicine = await GetMedicineByIdAsync(id);
            if (medicine == null) return null;

            medicine.TotalStock = await GetTotalStockAsync(id);
            
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.MedicineId == id && 
                      mb.Status == "active" && 
                      mb.RemainingQuantity > 0);
            
            medicine.NearestExpiryDate = batches
                .OrderBy(mb => mb.ExpiryDate)
                .FirstOrDefault()?.ExpiryDate;

            if (medicine.TotalStock == 0)
            {
                medicine.StockStatus = "Out of Stock";
            }
            else if (medicine.TotalStock <= medicine.LowStockThreshold)
            {
                medicine.StockStatus = "Low Stock";
            }
            else
            {
                medicine.StockStatus = "In Stock";
            }

            return medicine;
        }
    }
}
