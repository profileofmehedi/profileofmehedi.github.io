using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Service interface for Application Settings operations
    /// </summary>
    public interface IAppSettingsService
    {
        Task<IEnumerable<AppSettings>> GetAllSettingsAsync();
        Task<AppSettings?> GetSettingByIdAsync(int id);
        Task<AppSettings?> GetSettingByKeyAsync(string key);
        Task<IEnumerable<AppSettings>> GetSettingsByCategoryAsync(string category);
        Task<string?> GetSettingValueAsync(string key);
        Task<T?> GetSettingValueAsync<T>(string key);
        Task<AppSettings> CreateSettingAsync(AppSettings setting);
        Task<AppSettings> UpdateSettingAsync(AppSettings setting);
        Task<bool> UpdateSettingValueAsync(string key, string value);
        Task<bool> DeleteSettingAsync(int id);
        Task<bool> SettingExistsAsync(string key);
        
        // Common settings helpers
        Task<string> GetShopNameAsync();
        Task<string> GetCurrencyAsync();
        Task<decimal> GetTaxRateAsync();
        Task<int> GetExpiryAlertDaysAsync();
        Task<bool> GetLowStockAlertEnabledAsync();
    }
}
