using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for generating reports
    /// </summary>
    public class ReportsController : Controller
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Display reports page
        /// </summary>
        /// <returns>Reports view</returns>
        public IActionResult Index()
        {
            return View();
        }

        // ==================== SALES REPORTS ====================

        /// <summary>
        /// Get sales report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with sales report</returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetSalesReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get daily sales report
        /// </summary>
        /// <param name="date">Date</param>
        /// <returns>JSON with daily sales report</returns>
        [HttpGet]
        public async Task<IActionResult> GetDailySalesReport(DateTime? date = null)
        {
            try
            {
                date ??= DateTime.Now.Date;
                var report = await _reportService.GetDailySalesReportAsync(date.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get monthly sales report
        /// </summary>
        /// <param name="year">Year</param>
        /// <param name="month">Month</param>
        /// <returns>JSON with monthly sales report</returns>
        [HttpGet]
        public async Task<IActionResult> GetMonthlySalesReport(int? year = null, int? month = null)
        {
            try
            {
                year ??= DateTime.Now.Year;
                month ??= DateTime.Now.Month;

                var report = await _reportService.GetMonthlySalesReportAsync(year.Value, month.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get yearly sales report
        /// </summary>
        /// <param name="year">Year</param>
        /// <returns>JSON with yearly sales report</returns>
        [HttpGet]
        public async Task<IActionResult> GetYearlySalesReport(int? year = null)
        {
            try
            {
                year ??= DateTime.Now.Year;
                var report = await _reportService.GetYearlySalesReportAsync(year.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales by payment method report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with sales by payment method</returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesByPaymentMethodReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetSalesByPaymentMethodReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales by cashier report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with sales by cashier</returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesByCashierReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetSalesByCashierReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== INVENTORY REPORTS ====================

        /// <summary>
        /// Get inventory report
        /// </summary>
        /// <returns>JSON with full inventory report</returns>
        [HttpGet]
        public async Task<IActionResult> GetInventoryReport()
        {
            try
            {
                var report = await _reportService.GetInventoryReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get batch report
        /// </summary>
        /// <returns>JSON with batch report</returns>
        [HttpGet]
        public async Task<IActionResult> GetBatchReport()
        {
            try
            {
                var report = await _reportService.GetBatchReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get low stock report
        /// </summary>
        /// <returns>JSON with low stock medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetLowStockReport()
        {
            try
            {
                var report = await _reportService.GetLowStockReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get out of stock report
        /// </summary>
        /// <returns>JSON with out of stock medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetOutOfStockReport()
        {
            try
            {
                var report = await _reportService.GetOutOfStockReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get inventory value report
        /// </summary>
        /// <returns>JSON with inventory value report</returns>
        [HttpGet]
        public async Task<IActionResult> GetInventoryValueReport()
        {
            try
            {
                var report = await _reportService.GetInventoryValueReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== EXPIRY REPORTS ====================

        /// <summary>
        /// Get expiry report
        /// </summary>
        /// <param name="days">Days until expiry</param>
        /// <returns>JSON with expiry report</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiryReport(int days = 90)
        {
            try
            {
                var report = await _reportService.GetExpiryReportAsync(days);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expired batches report
        /// </summary>
        /// <returns>JSON with expired batches</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiredBatchesReport()
        {
            try
            {
                var report = await _reportService.GetExpiredBatchesReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get expiring this month report
        /// </summary>
        /// <returns>JSON with batches expiring this month</returns>
        [HttpGet]
        public async Task<IActionResult> GetExpiringThisMonthReport()
        {
            try
            {
                var report = await _reportService.GetExpiringThisMonthReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== MEDICINE REPORTS ====================

        /// <summary>
        /// Get top selling medicines report
        /// </summary>
        /// <param name="top">Number of top items</param>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with top selling medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetTopSellingMedicinesReport(int top = 10, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetTopSellingMedicinesReportAsync(top, startDate, endDate);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get slow moving medicines report
        /// </summary>
        /// <param name="days">Number of days</param>
        /// <returns>JSON with slow moving medicines</returns>
        [HttpGet]
        public async Task<IActionResult> GetSlowMovingMedicinesReport(int days = 90)
        {
            try
            {
                var report = await _reportService.GetSlowMovingMedicinesReportAsync(days);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get medicine sales history
        /// </summary>
        /// <param name="medicineId">Medicine ID</param>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with medicine sales history</returns>
        [HttpGet]
        public async Task<IActionResult> GetMedicineSalesHistory(int medicineId, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-6);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetMedicineSalesHistoryReportAsync(medicineId, startDate, endDate);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== FINANCIAL REPORTS ====================

        /// <summary>
        /// Get profit report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with profit report</returns>
        [HttpGet]
        public async Task<IActionResult> GetProfitReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetProfitReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get profit by medicine report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with profit by medicine</returns>
        [HttpGet]
        public async Task<IActionResult> GetProfitByMedicineReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetProfitByMedicineReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get profit by category report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with profit by category</returns>
        [HttpGet]
        public async Task<IActionResult> GetProfitByCategoryReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetProfitByCategoryReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== SUPPLIER REPORTS ====================

        /// <summary>
        /// Get supplier report
        /// </summary>
        /// <returns>JSON with supplier report</returns>
        [HttpGet]
        public async Task<IActionResult> GetSupplierReport()
        {
            try
            {
                var report = await _reportService.GetSupplierReportAsync();
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get purchases by supplier report
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with purchases by supplier</returns>
        [HttpGet]
        public async Task<IActionResult> GetPurchasesBySupplierReport(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.AddMonths(-1);
                endDate ??= DateTime.Now;

                var report = await _reportService.GetPurchasesBySupplierReportAsync(startDate.Value, endDate.Value);
                return Json(new { success = true, data = report });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // ==================== EXPORT FUNCTIONS ====================

        /// <summary>
        /// Export report to Excel (placeholder)
        /// </summary>
        /// <param name="reportType">Type of report</param>
        /// <returns>Excel file</returns>
        [HttpGet]
        public IActionResult ExportToExcel(string reportType)
        {
            try
            {
                // TODO: Implement Excel export using libraries like EPPlus or ClosedXML
                TempData["Info"] = "Excel export feature coming soon";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error exporting to Excel: {ex.Message}";
                return RedirectToAction("Index");
            }
        }

        /// <summary>
        /// Export report to PDF (placeholder)
        /// </summary>
        /// <param name="reportType">Type of report</param>
        /// <returns>PDF file</returns>
        [HttpGet]
        public IActionResult ExportToPdf(string reportType)
        {
            try
            {
                // TODO: Implement PDF export using libraries like iTextSharp or PdfSharp
                TempData["Info"] = "PDF export feature coming soon";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error exporting to PDF: {ex.Message}";
                return RedirectToAction("Index");
            }
        }
    }
}
