using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents application configuration settings
    /// </summary>
    [Table("AppSettings")]
    public class AppSettings : BaseEntity
    {
        [Required]
        [StringLength(100)]
        [Display(Name = "Setting Key")]
        public string Key { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        [Display(Name = "Setting Value")]
        public string Value { get; set; } = string.Empty;

        [StringLength(200)]
        [Display(Name = "Setting Description")]
        public string? Description { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Setting Category")]
        public string Category { get; set; } = "general"; // general, notification, inventory, sales

        [StringLength(50)]
        [Display(Name = "Data Type")]
        public string DataType { get; set; } = "string"; // string, number, boolean, json

        [Display(Name = "Is System Setting")]
        public bool IsSystemSetting { get; set; } = false;

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;
    }
}
