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
    /// Service implementation for Medicine Batch operations with FEFO logic
    /// </summary>
    public class MedicineBatchService : IMedicineBatchService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MedicineBatchService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MedicineBatch>> GetAllBatchesAsync()
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                null,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<IEnumerable<MedicineBatch>> GetActiveBatchesAsync()
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.Status == "active" && mb.ExpiryDate > DateTime.Now,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<MedicineBatch?> GetBatchByIdAsync(int id)
        {
            var batches = await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.Id == id,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
            return batches.FirstOrDefault();
        }

        public async Task<MedicineBatch?> GetBatchByNumberAsync(string batchNumber)
        {
            return await _unitOfWork.MedicineBatches.FirstOrDefaultAsync(mb => mb.BatchNumber == batchNumber);
        }

        public async Task<IEnumerable<MedicineBatch>> GetBatchesByMedicineAsync(int medicineId)
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.MedicineId == medicineId,
                mb => mb.Supplier!);
        }

        public async Task<IEnumerable<MedicineBatch>> GetBatchesBySupplierAsync(int supplierId)
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.SupplierId == supplierId,
                mb => mb.Medicine!);
        }

        public async Task<MedicineBatch> CreateBatchAsync(MedicineBatch batch)
        {
            batch.RemainingQuantity = batch.Quantity;
            batch.Status = "active";
            
            await _unitOfWork.MedicineBatches.AddAsync(batch);
            await _unitOfWork.SaveChangesAsync();
            return batch;
        }

        public async Task<MedicineBatch> UpdateBatchAsync(MedicineBatch batch)
        {
            _unitOfWork.MedicineBatches.Update(batch);
            await _unitOfWork.SaveChangesAsync();
            return batch;
        }

        public async Task<bool> DeleteBatchAsync(int id)
        {
            var batch = await _unitOfWork.MedicineBatches.GetByIdAsync(id);
            if (batch == null) return false;

            _unitOfWork.MedicineBatches.SoftDelete(batch);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BatchExistsAsync(int medicineId, string batchNumber)
        {
            return await _unitOfWork.MedicineBatches.AnyAsync(
                mb => mb.MedicineId == medicineId && mb.BatchNumber == batchNumber);
        }

        // FEFO (First Expired, First Out) Implementation
        public async Task<IEnumerable<MedicineBatch>> GetAvailableBatchesForSaleAsync(int medicineId, int requiredQuantity)
        {
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.MedicineId == medicineId &&
                      mb.Status == "active" &&
                      mb.RemainingQuantity > 0 &&
                      mb.ExpiryDate > DateTime.Now);

            // Sort by expiry date (FEFO - First Expired, First Out)
            return batches.OrderBy(mb => mb.ExpiryDate).ToList();
        }

        public async Task<bool> DeductQuantityFromBatchesAsync(int medicineId, int quantity)
        {
            var availableBatches = await GetAvailableBatchesForSaleAsync(medicineId, quantity);
            var batchList = availableBatches.ToList();

            if (batchList.Sum(b => b.RemainingQuantity) < quantity)
            {
                return false; // Not enough stock
            }

            int remainingQuantity = quantity;

            foreach (var batch in batchList)
            {
                if (remainingQuantity <= 0) break;

                if (batch.RemainingQuantity >= remainingQuantity)
                {
                    batch.RemainingQuantity -= remainingQuantity;
                    remainingQuantity = 0;
                }
                else
                {
                    remainingQuantity -= batch.RemainingQuantity;
                    batch.RemainingQuantity = 0;
                }

                // Update batch status if depleted
                if (batch.RemainingQuantity == 0)
                {
                    batch.Status = "depleted";
                }

                _unitOfWork.MedicineBatches.Update(batch);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task UpdateBatchStatusAsync(int batchId, string status)
        {
            var batch = await _unitOfWork.MedicineBatches.GetByIdAsync(batchId);
            if (batch != null)
            {
                batch.Status = status;
                _unitOfWork.MedicineBatches.Update(batch);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        // Expiry Management
        public async Task<IEnumerable<MedicineBatch>> GetExpiredBatchesAsync()
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.ExpiryDate < DateTime.Now && mb.RemainingQuantity > 0,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<IEnumerable<MedicineBatch>> GetExpiringBatchesAsync(int days)
        {
            var futureDate = DateTime.Now.AddDays(days);
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.ExpiryDate > DateTime.Now && 
                      mb.ExpiryDate <= futureDate && 
                      mb.RemainingQuantity > 0,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<IEnumerable<MedicineBatch>> GetBatchesExpiringWithinDaysAsync(DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.ExpiryDate >= startDate && mb.ExpiryDate <= endDate,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<int> GetExpiredBatchCountAsync()
        {
            return await _unitOfWork.MedicineBatches.CountAsync(
                mb => mb.ExpiryDate < DateTime.Now && mb.RemainingQuantity > 0);
        }

        public async Task<decimal> GetExpiredBatchValueAsync()
        {
            var expiredBatches = await GetExpiredBatchesAsync();
            return expiredBatches.Sum(mb => mb.RemainingQuantity * mb.PurchasePrice);
        }

        // Stock Queries
        public async Task<IEnumerable<MedicineBatch>> GetDepletedBatchesAsync()
        {
            return await _unitOfWork.MedicineBatches.GetWithIncludesAsync(
                mb => mb.RemainingQuantity == 0,
                mb => mb.Medicine!,
                mb => mb.Supplier!);
        }

        public async Task<int> GetTotalStockByMedicineAsync(int medicineId)
        {
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.MedicineId == medicineId && 
                      mb.Status == "active" && 
                      mb.ExpiryDate > DateTime.Now);
            
            return batches.Sum(mb => mb.RemainingQuantity);
        }

        public async Task<decimal> GetTotalInventoryValueAsync()
        {
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.Status == "active" && mb.RemainingQuantity > 0);
            
            return batches.Sum(mb => mb.RemainingQuantity * mb.PurchasePrice);
        }

        public async Task<decimal> GetInventoryValueByMedicineAsync(int medicineId)
        {
            var batches = await _unitOfWork.MedicineBatches.FindAsync(
                mb => mb.MedicineId == medicineId && 
                      mb.Status == "active" && 
                      mb.RemainingQuantity > 0);
            
            return batches.Sum(mb => mb.RemainingQuantity * mb.PurchasePrice);
        }
    }
}
