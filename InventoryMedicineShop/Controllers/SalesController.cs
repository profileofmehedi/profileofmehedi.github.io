using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing sales
    /// </summary>
    public class SalesController : Controller
    {
        private readonly ISaleService _saleService;
        private readonly ISaleItemService _saleItemService;
        private readonly IMedicineService _medicineService;
        private readonly IMedicineBatchService _medicineBatchService;

        public SalesController(
            ISaleService saleService,
            ISaleItemService saleItemService,
            IMedicineService medicineService,
            IMedicineBatchService medicineBatchService)
        {
            _saleService = saleService;
            _saleItemService = saleItemService;
            _medicineService = medicineService;
            _medicineBatchService = medicineBatchService;
        }

        /// <summary>
        /// Display sales page
        /// </summary>
        /// <returns>Sales view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var sales = await _saleService.GetAllSalesAsync();
                ViewBag.Medicines = await _medicineService.GetAllMedicinesAsync();
                return View(sales);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading sales: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all sales (AJAX)
        /// </summary>
        /// <returns>JSON with sales</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var sales = await _saleService.GetAllSalesAsync();
                return Json(new { success = true, data = sales });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sale by ID (AJAX)
        /// </summary>
        /// <param name="id">Sale ID</param>
        /// <returns>JSON with sale details</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var sale = await _saleService.GetSaleByIdAsync(id);
                if (sale == null)
                {
                    return Json(new { success = false, message = "Sale not found" });
                }
                return Json(new { success = true, data = sale });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales by date range
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with sales</returns>
        [HttpGet]
        public async Task<IActionResult> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            try
            {
                var sales = await _saleService.GetSalesByDateRangeAsync(startDate, endDate);
                return Json(new { success = true, data = sales });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales by user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>JSON with sales</returns>
        [HttpGet]
        public async Task<IActionResult> GetByUser(int userId)
        {
            try
            {
                var sales = await _saleService.GetSalesByUserAsync(userId);
                return Json(new { success = true, data = sales });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sale items for a specific sale
        /// </summary>
        /// <param name="saleId">Sale ID</param>
        /// <returns>JSON with sale items</returns>
        [HttpGet]
        public async Task<IActionResult> GetSaleItems(int saleId)
        {
            try
            {
                var saleItems = await _saleItemService.GetSaleItemsBySaleAsync(saleId);
                return Json(new { success = true, data = saleItems });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new sale with items (uses FEFO for batch selection)
        /// </summary>
        /// <param name="sale">Sale object</param>
        /// <param name="items">List of sale items</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] SaleCreateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Validate all items have sufficient stock
                foreach (var item in model.Items)
                {
                    var totalStock = await _medicineService.GetTotalStockAsync(item.MedicineId);
                    if (totalStock < item.Quantity)
                    {
                        var medicine = await _medicineService.GetMedicineByIdAsync(item.MedicineId);
                        return Json(new { success = false, message = $"Insufficient stock for {medicine?.Name}. Available: {totalStock}, Required: {item.Quantity}" });
                    }
                }

                // Get current user ID from session (you can implement proper authentication)
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "User not authenticated" });
                }
                model.Sale.UserId = int.Parse(userIdString);

                // Generate sale number
                model.Sale.SaleNumber = await _saleService.GenerateSaleNumberAsync();
                model.Sale.SaleDate = DateTime.Now;
                model.Sale.Status = "completed";

                // Create sale with items (FEFO will be applied automatically)
                var createdSale = await _saleService.CreateSaleWithItemsAsync(model.Sale, model.Items);

                return Json(new 
                { 
                    success = true, 
                    message = "Sale created successfully", 
                    data = createdSale,
                    saleNumber = createdSale.SaleNumber
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Refund a sale
        /// </summary>
        /// <param name="id">Sale ID</param>
        /// <param name="reason">Refund reason</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Refund(int id, string reason)
        {
            try
            {
                var sale = await _saleService.GetSaleByIdAsync(id);
                if (sale == null)
                {
                    return Json(new { success = false, message = "Sale not found" });
                }

                var canRefund = await _saleService.CanRefundSaleAsync(id);
                if (!canRefund)
                {
                    return Json(new { success = false, message = "This sale cannot be refunded" });
                }

                await _saleService.RefundSaleAsync(id);

                return Json(new 
                { 
                    success = true, 
                    message = $"Sale refunded successfully. Reason: {reason}"
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get sales statistics
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with statistics</returns>
        [HttpGet]
        public async Task<IActionResult> GetStatistics(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate ??= DateTime.Now.Date;
                endDate ??= DateTime.Now.Date.AddDays(1).AddSeconds(-1);

                var totalAmount = await _saleService.GetTotalSalesAmountAsync(startDate.Value, endDate.Value);
                var totalProfit = await _saleService.GetTotalProfitAsync(startDate.Value, endDate.Value);
                var salesByPaymentMethod = await _saleService.GetSalesByPaymentMethodAsync(startDate.Value, endDate.Value);

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        totalAmount = totalAmount,
                        totalProfit = totalProfit,
                        salesByPaymentMethod = salesByPaymentMethod,
                        dateRange = new { startDate, endDate }
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get top selling items
        /// </summary>
        /// <param name="top">Number of top items</param>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>JSON with top selling items</returns>
        [HttpGet]
        public async Task<IActionResult> GetTopSellingItems(int top = 10, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                var topItems = await _saleItemService.GetTopSellingItemsAsync(top, startDate, endDate);
                return Json(new { success = true, data = topItems });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Calculate sale totals (for preview before creating sale)
        /// </summary>
        /// <param name="items">List of items with medicine ID and quantity</param>
        /// <returns>JSON with calculated totals</returns>
        [HttpPost]
        public async Task<IActionResult> CalculateTotals([FromBody] List<SaleItemInput> items)
        {
            try
            {
                decimal subtotal = 0;
                decimal totalDiscount = 0;
                decimal totalTax = 0;
                var itemDetails = new List<object>();

                foreach (var item in items)
                {
                    // Get available batches for this medicine (FEFO)
                    var batches = await _medicineBatchService.GetAvailableBatchesForSaleAsync(item.MedicineId);
                    
                    if (!batches.Any() || batches.Sum(b => b.RemainingQuantity) < item.Quantity)
                    {
                        var medicine = await _medicineService.GetMedicineByIdAsync(item.MedicineId);
                        return Json(new { success = false, message = $"Insufficient stock for {medicine?.Name}" });
                    }

                    // Use the selling price from the first available batch (FEFO)
                    var firstBatch = batches.First();
                    var itemSubtotal = firstBatch.SellingPrice * item.Quantity;
                    var itemDiscount = item.DiscountAmount ?? 0;
                    var itemTax = (itemSubtotal - itemDiscount) * (item.TaxPercentage ?? 0) / 100;

                    subtotal += itemSubtotal;
                    totalDiscount += itemDiscount;
                    totalTax += itemTax;

                    itemDetails.Add(new
                    {
                        medicineId = item.MedicineId,
                        quantity = item.Quantity,
                        unitPrice = firstBatch.SellingPrice,
                        subtotal = itemSubtotal,
                        discount = itemDiscount,
                        tax = itemTax,
                        total = itemSubtotal - itemDiscount + itemTax
                    });
                }

                var grandTotal = subtotal - totalDiscount + totalTax;

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        subtotal = subtotal,
                        totalDiscount = totalDiscount,
                        totalTax = totalTax,
                        grandTotal = grandTotal,
                        items = itemDetails
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Print sale receipt (returns sale data for printing)
        /// </summary>
        /// <param name="id">Sale ID</param>
        /// <returns>JSON with sale data for receipt</returns>
        [HttpGet]
        public async Task<IActionResult> GetReceipt(int id)
        {
            try
            {
                var sale = await _saleService.GetSaleByIdAsync(id);
                if (sale == null)
                {
                    return Json(new { success = false, message = "Sale not found" });
                }

                var saleItems = await _saleItemService.GetSaleItemsBySaleAsync(id);

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        sale = sale,
                        items = saleItems,
                        printDate = DateTime.Now
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }

    /// <summary>
    /// Model for creating a sale
    /// </summary>
    public class SaleCreateModel
    {
        public Sale Sale { get; set; }
        public List<SaleItem> Items { get; set; }
    }

    /// <summary>
    /// Model for sale item input
    /// </summary>
    public class SaleItemInput
    {
        public int MedicineId { get; set; }
        public int Quantity { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? TaxPercentage { get; set; }
    }
}
