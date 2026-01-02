using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Sale Item operations
    /// </summary>
    public class SaleItemService : ISaleItemService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SaleItemService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<SaleItem>> GetAllSaleItemsAsync()
        {
            return await _unitOfWork.SaleItems.GetWithIncludesAsync(
                null,
                si => si.Sale!,
                si => si.Medicine!,
                si => si.MedicineBatch!);
        }

        public async Task<SaleItem?> GetSaleItemByIdAsync(int id)
        {
            var items = await _unitOfWork.SaleItems.GetWithIncludesAsync(
                si => si.Id == id,
                si => si.Sale!,
                si => si.Medicine!,
                si => si.MedicineBatch!);
            return items.FirstOrDefault();
        }

        public async Task<IEnumerable<SaleItem>> GetSaleItemsBySaleAsync(int saleId)
        {
            return await _unitOfWork.SaleItems.GetWithIncludesAsync(
                si => si.SaleId == saleId,
                si => si.Medicine!,
                si => si.MedicineBatch!);
        }

        public async Task<IEnumerable<SaleItem>> GetSaleItemsByMedicineAsync(int medicineId)
        {
            return await _unitOfWork.SaleItems.GetWithIncludesAsync(
                si => si.MedicineId == medicineId,
                si => si.Sale!,
                si => si.MedicineBatch!);
        }

        public async Task<SaleItem> CreateSaleItemAsync(SaleItem saleItem)
        {
            await _unitOfWork.SaleItems.AddAsync(saleItem);
            await _unitOfWork.SaveChangesAsync();
            return saleItem;
        }

        public async Task<SaleItem> UpdateSaleItemAsync(SaleItem saleItem)
        {
            _unitOfWork.SaleItems.Update(saleItem);
            await _unitOfWork.SaveChangesAsync();
            return saleItem;
        }

        public async Task<bool> DeleteSaleItemAsync(int id)
        {
            var saleItem = await _unitOfWork.SaleItems.GetByIdAsync(id);
            if (saleItem == null) return false;

            _unitOfWork.SaleItems.SoftDelete(saleItem);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetTotalQuantitySoldAsync(int medicineId)
        {
            var items = await GetSaleItemsByMedicineAsync(medicineId);
            return items.Sum(si => si.Quantity);
        }

        public async Task<IEnumerable<SaleItem>> GetTopSellingItemsAsync(int count = 10)
        {
            var allItems = await GetAllSaleItemsAsync();
            
            return allItems
                .GroupBy(si => si.MedicineId)
                .Select(g => new
                {
                    MedicineId = g.Key,
                    TotalQuantity = g.Sum(si => si.Quantity),
                    SaleItem = g.First()
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(count)
                .Select(x => x.SaleItem);
        }

        public async Task<Dictionary<int, int>> GetMedicineSalesCountAsync()
        {
            var allItems = await GetAllSaleItemsAsync();
            
            return allItems
                .GroupBy(si => si.MedicineId)
                .ToDictionary(g => g.Key, g => g.Sum(si => si.Quantity));
        }
    }
}
