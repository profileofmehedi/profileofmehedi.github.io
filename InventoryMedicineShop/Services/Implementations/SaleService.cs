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
    /// Service implementation for Sales operations
    /// </summary>
    public class SaleService : ISaleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SaleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Sale>> GetAllSalesAsync()
        {
            return await _unitOfWork.Sales.GetWithIncludesAsync(
                null,
                s => s.User!,
                s => s.SaleItems);
        }

        public async Task<Sale?> GetSaleByIdAsync(int id)
        {
            var sales = await _unitOfWork.Sales.GetWithIncludesAsync(
                s => s.Id == id,
                s => s.User!,
                s => s.SaleItems);
            return sales.FirstOrDefault();
        }

        public async Task<Sale?> GetSaleByNumberAsync(string saleNumber)
        {
            var sales = await _unitOfWork.Sales.GetWithIncludesAsync(
                s => s.SaleNumber == saleNumber,
                s => s.User!,
                s => s.SaleItems);
            return sales.FirstOrDefault();
        }

        public async Task<IEnumerable<Sale>> GetSalesByUserAsync(int userId)
        {
            return await _unitOfWork.Sales.GetWithIncludesAsync(
                s => s.UserId == userId,
                s => s.User!,
                s => s.SaleItems);
        }

        public async Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.Sales.GetWithIncludesAsync(
                s => s.SaleDate >= startDate && s.SaleDate <= endDate,
                s => s.User!,
                s => s.SaleItems);
        }

        public async Task<IEnumerable<Sale>> GetSalesByStatusAsync(string status)
        {
            return await _unitOfWork.Sales.GetWithIncludesAsync(
                s => s.Status == status,
                s => s.User!,
                s => s.SaleItems);
        }

        public async Task<Sale> CreateSaleAsync(Sale sale)
        {
            sale.SaleNumber = await GenerateSaleNumberAsync();
            sale.SaleDate = DateTime.UtcNow;
            
            await _unitOfWork.Sales.AddAsync(sale);
            await _unitOfWork.SaveChangesAsync();
            return sale;
        }

        public async Task<Sale> UpdateSaleAsync(Sale sale)
        {
            _unitOfWork.Sales.Update(sale);
            await _unitOfWork.SaveChangesAsync();
            return sale;
        }

        public async Task<bool> DeleteSaleAsync(int id)
        {
            var sale = await _unitOfWork.Sales.GetByIdAsync(id);
            if (sale == null) return false;

            _unitOfWork.Sales.SoftDelete(sale);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<string> GenerateSaleNumberAsync()
        {
            var today = DateTime.UtcNow;
            var prefix = $"SALE-{today:yyyyMMdd}";
            
            var todaysSales = await _unitOfWork.Sales.FindAsync(
                s => s.SaleNumber.StartsWith(prefix));
            
            var count = todaysSales.Count() + 1;
            return $"{prefix}-{count:D4}";
        }

        public async Task<Sale> CreateSaleWithItemsAsync(Sale sale, List<SaleItem> saleItems)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                // Create the sale
                sale.SaleNumber = await GenerateSaleNumberAsync();
                sale.SaleDate = DateTime.UtcNow;
                await _unitOfWork.Sales.AddAsync(sale);
                await _unitOfWork.SaveChangesAsync();

                // Add sale items
                foreach (var item in saleItems)
                {
                    item.SaleId = sale.Id;
                    await _unitOfWork.SaleItems.AddAsync(item);
                }
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitTransactionAsync();
                return sale;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<Sale?> GetSaleWithItemsAsync(int id)
        {
            return await GetSaleByIdAsync(id);
        }

        public async Task<Sale> RefundSaleAsync(int saleId, string reason, int refundedBy)
        {
            var sale = await GetSaleByIdAsync(saleId);
            if (sale == null)
            {
                throw new Exception("Sale not found");
            }

            if (!await CanRefundSaleAsync(saleId))
            {
                throw new Exception("Sale cannot be refunded");
            }

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                // Update sale status
                sale.Status = "refunded";
                sale.RefundReason = reason;
                sale.RefundedAt = DateTime.UtcNow;
                sale.RefundedBy = refundedBy;
                _unitOfWork.Sales.Update(sale);

                // Return quantities to batches
                foreach (var item in sale.SaleItems)
                {
                    var batch = await _unitOfWork.MedicineBatches.GetByIdAsync(item.MedicineBatchId);
                    if (batch != null)
                    {
                        batch.RemainingQuantity += item.Quantity;
                        if (batch.Status == "depleted" && batch.RemainingQuantity > 0)
                        {
                            batch.Status = "active";
                        }
                        _unitOfWork.MedicineBatches.Update(batch);
                    }
                }

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return sale;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<bool> CanRefundSaleAsync(int saleId)
        {
            var sale = await GetSaleByIdAsync(saleId);
            if (sale == null) return false;

            // Can only refund completed sales
            if (sale.Status != "completed") return false;

            // Optional: Add time limit for refunds (e.g., within 30 days)
            // var daysSinceSale = (DateTime.UtcNow - sale.SaleDate).Days;
            // if (daysSinceSale > 30) return false;

            return true;
        }

        public async Task<decimal> GetTotalSalesAmountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            IEnumerable<Sale> sales;

            if (startDate.HasValue && endDate.HasValue)
            {
                sales = await GetSalesByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                sales = await GetAllSalesAsync();
            }

            return sales.Where(s => s.Status == "completed").Sum(s => s.TotalAmount);
        }

        public async Task<int> GetTotalSalesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            IEnumerable<Sale> sales;

            if (startDate.HasValue && endDate.HasValue)
            {
                sales = await GetSalesByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                sales = await GetAllSalesAsync();
            }

            return sales.Count(s => s.Status == "completed");
        }

        public async Task<decimal> GetTotalProfitAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            IEnumerable<Sale> sales;

            if (startDate.HasValue && endDate.HasValue)
            {
                sales = await GetSalesByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                sales = await GetAllSalesAsync();
            }

            decimal totalProfit = 0;
            foreach (var sale in sales.Where(s => s.Status == "completed"))
            {
                foreach (var item in sale.SaleItems)
                {
                    totalProfit += item.Profit;
                }
            }

            return totalProfit;
        }

        public async Task<IEnumerable<Sale>> GetTopSalesAsync(int count = 10)
        {
            var sales = await GetAllSalesAsync();
            return sales
                .Where(s => s.Status == "completed")
                .OrderByDescending(s => s.TotalAmount)
                .Take(count);
        }

        public async Task<Dictionary<string, decimal>> GetSalesByPaymentMethodAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            IEnumerable<Sale> sales;

            if (startDate.HasValue && endDate.HasValue)
            {
                sales = await GetSalesByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                sales = await GetAllSalesAsync();
            }

            return sales
                .Where(s => s.Status == "completed")
                .GroupBy(s => s.PaymentMethod)
                .ToDictionary(g => g.Key, g => g.Sum(s => s.TotalAmount));
        }
    }
}
