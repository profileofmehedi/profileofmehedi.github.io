using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing medicines
    /// </summary>
    public class MedicinesController : Controller
    {
        private readonly IMedicineService _medicineService;
        private readonly ICategoryService _categoryService;
        private readonly IMedicineBatchService _medicineBatchService;

        public MedicinesController(
            IMedicineService medicineService,
            ICategoryService categoryService,
            IMedicineBatchService medicineBatchService)
        {
            _medicineService = medicineService;
            _categoryService = categoryService;
            _medicineBatchService = medicineBatchService;
        }

        /// <summary>
        /// Display medicines page
        /// </summary>
        /// <returns>Medicines view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var medicines = await _medicineService.GetAllMedicinesAsync();
                ViewBag.Categories = await _categoryService.GetActiveCategoriesAsync();
                return View(medicines);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading medicines: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all medicines (AJAX)
        /// </summary>
        /// <returns>JSON with medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var medicines = await _medicineService.GetAllMedicinesAsync();
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicines with stock information
        /// </summary>
        /// <returns>JSON with medicines including stock info</returns>
        [HttpGet]
        public async Task<IActionResult> GetWithStockInfo()
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesWithStockInfoAsync();
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicine by ID (AJAX)
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <returns>JSON with medicine</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineByIdAsync(id);
                if (medicine == null)
                {
                    return Json(new { success = false, message = "Medicine not found" });
                }
                return Json(new { success = true, data = medicine });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Search medicines
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <returns>JSON with search results</returns>
        [HttpGet]
        public async Task<IActionResult> Search(string searchTerm)
        {
            try
            {
                var medicines = await _medicineService.SearchMedicinesAsync(searchTerm);
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicines by category
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <returns>JSON with medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesByCategoryAsync(categoryId);
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get low stock medicines
        /// </summary>
        /// <returns>JSON with low stock medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetLowStock()
        {
            try
            {
                var medicines = await _medicineService.GetLowStockMedicinesAsync();
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get out of stock medicines
        /// </summary>
        /// <returns>JSON with out of stock medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetOutOfStock()
        {
            try
            {
                var medicines = await _medicineService.GetOutOfStockMedicinesAsync();
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicines requiring reorder
        /// </summary>
        /// <returns>JSON with medicines needing reorder</returns>
        [HttpGet]
        public async Task<IActionResult> GetRequiringReorder()
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesRequiringReorderAsync();
                return Json(new { success = true, data = medicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new medicine
        /// </summary>
        /// <param name="medicine">Medicine object</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] Medicine medicine)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var createdMedicine = await _medicineService.CreateMedicineAsync(medicine);
                return Json(new { success = true, message = "Medicine created successfully", data = createdMedicine });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing medicine
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <param name="medicine">Updated medicine object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] Medicine medicine)
        {
            try
            {
                if (id != medicine.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingMedicine = await _medicineService.GetMedicineByIdAsync(id);
                if (existingMedicine == null)
                {
                    return Json(new { success = false, message = "Medicine not found" });
                }

                var updatedMedicine = await _medicineService.UpdateMedicineAsync(medicine);
                return Json(new { success = true, message = "Medicine updated successfully", data = updatedMedicine });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete medicine
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineByIdAsync(id);
                if (medicine == null)
                {
                    return Json(new { success = false, message = "Medicine not found" });
                }

                await _medicineService.DeleteMedicineAsync(id);
                return Json(new { success = true, message = "Medicine deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get total stock for a medicine
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <returns>JSON with total stock</returns>
        [HttpGet]
        public async Task<IActionResult> GetTotalStock(int id)
        {
            try
            {
                var totalStock = await _medicineService.GetTotalStockAsync(id);
                return Json(new { success = true, totalStock = totalStock });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get available batches for a medicine
        /// </summary>
        /// <param name="medicineId">Medicine ID</param>
        /// <returns>JSON with available batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetAvailableBatches(int medicineId)
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
        /// Check if medicine code exists
        /// </summary>
        /// <param name="code">Medicine code</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>JSON with result</returns>
        [HttpGet]
        public async Task<IActionResult> CheckCodeExists(string code, int? excludeId = null)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineByCodeAsync(code);
                var exists = medicine != null && medicine.Id != excludeId;
                return Json(new { exists = exists });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Check if barcode exists
        /// </summary>
        /// <param name="barcode">Barcode</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>JSON with result</returns>
        [HttpGet]
        public async Task<IActionResult> CheckBarcodeExists(string barcode, int? excludeId = null)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineByBarcodeAsync(barcode);
                var exists = medicine != null && medicine.Id != excludeId;
                return Json(new { exists = exists });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
