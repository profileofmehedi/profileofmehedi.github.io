using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents an individual item in a sale transaction
    /// </summary>
    [Table("SaleItems")]
    public class SaleItem : BaseEntity
    {
        [Required]
        [Display(Name = "Sale")]
        [ForeignKey(nameof(Sale))]
        public int SaleId { get; set; }

        [Required]
        [Display(Name = "Medicine")]
        [ForeignKey(nameof(Medicine))]
        public int MedicineId { get; set; }

        [Required]
        [Display(Name = "Medicine Batch")]
        [ForeignKey(nameof(MedicineBatch))]
        public int MedicineBatchId { get; set; }

        [Required(ErrorMessage = "Medicine name is required")]
        [StringLength(200)]
        [Display(Name = "Medicine Name")]
        public string MedicineName { get; set; } = string.Empty;

        [StringLength(100)]
        [Display(Name = "Batch Number")]
        public string? BatchNumber { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Unit price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than zero")]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Unit Price")]
        [DataType(DataType.Currency)]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Purchase Price")]
        [DataType(DataType.Currency)]
        public decimal PurchasePrice { get; set; }

        [Column(TypeName = "decimal(5, 2)")]
        [Range(0, 100)]
        [Display(Name = "Discount Percentage")]
        public decimal DiscountPercentage { get; set; } = 0;

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Discount Amount")]
        [DataType(DataType.Currency)]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Tax Amount")]
        [DataType(DataType.Currency)]
        public decimal TaxAmount { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Subtotal")]
        [DataType(DataType.Currency)]
        public decimal Subtotal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Total Amount")]
        [DataType(DataType.Currency)]
        public decimal TotalAmount { get; set; }

        [StringLength(500)]
        [Display(Name = "Notes")]
        [DataType(DataType.MultilineText)]
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual Sale? Sale { get; set; }
        public virtual Medicine? Medicine { get; set; }
        public virtual MedicineBatch? MedicineBatch { get; set; }

        // Computed property - not mapped to database
        [NotMapped]
        [Display(Name = "Profit")]
        [DataType(DataType.Currency)]
        public decimal Profit => (UnitPrice - PurchasePrice) * Quantity;

        [NotMapped]
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage => PurchasePrice > 0 ? ((UnitPrice - PurchasePrice) / PurchasePrice) * 100 : 0;
    }
}
