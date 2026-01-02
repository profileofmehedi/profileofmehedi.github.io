using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Service implementation for Application Settings operations
    /// </summary>
    public class AppSettingsService : IAppSettingsService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AppSettingsService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AppSettings>> GetAllSettingsAsync()
        {
            return await _unitOfWork.AppSettings.GetAllAsync();
        }

        public async Task<AppSettings?> GetSettingByIdAsync(int id)
        {
            return await _unitOfWork.AppSettings.GetByIdAsync(id);
        }

        public async Task<AppSettings?> GetSettingByKeyAsync(string key)
        {
            return await _unitOfWork.AppSettings.FirstOrDefaultAsync(s => s.Key == key);
        }

        public async Task<IEnumerable<AppSettings>> GetSettingsByCategoryAsync(string category)
        {
            return await _unitOfWork.AppSettings.FindAsync(s => s.Category == category);
        }

        public async Task<string?> GetSettingValueAsync(string key)
        {
            var setting = await GetSettingByKeyAsync(key);
            return setting?.Value;
        }

        public async Task<T?> GetSettingValueAsync<T>(string key)
        {
            var setting = await GetSettingByKeyAsync(key);
            if (setting == null) return default;

            try
            {
                if (typeof(T) == typeof(string))
                {
                    return (T)(object)setting.Value;
                }
                else if (typeof(T) == typeof(int))
                {
                    return (T)(object)int.Parse(setting.Value);
                }
                else if (typeof(T) == typeof(decimal))
                {
                    return (T)(object)decimal.Parse(setting.Value);
                }
                else if (typeof(T) == typeof(bool))
                {
                    return (T)(object)bool.Parse(setting.Value);
                }
                else
                {
                    return JsonSerializer.Deserialize<T>(setting.Value);
                }
            }
            catch
            {
                return default;
            }
        }

        public async Task<AppSettings> CreateSettingAsync(AppSettings setting)
        {
            await _unitOfWork.AppSettings.AddAsync(setting);
            await _unitOfWork.SaveChangesAsync();
            return setting;
        }

        public async Task<AppSettings> UpdateSettingAsync(AppSettings setting)
        {
            _unitOfWork.AppSettings.Update(setting);
            await _unitOfWork.SaveChangesAsync();
            return setting;
        }

        public async Task<bool> UpdateSettingValueAsync(string key, string value)
        {
            var setting = await GetSettingByKeyAsync(key);
            if (setting == null) return false;

            setting.Value = value;
            _unitOfWork.AppSettings.Update(setting);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSettingAsync(int id)
        {
            var setting = await _unitOfWork.AppSettings.GetByIdAsync(id);
            if (setting == null) return false;

            _unitOfWork.AppSettings.SoftDelete(setting);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SettingExistsAsync(string key)
        {
            return await _unitOfWork.AppSettings.AnyAsync(s => s.Key == key);
        }

        // Common settings helpers
        public async Task<string> GetShopNameAsync()
        {
            return await GetSettingValueAsync("ShopName") ?? "MediShop Inventory";
        }

        public async Task<string> GetCurrencyAsync()
        {
            return await GetSettingValueAsync("Currency") ?? "USD";
        }

        public async Task<decimal> GetTaxRateAsync()
        {
            var value = await GetSettingValueAsync<decimal>("TaxRate");
            return value;
        }

        public async Task<int> GetExpiryAlertDaysAsync()
        {
            var value = await GetSettingValueAsync<int>("ExpiryAlertDays");
            return value > 0 ? value : 90;
        }

        public async Task<bool> GetLowStockAlertEnabledAsync()
        {
            var value = await GetSettingValueAsync<bool>("LowStockAlert");
            return value;
        }
    }
}
