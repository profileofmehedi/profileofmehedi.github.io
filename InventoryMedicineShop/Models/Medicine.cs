using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a medicine item in inventory
    /// </summary>
    [Table("Medicines")]
    public class Medicine : BaseEntity
    {
        [Required(ErrorMessage = "Medicine name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Medicine name must be between 2 and 200 characters")]
        [Display(Name = "Medicine Name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Medicine code is required")]
        [StringLength(50)]
        [Display(Name = "Medicine Code")]
        public string Code { get; set; } = string.Empty;

        [StringLength(100)]
        [Display(Name = "Generic Name")]
        public string? GenericName { get; set; }

        [StringLength(100)]
        [Display(Name = "Manufacturer")]
        public string? Manufacturer { get; set; }

        [Required]
        [Display(Name = "Category")]
        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }

        [StringLength(100)]
        [Display(Name = "Dosage Form")]
        public string? DosageForm { get; set; }

        [StringLength(50)]
        [Display(Name = "Strength")]
        public string? Strength { get; set; }

        [StringLength(50)]
        [Display(Name = "Unit Type")]
        public string? UnitType { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Reorder point must be non-negative")]
        [Display(Name = "Reorder Point")]
        public int ReorderPoint { get; set; } = 20;

        [Range(0, int.MaxValue, ErrorMessage = "Low stock threshold must be non-negative")]
        [Display(Name = "Low Stock Threshold")]
        public int LowStockThreshold { get; set; } = 50;

        [Display(Name = "Requires Prescription")]
        public bool RequiresPrescription { get; set; } = false;

        [StringLength(50)]
        [Display(Name = "Storage Conditions")]
        public string? StorageConditions { get; set; }

        [StringLength(1000)]
        [Display(Name = "Description")]
        [DataType(DataType.MultilineText)]
        public string? Description { get; set; }

        [StringLength(500)]
        [Display(Name = "Side Effects")]
        [DataType(DataType.MultilineText)]
        public string? SideEffects { get; set; }

        [StringLength(500)]
        [Display(Name = "Contraindications")]
        [DataType(DataType.MultilineText)]
        public string? Contraindications { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;

        [StringLength(500)]
        [Display(Name = "Barcode")]
        public string? Barcode { get; set; }

        [StringLength(500)]
        [Display(Name = "Image URL")]
        [DataType(DataType.ImageUrl)]
        public string? ImageUrl { get; set; }

        // Navigation Properties
        public virtual Category? Category { get; set; }
        public virtual ICollection<MedicineBatch> MedicineBatches { get; set; } = new HashSet<MedicineBatch>();

        // Computed property - not mapped to database
        [NotMapped]
        [Display(Name = "Total Stock")]
        public int TotalStock { get; set; }

        [NotMapped]
        [Display(Name = "Nearest Expiry Date")]
        public DateTime? NearestExpiryDate { get; set; }

        [NotMapped]
        [Display(Name = "Stock Status")]
        public string StockStatus { get; set; } = "In Stock";
    }
}
