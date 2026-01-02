using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for user profile management
    /// </summary>
    public class ProfileController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ISaleService _saleService;

        public ProfileController(
            IUserService userService,
            IAuthenticationService authenticationService,
            ISaleService saleService)
        {
            _userService = userService;
            _authenticationService = authenticationService;
            _saleService = saleService;
        }

        /// <summary>
        /// Display profile page
        /// </summary>
        /// <returns>Profile view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                // Get current user ID from session
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return RedirectToAction("Login", "Auth");
                }

                var userId = int.Parse(userIdString);
                var user = await _userService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    TempData["Error"] = "User not found";
                    return RedirectToAction("Login", "Auth");
                }

                // Don't send password hash to view
                user.PasswordHash = null;

                return View(user);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading profile: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get current user profile (AJAX)
        /// </summary>
        /// <returns>JSON with user profile</returns>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "Not authenticated" });
                }

                var userId = int.Parse(userIdString);
                var user = await _userService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                // Don't send password hash
                user.PasswordHash = null;

                return Json(new { success = true, data = user });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update profile information
        /// </summary>
        /// <param name="model">Profile update model</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateModel model)
        {
            try
            {
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "Not authenticated" });
                }

                var userId = int.Parse(userIdString);
                var user = await _userService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                // Update user information
                user.FullName = model.FullName ?? user.FullName;
                user.Email = model.Email ?? user.Email;
                user.Phone = model.Phone ?? user.Phone;

                // Check if email is already used by another user
                if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
                {
                    var existingUser = await _userService.GetUserByEmailAsync(model.Email);
                    if (existingUser != null && existingUser.Id != userId)
                    {
                        return Json(new { success = false, message = "Email already in use" });
                    }
                }

                var updatedUser = await _userService.UpdateUserAsync(user);
                
                // Update session
                HttpContext.Session.SetString("FullName", updatedUser.FullName ?? updatedUser.Username);

                // Don't send password hash
                updatedUser.PasswordHash = null;

                return Json(new { success = true, message = "Profile updated successfully", data = updatedUser });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Change password
        /// </summary>
        /// <param name="model">Password change model</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.CurrentPassword) || string.IsNullOrEmpty(model.NewPassword))
                {
                    return Json(new { success = false, message = "All fields are required" });
                }

                if (model.NewPassword != model.ConfirmPassword)
                {
                    return Json(new { success = false, message = "New passwords do not match" });
                }

                if (model.NewPassword.Length < 8)
                {
                    return Json(new { success = false, message = "Password must be at least 8 characters long" });
                }

                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "Not authenticated" });
                }

                var userId = int.Parse(userIdString);
                var success = await _userService.UpdatePasswordAsync(userId, model.CurrentPassword, model.NewPassword);
                
                if (success)
                {
                    return Json(new { success = true, message = "Password changed successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Current password is incorrect" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user activity summary
        /// </summary>
        /// <returns>JSON with activity summary</returns>
        [HttpGet]
        public async Task<IActionResult> GetActivitySummary()
        {
            try
            {
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "Not authenticated" });
                }

                var userId = int.Parse(userIdString);
                var user = await _userService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                // Get user's sales
                var sales = await _saleService.GetSalesByUserAsync(userId);
                
                // Calculate statistics
                var totalSales = sales.Count;
                var todaySales = sales.FindAll(s => s.SaleDate.Date == DateTime.Now.Date).Count;
                var totalAmount = sales.Sum(s => s.TotalAmount);
                var todayAmount = sales.Where(s => s.SaleDate.Date == DateTime.Now.Date).Sum(s => s.TotalAmount);

                return Json(new 
                { 
                    success = true, 
                    data = new
                    {
                        user = new
                        {
                            username = user.Username,
                            fullName = user.FullName,
                            email = user.Email,
                            role = user.Role,
                            memberSince = user.CreatedAt,
                            lastLogin = user.LastLogin
                        },
                        statistics = new
                        {
                            totalSales = totalSales,
                            todaySales = todaySales,
                            totalAmount = totalAmount,
                            todayAmount = todayAmount,
                            averageSaleAmount = totalSales > 0 ? totalAmount / totalSales : 0
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user's recent sales
        /// </summary>
        /// <param name="count">Number of sales to retrieve</param>
        /// <returns>JSON with recent sales</returns>
        [HttpGet]
        public async Task<IActionResult> GetRecentSales(int count = 10)
        {
            try
            {
                var userIdString = HttpContext.Session.GetString("UserId");
                if (string.IsNullOrEmpty(userIdString))
                {
                    return Json(new { success = false, message = "Not authenticated" });
                }

                var userId = int.Parse(userIdString);
                var sales = await _saleService.GetSalesByUserAsync(userId);
                
                // Get recent sales
                var recentSales = sales
                    .OrderByDescending(s => s.SaleDate)
                    .Take(count)
                    .ToList();

                return Json(new { success = true, data = recentSales });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Upload profile picture (placeholder)
        /// </summary>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public IActionResult UploadProfilePicture()
        {
            try
            {
                // TODO: Implement file upload for profile picture
                TempData["Info"] = "Profile picture upload feature coming soon";
                return Json(new { success = false, message = "Feature not implemented yet" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user preferences (placeholder)
        /// </summary>
        /// <returns>JSON with preferences</returns>
        [HttpGet]
        public IActionResult GetPreferences()
        {
            try
            {
                // TODO: Implement user preferences
                var preferences = new
                {
                    theme = "light",
                    language = "en",
                    notifications = true,
                    emailAlerts = false
                };

                return Json(new { success = true, data = preferences });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update user preferences (placeholder)
        /// </summary>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public IActionResult UpdatePreferences()
        {
            try
            {
                // TODO: Implement preferences update
                return Json(new { success = true, message = "Preferences updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }

    /// <summary>
    /// Model for profile update
    /// </summary>
    public class ProfileUpdateModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    /// <summary>
    /// Model for password change
    /// </summary>
    public class PasswordChangeModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
