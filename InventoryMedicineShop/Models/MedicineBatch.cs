using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a batch of medicine with specific expiry date and pricing
    /// </summary>
    [Table("MedicineBatches")]
    public class MedicineBatch : BaseEntity
    {
        [Required]
        [Display(Name = "Medicine")]
        [ForeignKey(nameof(Medicine))]
        public int MedicineId { get; set; }

        [Required(ErrorMessage = "Batch number is required")]
        [StringLength(100)]
        [Display(Name = "Batch Number")]
        public string BatchNumber { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Supplier")]
        [ForeignKey(nameof(Supplier))]
        public int SupplierId { get; set; }

        [Required(ErrorMessage = "Purchase date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Purchase Date")]
        public DateTime PurchaseDate { get; set; }

        [Required(ErrorMessage = "Expiry date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Expiry Date")]
        public DateTime ExpiryDate { get; set; }

        [Required(ErrorMessage = "Manufacture date is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Manufacture Date")]
        public DateTime ManufactureDate { get; set; }

        [Required(ErrorMessage = "Purchase price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Purchase price must be greater than zero")]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Purchase Price")]
        [DataType(DataType.Currency)]
        public decimal PurchasePrice { get; set; }

        [Required(ErrorMessage = "Selling price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Selling price must be greater than zero")]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Selling Price")]
        [DataType(DataType.Currency)]
        public decimal SellingPrice { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "MRP (Maximum Retail Price)")]
        [DataType(DataType.Currency)]
        public decimal? MRP { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        [Display(Name = "Original Quantity")]
        public int Quantity { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Remaining quantity cannot be negative")]
        [Display(Name = "Remaining Quantity")]
        public int RemainingQuantity { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name = "Batch Status")]
        public string Status { get; set; } = "active"; // active, expired, depleted

        [Column(TypeName = "decimal(5, 2)")]
        [Range(0, 100)]
        [Display(Name = "Discount Percentage")]
        public decimal? DiscountPercentage { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Tax Amount")]
        [DataType(DataType.Currency)]
        public decimal? TaxAmount { get; set; }

        [StringLength(500)]
        [Display(Name = "Location/Shelf")]
        public string? Location { get; set; }

        [StringLength(1000)]
        [Display(Name = "Notes")]
        [DataType(DataType.MultilineText)]
        public string? Notes { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual Medicine? Medicine { get; set; }
        public virtual Supplier? Supplier { get; set; }

        // Computed property - not mapped to database
        [NotMapped]
        [Display(Name = "Days Until Expiry")]
        public int DaysUntilExpiry => (ExpiryDate - DateTime.Now).Days;

        [NotMapped]
        [Display(Name = "Is Expired")]
        public bool IsExpired => DateTime.Now > ExpiryDate;

        [NotMapped]
        [Display(Name = "Profit Margin")]
        [DataType(DataType.Currency)]
        public decimal ProfitMargin => SellingPrice - PurchasePrice;

        [NotMapped]
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage => PurchasePrice > 0 ? ((SellingPrice - PurchasePrice) / PurchasePrice) * 100 : 0;
    }
}
