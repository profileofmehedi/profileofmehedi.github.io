using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a sales transaction
    /// </summary>
    [Table("Sales")]
    public class Sale : BaseEntity
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "Sale Number")]
        public string SaleNumber { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.DateTime)]
        [Display(Name = "Sale Date")]
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Display(Name = "User/Cashier")]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [StringLength(100)]
        [Display(Name = "Customer Name")]
        public string? CustomerName { get; set; }

        [StringLength(20)]
        [Phone(ErrorMessage = "Invalid phone number")]
        [Display(Name = "Customer Phone")]
        public string? CustomerPhone { get; set; }

        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [Display(Name = "Customer Email")]
        public string? CustomerEmail { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Subtotal")]
        [DataType(DataType.Currency)]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Tax Amount")]
        [DataType(DataType.Currency)]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Discount Amount")]
        [DataType(DataType.Currency)]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(5, 2)")]
        [Range(0, 100)]
        [Display(Name = "Discount Percentage")]
        public decimal DiscountPercentage { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Total Amount")]
        [DataType(DataType.Currency)]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Amount Paid")]
        [DataType(DataType.Currency)]
        public decimal AmountPaid { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        [Display(Name = "Change Amount")]
        [DataType(DataType.Currency)]
        public decimal ChangeAmount { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name = "Payment Method")]
        public string PaymentMethod { get; set; } = "cash"; // cash, card, digital, insurance

        [StringLength(100)]
        [Display(Name = "Payment Reference")]
        public string? PaymentReference { get; set; }

        [Required]
        [StringLength(20)]
        [Display(Name = "Sale Status")]
        public string Status { get; set; } = "completed"; // completed, refunded, cancelled, pending

        [StringLength(50)]
        [Display(Name = "Prescription Number")]
        public string? PrescriptionNumber { get; set; }

        [StringLength(100)]
        [Display(Name = "Doctor Name")]
        public string? DoctorName { get; set; }

        [Display(Name = "Has Prescription")]
        public bool HasPrescription { get; set; } = false;

        [StringLength(1000)]
        [Display(Name = "Notes")]
        [DataType(DataType.MultilineText)]
        public string? Notes { get; set; }

        [StringLength(500)]
        [Display(Name = "Refund Reason")]
        [DataType(DataType.MultilineText)]
        public string? RefundReason { get; set; }

        [DataType(DataType.DateTime)]
        [Display(Name = "Refunded At")]
        public DateTime? RefundedAt { get; set; }

        [Display(Name = "Refunded By")]
        public int? RefundedBy { get; set; }

        // Navigation Properties
        public virtual User? User { get; set; }
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new HashSet<SaleItem>();

        // Computed property - not mapped to database
        [NotMapped]
        [Display(Name = "Total Items")]
        public int TotalItems => SaleItems?.Sum(si => si.Quantity) ?? 0;

        [NotMapped]
        [Display(Name = "Is Refunded")]
        public bool IsRefunded => Status == "refunded";
    }
}
