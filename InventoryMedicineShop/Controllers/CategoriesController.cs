using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing categories
    /// </summary>
    public class CategoriesController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Display categories page
        /// </summary>
        /// <returns>Categories view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return View(categories);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading categories: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all categories (AJAX)
        /// </summary>
        /// <returns>JSON with categories</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Json(new { success = true, data = categories });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get active categories only (AJAX)
        /// </summary>
        /// <returns>JSON with active categories</returns>
        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var categories = await _categoryService.GetActiveCategoriesAsync();
                return Json(new { success = true, data = categories });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get category by ID (AJAX)
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>JSON with category</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return Json(new { success = false, message = "Category not found" });
                }
                return Json(new { success = true, data = category });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new category
        /// </summary>
        /// <param name="category">Category object</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Check if category code already exists
                var exists = await _categoryService.CategoryExistsAsync(category.Name, category.Code);
                if (exists)
                {
                    return Json(new { success = false, message = "Category with this name or code already exists" });
                }

                var createdCategory = await _categoryService.CreateCategoryAsync(category);
                return Json(new { success = true, message = "Category created successfully", data = createdCategory });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing category
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <param name="category">Updated category object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] Category category)
        {
            try
            {
                if (id != category.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingCategory = await _categoryService.GetCategoryByIdAsync(id);
                if (existingCategory == null)
                {
                    return Json(new { success = false, message = "Category not found" });
                }

                var updatedCategory = await _categoryService.UpdateCategoryAsync(category);
                return Json(new { success = true, message = "Category updated successfully", data = updatedCategory });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete category
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return Json(new { success = false, message = "Category not found" });
                }

                // Check if category can be deleted (no medicines assigned)
                var canDelete = await _categoryService.CanDeleteCategoryAsync(id);
                if (!canDelete)
                {
                    return Json(new { success = false, message = "Cannot delete category with assigned medicines" });
                }

                await _categoryService.DeleteCategoryAsync(id);
                return Json(new { success = true, message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Toggle category active status
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> ToggleActive(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return Json(new { success = false, message = "Category not found" });
                }

                category.IsActive = !category.IsActive;
                await _categoryService.UpdateCategoryAsync(category);

                return Json(new 
                { 
                    success = true, 
                    message = $"Category {(category.IsActive ? "activated" : "deactivated")} successfully",
                    isActive = category.IsActive
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicine count by category
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>JSON with count</returns>
        [HttpGet]
        public async Task<IActionResult> GetMedicineCount(int id)
        {
            try
            {
                var count = await _categoryService.GetMedicineCountByCategoryAsync(id);
                return Json(new { success = true, count = count });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
