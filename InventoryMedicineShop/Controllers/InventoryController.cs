using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing inventory (medicine batches)
    /// </summary>
    public class InventoryController : Controller
    {
        private readonly IMedicineBatchService _medicineBatchService;
        private readonly IMedicineService _medicineService;
        private readonly ISupplierService _supplierService;

        public InventoryController(
            IMedicineBatchService medicineBatchService,
            IMedicineService medicineService,
            ISupplierService supplierService)
        {
            _medicineBatchService = medicineBatchService;
            _medicineService = medicineService;
            _supplierService = supplierService;
        }

        /// <summary>
        /// Display inventory page (batches)
        /// </summary>
        /// <returns>Inventory view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var batches = await _medicineBatchService.GetAllBatchesAsync();
                ViewBag.Medicines = await _medicineService.GetAllMedicinesAsync();
                ViewBag.Suppliers = await _supplierService.GetActiveSuppliersAsync();
                return View(batches);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading inventory: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all batches (AJAX)
        /// </summary>
        /// <returns>JSON with batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var batches = await _medicineBatchService.GetAllBatchesAsync();
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get batch by ID (AJAX)
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <returns>JSON with batch</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var batch = await _medicineBatchService.GetBatchByIdAsync(id);
                if (batch == null)
                {
                    return Json(new { success = false, message = "Batch not found" });
                }
                return Json(new { success = true, data = batch });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get batches by medicine
        /// </summary>
        /// <param name="medicineId">Medicine ID</param>
        /// <returns>JSON with batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetByMedicine(int medicineId)
        {
            try
            {
                var batches = await _medicineBatchService.GetBatchesByMedicineAsync(medicineId);
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get available batches for sale (FEFO)
        /// </summary>
        /// <param name="medicineId">Medicine ID</param>
        /// <returns>JSON with available batches sorted by FEFO</returns>
        [HttpGet]
        public async Task<IActionResult> GetAvailableForSale(int medicineId)
        {
            try
            {
                var batches = await _medicineBatchService.GetAvailableBatchesForSaleAsync(medicineId);
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expired batches
        /// </summary>
        /// <returns>JSON with expired batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpired()
        {
            try
            {
                var batches = await _medicineBatchService.GetExpiredBatchesAsync();
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expiring batches
        /// </summary>
        /// <param name="days">Days until expiry</param>
        /// <returns>JSON with expiring batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiring(int days = 90)
        {
            try
            {
                var batches = await _medicineBatchService.GetExpiringBatchesAsync(days);
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expired batch value
        /// </summary>
        /// <returns>JSON with total value of expired batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiredValue()
        {
            try
            {
                var value = await _medicineBatchService.GetExpiredBatchValueAsync();
                return Json(new { success = true, value = value });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get total inventory value
        /// </summary>
        /// <returns>JSON with total inventory value</returns>
        [HttpGet]
        public async Task<IActionResult> GetTotalValue()
        {
            try
            {
                var value = await _medicineBatchService.GetTotalInventoryValueAsync();
                return Json(new { success = true, value = value });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new batch
        /// </summary>
        /// <param name="batch">Batch object</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] MedicineBatch batch)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Validate expiry date
                if (batch.ExpiryDate <= DateTime.Now)
                {
                    return Json(new { success = false, message = "Expiry date must be in the future" });
                }

                // Set initial remaining quantity
                batch.RemainingQuantity = batch.Quantity;
                batch.Status = "active";

                var createdBatch = await _medicineBatchService.CreateBatchAsync(batch);
                return Json(new { success = true, message = "Batch created successfully", data = createdBatch });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing batch
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <param name="batch">Updated batch object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] MedicineBatch batch)
        {
            try
            {
                if (id != batch.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingBatch = await _medicineBatchService.GetBatchByIdAsync(id);
                if (existingBatch == null)
                {
                    return Json(new { success = false, message = "Batch not found" });
                }

                var updatedBatch = await _medicineBatchService.UpdateBatchAsync(batch);
                return Json(new { success = true, message = "Batch updated successfully", data = updatedBatch });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete batch
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var batch = await _medicineBatchService.GetBatchByIdAsync(id);
                if (batch == null)
                {
                    return Json(new { success = false, message = "Batch not found" });
                }

                // Check if batch has been used in sales
                if (batch.RemainingQuantity < batch.Quantity)
                {
                    return Json(new { success = false, message = "Cannot delete batch that has been used in sales" });
                }

                await _medicineBatchService.DeleteBatchAsync(id);
                return Json(new { success = true, message = "Batch deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Adjust batch quantity
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <param name="adjustment">Adjustment amount (positive or negative)</param>
        /// <param name="reason">Reason for adjustment</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> AdjustQuantity(int id, int adjustment, string reason)
        {
            try
            {
                var batch = await _medicineBatchService.GetBatchByIdAsync(id);
                if (batch == null)
                {
                    return Json(new { success = false, message = "Batch not found" });
                }

                var newQuantity = batch.RemainingQuantity + adjustment;
                if (newQuantity < 0)
                {
                    return Json(new { success = false, message = "Adjustment would result in negative quantity" });
                }

                batch.RemainingQuantity = newQuantity;
                batch.Quantity += adjustment; // Also adjust total quantity

                // Update status if depleted
                if (batch.RemainingQuantity == 0)
                {
                    batch.Status = "depleted";
                }
                else if (batch.Status == "depleted")
                {
                    batch.Status = "active";
                }

                await _medicineBatchService.UpdateBatchAsync(batch);

                return Json(new 
                { 
                    success = true, 
                    message = $"Quantity adjusted successfully. Reason: {reason}",
                    data = batch
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get batch statistics
        /// </summary>
        /// <returns>JSON with batch statistics</returns>
        [HttpGet]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                var totalValue = await _medicineBatchService.GetTotalInventoryValueAsync();
                var expiredValue = await _medicineBatchService.GetExpiredBatchValueAsync();
                var expiredBatches = await _medicineBatchService.GetExpiredBatchesAsync();
                var expiringBatches = await _medicineBatchService.GetExpiringBatchesAsync(90);

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        totalInventoryValue = totalValue,
                        expiredBatchValue = expiredValue,
                        expiredBatchCount = expiredBatches.Count,
                        expiringBatchCount = expiringBatches.Count
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
