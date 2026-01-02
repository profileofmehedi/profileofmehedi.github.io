using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for managing users
    /// </summary>
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthenticationService _authenticationService;

        public UsersController(
            IUserService userService,
            IAuthenticationService authenticationService)
        {
            _userService = userService;
            _authenticationService = authenticationService;
        }

        /// <summary>
        /// Display users page
        /// </summary>
        /// <returns>Users view</returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return View(users);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error loading users: {ex.Message}";
                return View();
            }
        }

        /// <summary>
        /// Get all users (AJAX)
        /// </summary>
        /// <returns>JSON with users</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Json(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID (AJAX)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>JSON with user</returns>
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }
                // Don't send password hash to client
                user.PasswordHash = null;
                return Json(new { success = true, data = user });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get users by role
        /// </summary>
        /// <param name="role">User role (Admin, Manager, Cashier, Pharmacist)</param>
        /// <returns>JSON with users</returns>
        [HttpGet]
        public async Task<IActionResult> GetByRole(string role)
        {
            try
            {
                var users = await _userService.GetUsersByRoleAsync(role);
                return Json(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Create new user
        /// </summary>
        /// <param name="model">User creation model</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody] UserCreateModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                // Check if username exists
                var existingUser = await _userService.GetUserByUsernameAsync(model.Username);
                if (existingUser != null)
                {
                    return Json(new { success = false, message = "Username already exists" });
                }

                // Check if email exists
                if (!string.IsNullOrEmpty(model.Email))
                {
                    existingUser = await _userService.GetUserByEmailAsync(model.Email);
                    if (existingUser != null)
                    {
                        return Json(new { success = false, message = "Email already exists" });
                    }
                }

                // Create user with hashed password
                var createdUser = await _userService.CreateUserAsync(
                    model.Username,
                    model.Email,
                    model.Password,
                    model.FullName,
                    model.Role
                );

                // Don't send password hash to client
                createdUser.PasswordHash = null;

                return Json(new { success = true, message = "User created successfully", data = createdUser });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update existing user
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="user">Updated user object</param>
        /// <returns>JSON with result</returns>
        [HttpPut]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, [FromBody] User user)
        {
            try
            {
                if (id != user.Id)
                {
                    return Json(new { success = false, message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data" });
                }

                var existingUser = await _userService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                // Don't allow password hash to be updated through this endpoint
                user.PasswordHash = existingUser.PasswordHash;

                var updatedUser = await _userService.UpdateUserAsync(user);
                
                // Don't send password hash to client
                updatedUser.PasswordHash = null;

                return Json(new { success = true, message = "User updated successfully", data = updatedUser });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete user
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>JSON with result</returns>
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                // Don't allow deleting the last admin
                if (user.Role == "Admin")
                {
                    var admins = await _userService.GetUsersByRoleAsync("Admin");
                    if (admins.Count <= 1)
                    {
                        return Json(new { success = false, message = "Cannot delete the last admin user" });
                    }
                }

                await _userService.DeleteUserAsync(id);
                return Json(new { success = true, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Change user password
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="model">Password change model</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] PasswordChangeModel model)
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

                var success = await _userService.UpdatePasswordAsync(id, model.CurrentPassword, model.NewPassword);
                
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
        /// Deactivate user
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> Deactivate(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                await _userService.DeactivateUserAsync(id);
                return Json(new { success = true, message = "User deactivated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Activate user
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> Activate(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                await _userService.ActivateUserAsync(id);
                return Json(new { success = true, message = "User activated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Unlock user account
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>JSON with result</returns>
        [HttpPost]
        public async Task<IActionResult> Unlock(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return Json(new { success = false, message = "User not found" });
                }

                await _authenticationService.UnlockAccountAsync(id);
                return Json(new { success = true, message = "User account unlocked successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Check if username exists
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>JSON with result</returns>
        [HttpGet]
        public async Task<IActionResult> CheckUsernameExists(string username, int? excludeId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    return Json(new { exists = false });
                }

                var user = await _userService.GetUserByUsernameAsync(username);
                var exists = user != null && user.Id != excludeId;
                return Json(new { exists = exists });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Check if email exists
        /// </summary>
        /// <param name="email">Email address</param>
        /// <param name="excludeId">ID to exclude from check (for updates)</param>
        /// <returns>JSON with result</returns>
        [HttpGet]
        public async Task<IActionResult> CheckEmailExists(string email, int? excludeId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return Json(new { exists = false });
                }

                var user = await _userService.GetUserByEmailAsync(email);
                var exists = user != null && user.Id != excludeId;
                return Json(new { exists = exists });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }

    /// <summary>
    /// Model for creating a user
    /// </summary>
    public class UserCreateModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }

    /// <summary>
    /// Model for changing password
    /// </summary>
    public class PasswordChangeModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
