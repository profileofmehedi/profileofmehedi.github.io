using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing application settings
    /// </summary>
    public class SettingsController : Controller
    {
        private readonly IAppSettingsService _appSettingsService;

        public SettingsController(IAppSettingsService appSettingsService)
        {
            _appSettingsService = appSettingsService;
        }

        /// <summary>
        /// Display settings page
        /// </summary>
        /// <returns>Settings view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var settings = await _appSettingsService.GetAllSettingsAsync();
                return View(settings);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading settings: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all settings (AJAX)
        /// </summary>
        /// <returns>JSON with settings</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var settings = await _appSettingsService.GetAllSettingsAsync();
                return Json(new { success = true, data = settings });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get setting by ID (AJAX)
        /// </summary>
        /// <param name="id">Setting ID</param>
        /// <returns>JSON with setting</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var setting = await _appSettingsService.GetSettingByIdAsync(id);
                if (setting == null)
                {
                    return Json(new { success = false, message = "Setting not found" });
                }
                return Json(new { success = true, data = setting });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get setting by key
        /// </summary>
        /// <param name="key">Setting key</param>
        /// <returns>JSON with setting</returns>
        [HttpGet]
        public async Task<IActionResult> GetByKey(string key)
        {
            try
            {
                var setting = await _appSettingsService.GetSettingByKeyAsync(key);
                if (setting == null)
                {
                    return Json(new { success = false, message = "Setting not found" });
                }
                return Json(new { success = true, data = setting });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get setting value
        /// </summary>
        /// <param name="key">Setting key</param>
        /// <returns>JSON with setting value</returns>
        [HttpGet]
        public async Task<IActionResult> GetValue(string key)
        {
            try
            {
                var value = await _appSettingsService.GetSettingValueAsync(key);
                return Json(new { success = true, value = value });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new setting
        /// </summary>
        /// <param name="setting">Setting object</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] AppSettings setting)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Check if key already exists
                var existingSetting = await _appSettingsService.GetSettingByKeyAsync(setting.Key);
                if (existingSetting != null)
                {
                    return Json(new { success = false, message = "Setting with this key already exists" });
                }

                var createdSetting = await _appSettingsService.CreateSettingAsync(setting);
                return Json(new { success = true, message = "Setting created successfully", data = createdSetting });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing setting
        /// </summary>
        /// <param name="id">Setting ID</param>
        /// <param name="setting">Updated setting object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] AppSettings setting)
        {
            try
            {
                if (id != setting.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingSetting = await _appSettingsService.GetSettingByIdAsync(id);
                if (existingSetting == null)
                {
                    return Json(new { success = false, message = "Setting not found" });
                }

                var updatedSetting = await _appSettingsService.UpdateSettingAsync(setting);
                return Json(new { success = true, message = "Setting updated successfully", data = updatedSetting });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update setting value only
        /// </summary>
        /// <param name="key">Setting key</param>
        /// <param name="value">New value</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> UpdateValue(string key, string value)
        {
            try
            {
                if (string.IsNullOrEmpty(key))
                {
                    return Json(new { success = false, message = "Key is required" });
                }

                var success = await _appSettingsService.UpdateSettingValueAsync(key, value);
                
                if (success)
                {
                    return Json(new { success = true, message = "Setting value updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Setting not found" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete setting
        /// </summary>
        /// <param name="id">Setting ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var setting = await _appSettingsService.GetSettingByIdAsync(id);
                if (setting == null)
                {
                    return Json(new { success = false, message = "Setting not found" });
                }

                // Prevent deletion of system settings
                if (setting.IsSystemSetting)
                {
                    return Json(new { success = false, message = "Cannot delete system settings" });
                }

                await _appSettingsService.DeleteSettingAsync(id);
                return Json(new { success = true, message = "Setting deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== SPECIFIC SETTINGS ====================

        /// <summary>
        /// Get shop information
        /// </summary>
        /// <returns>JSON with shop info</returns>
        [HttpGet]
        public async Task<IActionResult> GetShopInfo()
        {
            try
            {
                var shopName = await _appSettingsService.GetShopNameAsync();
                var currency = await _appSettingsService.GetCurrencyAsync();
                var taxRate = await _appSettingsService.GetTaxRateAsync();

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        shopName = shopName,
                        currency = currency,
                        taxRate = taxRate
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update shop name
        /// </summary>
        /// <param name="shopName">Shop name</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> UpdateShopName(string shopName)
        {
            try
            {
                var success = await _appSettingsService.UpdateSettingValueAsync("ShopName", shopName);
                
                if (success)
                {
                    return Json(new { success = true, message = "Shop name updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update shop name" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update currency
        /// </summary>
        /// <param name="currency">Currency code</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> UpdateCurrency(string currency)
        {
            try
            {
                var success = await _appSettingsService.UpdateSettingValueAsync("Currency", currency);
                
                if (success)
                {
                    return Json(new { success = true, message = "Currency updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update currency" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update tax rate
        /// </summary>
        /// <param name="taxRate">Tax rate (decimal)</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> UpdateTaxRate(decimal taxRate)
        {
            try
            {
                var success = await _appSettingsService.UpdateSettingValueAsync("TaxRate", taxRate.ToString());
                
                if (success)
                {
                    return Json(new { success = true, message = "Tax rate updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update tax rate" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update expiry alert days
        /// </summary>
        /// <param name="days">Number of days</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> UpdateExpiryAlertDays(int days)
        {
            try
            {
                var success = await _appSettingsService.UpdateSettingValueAsync("ExpiryAlertDays", days.ToString());
                
                if (success)
                {
                    return Json(new { success = true, message = "Expiry alert days updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update expiry alert days" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get alert settings
        /// </summary>
        /// <returns>JSON with alert settings</returns>
        [HttpGet]
        public async Task<IActionResult> GetAlertSettings()
        {
            try
            {
                var expiryAlertDays = await _appSettingsService.GetExpiryAlertDaysAsync();
                var lowStockThreshold = await _appSettingsService.GetSettingValueAsync<int>("LowStockThreshold");
                var enableExpiryAlerts = await _appSettingsService.GetSettingValueAsync<bool>("EnableExpiryAlerts");
                var enableLowStockAlerts = await _appSettingsService.GetSettingValueAsync<bool>("EnableLowStockAlerts");

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        expiryAlertDays = expiryAlertDays,
                        lowStockThreshold = lowStockThreshold,
                        enableExpiryAlerts = enableExpiryAlerts,
                        enableLowStockAlerts = enableLowStockAlerts
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update multiple settings at once
        /// </summary>
        /// <param name="settings">Dictionary of key-value pairs</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateMultiple([FromBody] System.Collections.Generic.Dictionary<string, string> settings)
        {
            try
            {
                if (settings == null || settings.Count == 0)
                {
                    return Json(new { success = false, message = "No settings provided" });
                }

                var successCount = 0;
                var failedKeys = new System.Collections.Generic.List<string>();

                foreach (var kvp in settings)
                {
                    var success = await _appSettingsService.UpdateSettingValueAsync(kvp.Key, kvp.Value);
                    if (success)
                    {
                        successCount++;
                    }
                    else
                    {
                        failedKeys.Add(kvp.Key);
                    }
                }

                if (failedKeys.Count == 0)
                {
                    return Json(new { success = true, message = $"All {successCount} settings updated successfully" });
                }
                else
                {
                    return Json(new 
                    { 
                        success = false, 
                        message = $"{successCount} settings updated, {failedKeys.Count} failed",
                        failedKeys = failedKeys
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Reset settings to default
        /// </summary>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetToDefault()
        {
            try
            {
                // Reset key settings to default values
                await _appSettingsService.UpdateSettingValueAsync("ShopName", "MediShop Pharmacy");
                await _appSettingsService.UpdateSettingValueAsync("Currency", "USD");
                await _appSettingsService.UpdateSettingValueAsync("TaxRate", "0");
                await _appSettingsService.UpdateSettingValueAsync("ExpiryAlertDays", "90");
                await _appSettingsService.UpdateSettingValueAsync("LowStockThreshold", "50");

                return Json(new { success = true, message = "Settings reset to default successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
