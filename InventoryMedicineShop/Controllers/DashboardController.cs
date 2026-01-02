using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for the dashboard page
    /// </summary>
    public class DashboardController : Controller
    {
        private readonly IDashboardService _dashboardService;
        private readonly IMedicineService _medicineService;
        private readonly ISaleService _saleService;

        public DashboardController(
            IDashboardService dashboardService,
            IMedicineService medicineService,
            ISaleService saleService)
        {
            _dashboardService = dashboardService;
            _medicineService = medicineService;
            _saleService = saleService;
        }

        /// <summary>
        /// Display dashboard page with overview statistics
        /// </summary>
        /// <returns>Dashboard view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var overview = await _dashboardService.GetDashboardOverviewAsync();
                return View(overview);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading dashboard: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get sales chart data (for AJAX requests)
        /// </summary>
        /// <param name="days">Number of days</param>
        /// <returns>JSON with chart data</returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesChartData(int days = 30)
        {
            try
            {
                var chartData = await _dashboardService.GetSalesChartDataAsync(days);
                return Json(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get top selling medicines chart data
        /// </summary>
        /// <param name="top">Number of top items</param>
        /// <returns>JSON with chart data</returns>
        [HttpGet]
        public async Task<IActionResult> GetTopSellingMedicinesChart(int top = 10)
        {
            try
            {
                var chartData = await _dashboardService.GetTopSellingMedicinesChartAsync(top);
                return Json(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales by payment method chart data
        /// </summary>
        /// <param name="days">Number of days</param>
        /// <returns>JSON with chart data</returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesByPaymentMethodChart(int days = 30)
        {
            try
            {
                var chartData = await _dashboardService.GetSalesByPaymentMethodChartAsync(days);
                return Json(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get inventory by category chart data
        /// </summary>
        /// <returns>JSON with chart data</returns>
        [HttpGet]
        public async Task<IActionResult> GetInventoryByCategoryChart()
        {
            try
            {
                var chartData = await _dashboardService.GetInventoryByCategoryChartAsync();
                return Json(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get monthly sales chart data
        /// </summary>
        /// <param name="months">Number of months</param>
        /// <returns>JSON with chart data</returns>
        [HttpGet]
        public async Task<IActionResult> GetMonthlySalesChart(int months = 12)
        {
            try
            {
                var chartData = await _dashboardService.GetMonthlySalesChartAsync(months);
                return Json(new { success = true, data = chartData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get recent activities
        /// </summary>
        /// <param name="count">Number of activities</param>
        /// <returns>JSON with activities</returns>
        [HttpGet]
        public async Task<IActionResult> GetRecentActivities(int count = 10)
        {
            try
            {
                var activities = await _dashboardService.GetRecentActivitiesAsync(count);
                return Json(new { success = true, data = activities });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get stock movements
        /// </summary>
        /// <param name="days">Number of days</param>
        /// <returns>JSON with stock movements</returns>
        [HttpGet]
        public async Task<IActionResult> GetStockMovements(int days = 7)
        {
            try
            {
                var movements = await _dashboardService.GetStockMovementsAsync(days);
                return Json(new { success = true, data = movements });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get low stock alerts
        /// </summary>
        /// <returns>JSON with low stock medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetLowStockAlerts()
        {
            try
            {
                var lowStockMedicines = await _medicineService.GetLowStockMedicinesAsync();
                return Json(new { success = true, data = lowStockMedicines });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expiry alerts
        /// </summary>
        /// <param name="days">Days until expiry</param>
        /// <returns>JSON with expiring batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiryAlerts(int days = 90)
        {
            try
            {
                var expiringBatches = await _dashboardService.GetExpiryAlertsAsync(days);
                return Json(new { success = true, data = expiringBatches });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Refresh dashboard statistics
        /// </summary>
        /// <returns>JSON with updated statistics</returns>
        [HttpPost]
        public async Task<IActionResult> RefreshStatistics()
        {
            try
            {
                var overview = await _dashboardService.GetDashboardOverviewAsync();
                return Json(new { success = true, data = overview });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
