using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a medicine category
    /// </summary>
    [Table("Categories")]
    public class Category : BaseEntity
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
        [Display(Name = "Category Name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        [Display(Name = "Description")]
        [DataType(DataType.MultilineText)]
        public string? Description { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Category Code")]
        public string Code { get; set; } = string.Empty;

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<Medicine> Medicines { get; set; } = new HashSet<Medicine>();
    }
}
