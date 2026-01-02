using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Category operations
    /// </summary>
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _unitOfWork.Categories.GetAllAsync();
        }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
        {
            return await _unitOfWork.Categories.FindAsync(c => c.IsActive);
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _unitOfWork.Categories.GetByIdAsync(id);
        }

        public async Task<Category?> GetCategoryByCodeAsync(string code)
        {
            return await _unitOfWork.Categories.FirstOrDefaultAsync(c => c.Code == code);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _unitOfWork.Categories.Update(category);
            await _unitOfWork.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            _unitOfWork.Categories.SoftDelete(category);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CategoryExistsAsync(string code)
        {
            return await _unitOfWork.Categories.AnyAsync(c => c.Code == code);
        }

        public async Task<int> GetMedicineCountByCategoryAsync(int categoryId)
        {
            return await _unitOfWork.Medicines.CountAsync(m => m.CategoryId == categoryId);
        }

        public async Task<bool> CanDeleteCategoryAsync(int categoryId)
        {
            var medicineCount = await GetMedicineCountByCategoryAsync(categoryId);
            return medicineCount == 0;
        }
    }
}
