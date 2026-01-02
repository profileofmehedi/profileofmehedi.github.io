using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a medicine supplier
    /// </summary>
    [Table("Suppliers")]
    public class Supplier : BaseEntity
    {
        [Required(ErrorMessage = "Supplier name is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Supplier name must be between 2 and 200 characters")]
        [Display(Name = "Supplier Name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Contact person is required")]
        [StringLength(100)]
        [Display(Name = "Contact Person")]
        public string ContactPerson { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(20)]
        [Phone(ErrorMessage = "Invalid phone number")]
        [Display(Name = "Phone Number")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(500)]
        [Display(Name = "Address")]
        [DataType(DataType.MultilineText)]
        public string Address { get; set; } = string.Empty;

        [StringLength(100)]
        [Display(Name = "City")]
        public string? City { get; set; }

        [StringLength(100)]
        [Display(Name = "State/Province")]
        public string? State { get; set; }

        [StringLength(20)]
        [Display(Name = "Postal Code")]
        public string? PostalCode { get; set; }

        [StringLength(100)]
        [Display(Name = "Country")]
        public string? Country { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;

        [StringLength(1000)]
        [Display(Name = "Notes")]
        [DataType(DataType.MultilineText)]
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual ICollection<MedicineBatch> MedicineBatches { get; set; } = new HashSet<MedicineBatch>();
    }
}
