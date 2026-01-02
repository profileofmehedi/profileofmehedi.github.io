using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Represents a system user
    /// </summary>
    [Table("Users")]
    public class User : BaseEntity
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        [Display(Name = "Full Name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(500)]
        [DataType(DataType.Password)]
        [Display(Name = "Password Hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required")]
        [StringLength(20)]
        [Display(Name = "User Role")]
        public string Role { get; set; } = "cashier"; // admin, manager, cashier, pharmacist

        [StringLength(20)]
        [Phone(ErrorMessage = "Invalid phone number")]
        [Display(Name = "Phone Number")]
        public string? Phone { get; set; }

        [StringLength(500)]
        [Display(Name = "Address")]
        [DataType(DataType.MultilineText)]
        public string? Address { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        [Display(Name = "Gender")]
        public string? Gender { get; set; }

        [StringLength(500)]
        [Display(Name = "Profile Picture URL")]
        [DataType(DataType.ImageUrl)]
        public string? ProfilePictureUrl { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;

        [Display(Name = "Email Verified")]
        public bool IsEmailVerified { get; set; } = false;

        [DataType(DataType.DateTime)]
        [Display(Name = "Last Login")]
        public DateTime? LastLogin { get; set; }

        [StringLength(500)]
        [Display(Name = "Password Reset Token")]
        public string? PasswordResetToken { get; set; }

        [DataType(DataType.DateTime)]
        [Display(Name = "Password Reset Token Expiry")]
        public DateTime? PasswordResetTokenExpiry { get; set; }

        [Display(Name = "Failed Login Attempts")]
        public int FailedLoginAttempts { get; set; } = 0;

        [DataType(DataType.DateTime)]
        [Display(Name = "Lockout End")]
        public DateTime? LockoutEnd { get; set; }

        [StringLength(1000)]
        [Display(Name = "Notes")]
        [DataType(DataType.MultilineText)]
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual ICollection<Sale> Sales { get; set; } = new HashSet<Sale>();

        // Computed property - not mapped to database
        [NotMapped]
        [Display(Name = "Is Locked Out")]
        public bool IsLockedOut => LockoutEnd.HasValue && LockoutEnd.Value > DateTime.UtcNow;
    }
}
