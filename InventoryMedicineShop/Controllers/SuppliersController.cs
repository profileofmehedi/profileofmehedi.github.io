using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing suppliers
    /// </summary>
    public class SuppliersController : Controller
    {
        private readonly ISupplierService _supplierService;

        public SuppliersController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        /// <summary>
        /// Display suppliers page
        /// </summary>
        /// <returns>Suppliers view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var suppliers = await _supplierService.GetAllSuppliersAsync();
                return View(suppliers);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading suppliers: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all suppliers (AJAX)
        /// </summary>
        /// <returns>JSON with suppliers</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var suppliers = await _supplierService.GetAllSuppliersAsync();
                return Json(new { success = true, data = suppliers });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get active suppliers only (AJAX)
        /// </summary>
        /// <returns>JSON with active suppliers</returns>
        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var suppliers = await _supplierService.GetActiveSuppliersAsync();
                return Json(new { success = true, data = suppliers });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get supplier by ID (AJAX)
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with supplier</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var supplier = await _supplierService.GetSupplierByIdAsync(id);
                if (supplier == null)
                {
                    return Json(new { success = false, message = "Supplier not found" });
                }
                return Json(new { success = true, data = supplier });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get supplier batches
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with supplier's medicine batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetSupplierBatches(int id)
        {
            try
            {
                var batches = await _supplierService.GetSupplierBatchesAsync(id);
                return Json(new { success = true, data = batches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get total purchases by supplier
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with total purchase amount</returns>
        [HttpGet]
        public async Task<IActionResult> GetTotalPurchases(int id)
        {
            try
            {
                var total = await _supplierService.GetTotalPurchasesBySupplierAsync(id);
                return Json(new { success = true, totalPurchases = total });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new supplier
        /// </summary>
        /// <param name="supplier">Supplier object</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] Supplier supplier)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Check if email already exists
                if (!string.IsNullOrEmpty(supplier.Email))
                {
                    var exists = await _supplierService.SupplierExistsAsync(supplier.Name, supplier.Email);
                    if (exists)
                    {
                        return Json(new { success = false, message = "Supplier with this name or email already exists" });
                    }
                }

                var createdSupplier = await _supplierService.CreateSupplierAsync(supplier);
                return Json(new { success = true, message = "Supplier created successfully", data = createdSupplier });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing supplier
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <param name="supplier">Updated supplier object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] Supplier supplier)
        {
            try
            {
                if (id != supplier.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingSupplier = await _supplierService.GetSupplierByIdAsync(id);
                if (existingSupplier == null)
                {
                    return Json(new { success = false, message = "Supplier not found" });
                }

                var updatedSupplier = await _supplierService.UpdateSupplierAsync(supplier);
                return Json(new { success = true, message = "Supplier updated successfully", data = updatedSupplier });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete supplier
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var supplier = await _supplierService.GetSupplierByIdAsync(id);
                if (supplier == null)
                {
                    return Json(new { success = false, message = "Supplier not found" });
                }

                // Check if supplier can be deleted (no batches assigned)
                var canDelete = await _supplierService.CanDeleteSupplierAsync(id);
                if (!canDelete)
                {
                    return Json(new { success = false, message = "Cannot delete supplier with assigned batches" });
                }

                await _supplierService.DeleteSupplierAsync(id);
                return Json(new { success = true, message = "Supplier deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Toggle supplier active status
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var supplier = await _supplierService.GetSupplierByIdAsync(id);
                if (supplier == null)
                {
                    return Json(new { success = false, message = "Supplier not found" });
                }

                supplier.IsActive = !supplier.IsActive;
                await _supplierService.UpdateSupplierAsync(supplier);

                return Json(new 
                { 
                    success = true, 
                    message = $"Supplier {(supplier.IsActive ? "activated" : "deactivated")} successfully",
                    isActive = supplier.IsActive
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Check if supplier email exists
        /// </summary>
        /// <param name="email">Email address</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>JSON with result</returns>
        [HttpGet]
        public async Task<IActionResult> CheckEmailExists(string email, int? excludeId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return Json(new { exists = false });
                }

                var supplier = await _supplierService.GetSupplierByEmailAsync(email);
                var exists = supplier != null && supplier.Id != excludeId;
                return Json(new { exists = exists });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get supplier statistics
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>JSON with supplier statistics</returns>
        [HttpGet]
        public async Task<IActionResult> GetStatistics(int id)
        {
            try
            {
                var supplier = await _supplierService.GetSupplierByIdAsync(id);
                if (supplier == null)
                {
                    return Json(new { success = false, message = "Supplier not found" });
                }

                var batches = await _supplierService.GetSupplierBatchesAsync(id);
                var totalPurchases = await _supplierService.GetTotalPurchasesBySupplierAsync(id);

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        supplier = supplier,
                        totalBatches = batches.Count,
                        totalPurchases = totalPurchases,
                        activeBatches = batches.FindAll(b => b.Status == "active").Count
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
